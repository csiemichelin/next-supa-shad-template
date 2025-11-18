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
}

export interface MenuCategory {
  id: string
  category: string
  items: MenuItem[]
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
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

type MenuCategoryRow = Database['public']['Tables']['menu_categories']['Row']
type MenuItemRow = Database['public']['Tables']['menu_items']['Row']

const mapRowsToCategories = (
  rows: Array<MenuCategoryRow & { menu_items?: MenuItemRow[] }>
): MenuCategory[] =>
  rows.map((row) => ({
    id: row.id,
    category: row.category,
    items: row.menu_items?.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      details: item.details,
      image: item.image,
    })) ?? [],
  }))

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
        menu_items (
          id,
          category_id,
          created_at,
          name,
          price,
          description,
          details,
          image
        )
      `)
      .order('created_at', { ascending: true })
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
    const { data, error } = await supabase
      .from('menu_categories')
      .insert({ category })
      .select('id, category')
      .single()

    if (error) {
      console.error('Failed to add category', error)
      throw error
    }

    setCategories((prev) => [...prev, { id: data.id, category: data.category, items: [] }])
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
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  const addMenuItem = async (categoryId: string, item: Omit<MenuItem, 'id'>) => {
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        category_id: categoryId,
        ...item,
      })
      .select('id, name, price, description, details, image, category_id')
      .single()

    if (error) {
      console.error('Failed to add menu item', error)
      throw error
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: [...cat.items, { ...item, id: data.id }] }
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
    const { error } = await supabase.from('menu_items').delete().eq('id', itemId)
    if (error) {
      console.error('Failed to delete menu item', error)
      throw error
    }

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat
      )
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
