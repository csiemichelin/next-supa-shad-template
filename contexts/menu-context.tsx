'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'

export interface MenuItem {
  id: string
  name: string
  price: string
  description: string
  details?: string | null
  image?: string | null
  created_at?: string | null
  order_index?: number | null
}

export interface MenuCategory {
  id: string
  category: string
  items: MenuItem[]
  created_at?: string | null
  order_index?: number | null
}

interface MenuContextType {
  categories: MenuCategory[]
  isLoading: boolean
  refresh: () => Promise<void>
  addCategory: (category: string) => Promise<void>
  updateCategory: (id: string, category: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  addMenuItem: (categoryId: string, item: Omit<MenuItem, 'id'>) => Promise<void>
  updateMenuItem: (categoryId: string, itemId: string, item: Omit<MenuItem, 'id'>) => Promise<void>
  deleteMenuItem: (categoryId: string, itemId: string) => Promise<void>
  moveCategory: (categoryId: string, direction: 'up' | 'down') => Promise<void>
  moveMenuItem: (
    categoryId: string,
    itemId: string,
    direction: 'up' | 'down'
  ) => Promise<void>
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

type MenuCategoryRow = Database['public']['Tables']['menu_categories']['Row']
type MenuItemRow = Database['public']['Tables']['menu_items']['Row']

const mapRowsToCategories = (
  rows: Array<MenuCategoryRow & { menu_items?: MenuItemRow[] }>
): MenuCategory[] =>
  rows
    .map((row) => ({
      id: row.id,
      category: row.category,
      created_at: row.created_at,
      order_index: row.order_index,
      items:
        row.menu_items
          ?.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            details: item.details,
            image: item.image,
            created_at: item.created_at,
            order_index: item.order_index,
          }))
          .sort((a, b) => {
            const orderA = a.order_index ?? Number.MAX_SAFE_INTEGER
            const orderB = b.order_index ?? Number.MAX_SAFE_INTEGER
            if (orderA === orderB) {
              const dateA = a.created_at ?? ''
              const dateB = b.created_at ?? ''
              return dateA.localeCompare(dateB)
            }
            return orderA - orderB
          }) ?? [],
    }))
    .sort((a, b) => {
      const orderA = a.order_index ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order_index ?? Number.MAX_SAFE_INTEGER
      if (orderA === orderB) {
        const dateA = a.created_at ?? ''
        const dateB = b.created_at ?? ''
        return dateA.localeCompare(dateB)
      }
      return orderA - orderB
    })

const ensureMenuCategoryFolder = async (categoryId: string) => {
  const placeholder = new Blob(['folder placeholder'], { type: 'text/plain' })
  const { error } = await supabase.storage
    .from('menu')
    .upload(`${categoryId}/.keep`, placeholder, { upsert: true })

  if (error) {
    console.error('Failed to ensure menu folder', error)
  }
}

const deleteCategoryFolder = async (categoryId: string) => {
  try {
    const response = await fetch(`/api/menu/category-storage?categoryId=${categoryId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Failed to delete category folder', errorData)
    }
  } catch (error) {
    console.error('Failed to call delete category folder API', error)
  }
}

const extractMenuStoragePath = (imageUrl?: string | null) => {
  if (!imageUrl) return null
  try {
    const url = new URL(imageUrl)
    const match = url.pathname.match(/\/storage\/v1\/object\/(?:sign|public)\/menu\/(.+)/)
    if (match?.[1]) {
      return decodeURIComponent(match[1])
    }
  } catch (error) {
    console.error('Failed to parse image url for deletion', error)
  }
  return null
}

const deleteImageFromStorage = async (imageUrl?: string | null) => {
  if (!imageUrl) return
  try {
    const response = await fetch(
      `/api/menu/upload-image?imageUrl=${encodeURIComponent(imageUrl)}`,
      { method: 'DELETE' }
    )
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Failed to delete image via API', errorData)
    }
  } catch (error) {
    console.error('Failed to call delete image API', error)
  }
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchCategories = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('menu_categories')
      .select(`
        id,
        category,
        created_at,
        order_index,
        menu_items (
          id,
          category_id,
          created_at,
          name,
          price,
          description,
          details,
          image,
          order_index
        )
      `)
      .order('order_index', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })
      .order('order_index', { ascending: true, foreignTable: 'menu_items', nullsFirst: false })
      .order('created_at', { ascending: true, foreignTable: 'menu_items' })

    if (error) {
      console.error('Failed to load menu categories', error)
    } else {
      setCategories(mapRowsToCategories(data ?? []))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const refresh = async () => {
    await fetchCategories()
  }

  const addCategory = async (category: string) => {
    const maxOrder = categories.reduce(
      (max, cat) => Math.max(max, cat.order_index ?? 0),
      0
    )
    const nextOrderIndex = maxOrder + 1

    const { data, error } = await supabase
      .from('menu_categories')
      .insert({ category, order_index: nextOrderIndex })
      .select('id, category, created_at, order_index')
      .single()

    if (error) {
      console.error('Failed to add category', error)
      throw error
    }

    await ensureMenuCategoryFolder(data.id)

    setCategories((prev) => [
      ...prev,
      {
        id: data.id,
        category: data.category,
        items: [],
        created_at: data.created_at,
        order_index: data.order_index ?? nextOrderIndex,
      },
    ])
  }

  const updateCategory = async (id: string, category: string) => {
    const { error } = await supabase.from('menu_categories').update({ category }).eq('id', id)
    if (error) {
      console.error('Failed to update category', error)
      throw error
    }

    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, category } : cat))
    )
  }

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('menu_categories').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete category', error)
      throw error
    }
    await deleteCategoryFolder(id)
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  const addMenuItem = async (categoryId: string, item: Omit<MenuItem, 'id'>) => {
    const category = categories.find((cat) => cat.id === categoryId)
    const maxOrder =
      category?.items.reduce(
        (max, current) => Math.max(max, current.order_index ?? 0),
        0
      ) ?? 0
    const nextOrderIndex = maxOrder + 1

    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        category_id: categoryId,
        ...item,
        order_index: nextOrderIndex,
      })
      .select(
        'id, name, price, description, details, image, category_id, created_at, order_index'
      )
      .single()

    if (error) {
      console.error('Failed to add menu item', error)
      throw error
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: [
                ...cat.items,
                {
                  ...item,
                  id: data.id,
                  created_at: data.created_at,
                  order_index: data.order_index ?? nextOrderIndex,
                },
              ],
            }
          : cat
      )
    )
  }

  const updateMenuItem = async (categoryId: string, itemId: string, item: Omit<MenuItem, 'id'>) => {
    const { error } = await supabase.from('menu_items').update(item).eq('id', itemId)
    if (error) {
      console.error('Failed to update menu item', error)
      throw error
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((existing) =>
                existing.id === itemId ? { ...existing, ...item } : existing
              ),
            }
          : cat
      )
    )
  }

  const deleteMenuItem = async (categoryId: string, itemId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    const targetItem = category?.items.find((item) => item.id === itemId)

    const { error } = await supabase.from('menu_items').delete().eq('id', itemId)
    if (error) {
      console.error('Failed to delete menu item', error)
      throw error
    }

    await deleteImageFromStorage(targetItem?.image)

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat
      )
    )
  }

  const swapCategoryOrder = async (
    currentId: string,
    targetId: string,
    currentOrder: number,
    targetOrder: number
  ) => {
    const [{ error: firstError }, { error: secondError }] = await Promise.all([
      supabase
        .from('menu_categories')
        .update({ order_index: targetOrder })
        .eq('id', currentId),
      supabase
        .from('menu_categories')
        .update({ order_index: currentOrder })
        .eq('id', targetId),
    ])

    if (firstError || secondError) {
      console.error('Failed to update category order', firstError ?? secondError)
      await fetchCategories()
    }
  }

  const moveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    // 1. 用目前的 state 找位置
    const currentIndex = categories.findIndex((cat) => cat.id === categoryId)
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (
      currentIndex === -1 ||
      targetIndex < 0 ||
      targetIndex >= categories.length
    ) {
      return
    }

    const current = categories[currentIndex]
    const target = categories[targetIndex]

    let currentOrder = current.order_index ?? currentIndex
    let targetOrder = target.order_index ?? targetIndex

    if (currentOrder === targetOrder) {
      currentOrder = currentIndex
      targetOrder = targetIndex
    }

    // 2. 先更新 DB
    const [{ error: firstError }, { error: secondError }] = await Promise.all([
      supabase
        .from('menu_categories')
        .update({ order_index: targetOrder })
        .eq('id', current.id),
      supabase
        .from('menu_categories')
        .update({ order_index: currentOrder })
        .eq('id', target.id),
    ])

    if (firstError || secondError) {
      console.error('Failed to update category order', firstError ?? secondError)
      await fetchCategories() // DB 炸掉就直接重抓
      return
    }

    // 3. DB OK 再更新前端 state
    setCategories((prev) => {
      const updated = [...prev]
      updated[targetIndex] = { ...current, order_index: targetOrder }
      updated[currentIndex] = { ...target, order_index: currentOrder }
      return updated
    })
  }

  const swapMenuItemOrder = async (
    firstId: string,
    secondId: string,
    firstOrder: number,
    secondOrder: number
  ) => {
    const [{ error: firstError }, { error: secondError }] = await Promise.all([
      supabase
        .from('menu_items')
        .update({ order_index: secondOrder })
        .eq('id', firstId),
      supabase
        .from('menu_items')
        .update({ order_index: firstOrder })
        .eq('id', secondId),
    ])

    if (firstError || secondError) {
      console.error('Failed to update menu item order', firstError ?? secondError)
      await fetchCategories()
    }
  }

  const moveMenuItem = async (
    categoryId: string,
    itemId: string,
    direction: 'up' | 'down'
  ) => {
    // 1. 找到要操作的 category
    const category = categories.find((cat) => cat.id === categoryId)
    if (!category) return

    // 2. 在這個 category 裡找到當前 item & 目標 item
    const currentIndex = category.items.findIndex((item) => item.id === itemId)
    const targetIndex =
      direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (
      currentIndex === -1 ||
      targetIndex < 0 ||
      targetIndex >= category.items.length
    ) {
      // 超出範圍或沒找到就直接不動作
      return
    }

    const currentItem = category.items[currentIndex]
    const targetItem = category.items[targetIndex]

    // 3. 決定要寫進 DB 的 order_index
    let currentOrder = currentItem.order_index ?? currentIndex
    let targetOrder = targetItem.order_index ?? targetIndex

    // 如果兩個一樣，就用 index 當作 fallback
    if (currentOrder === targetOrder) {
      currentOrder = currentIndex
      targetOrder = targetIndex
    }

    // 4. 先更新 Supabase 的排序
    const [{ error: firstError }, { error: secondError }] = await Promise.all([
      supabase
        .from('menu_items')
        .update({ order_index: targetOrder })
        .eq('id', currentItem.id),
      supabase
        .from('menu_items')
        .update({ order_index: currentOrder })
        .eq('id', targetItem.id),
    ])

    if (firstError || secondError) {
      console.error('Failed to update menu item order', firstError ?? secondError)
      // DB 出錯就直接重抓，避免前端狀態跟 DB 不一致
      await fetchCategories()
      return
    }

    // 5. DB OK，再更新前端 state
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat

        const updatedItems = [...cat.items]
        updatedItems[targetIndex] = {
          ...currentItem,
          order_index: targetOrder,
        }
        updatedItems[currentIndex] = {
          ...targetItem,
          order_index: currentOrder,
        }

        return { ...cat, items: updatedItems }
      })
    )
  }

  return (
    <MenuContext.Provider
      value={{
        categories,
        isLoading,
        refresh,
        addCategory,
        updateCategory,
        deleteCategory,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        moveCategory,
        moveMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}
