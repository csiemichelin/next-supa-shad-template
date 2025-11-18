'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface MenuItem {
  id: string
  name: string
  price: string
  description: string
  details?: string
  image?: string
}

export interface MenuCategory {
  id: string
  category: string
  items: MenuItem[]
}

interface MenuContextType {
  categories: MenuCategory[]
  addCategory: (category: string) => void
  updateCategory: (id: string, category: string) => void
  deleteCategory: (id: string) => void
  addMenuItem: (categoryId: string, item: Omit<MenuItem, 'id'>) => void
  updateMenuItem: (categoryId: string, itemId: string, item: Omit<MenuItem, 'id'>) => void
  deleteMenuItem: (categoryId: string, itemId: string) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

const defaultCategories: MenuCategory[] = [
  {
    id: '1',
    category: 'Espresso Bar',
    items: [
      { 
        id: '1-1',
        name: 'Espresso', 
        price: '$3.50', 
        description: 'Rich, bold shot of pure coffee essence',
        details: 'A classic Italian-style espresso made from carefully selected Arabica beans, roasted to perfection.',
        image: '/espresso-shot-in-white-cup-close-up.jpg'
      },
      { 
        id: '1-2',
        name: 'Cappuccino', 
        price: '$4.50', 
        description: 'Perfect balance of espresso, steamed milk, and foam',
        details: 'Traditional Italian cappuccino with equal parts espresso, steamed milk, and velvety microfoam.',
        image: '/cappuccino-with-latte-art-in-ceramic-cup.jpg'
      },
    ],
  },
  {
    id: '2',
    category: 'Signature Brews',
    items: [
      { 
        id: '2-1',
        name: 'Pour Over', 
        price: '$5.00', 
        description: 'Single-origin coffee, carefully extracted',
        details: 'Meticulously brewed using the pour-over method to highlight unique characteristics.',
        image: '/pour-over-coffee-brewing-process.jpg'
      },
      { 
        id: '2-2',
        name: 'Cold Brew', 
        price: '$5.50', 
        description: 'Smooth, low-acid, steeped for 16 hours',
        details: 'Coffee grounds steeped in cold water for 16 hours.',
        image: '/cold-brew-coffee.png'
      },
    ],
  },
]

export function MenuProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<MenuCategory[]>([])

  useEffect(() => {
    const savedMenu = localStorage.getItem('menuData')
    if (savedMenu) {
      setCategories(JSON.parse(savedMenu))
    } else {
      setCategories(defaultCategories)
    }
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('menuData', JSON.stringify(categories))
    }
  }, [categories])

  const addCategory = (category: string) => {
    const newCategory: MenuCategory = {
      id: Date.now().toString(),
      category,
      items: []
    }
    setCategories([...categories, newCategory])
  }

  const updateCategory = (id: string, category: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, category } : cat
    ))
  }

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id))
  }

  const addMenuItem = (categoryId: string, item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      id: `${categoryId}-${Date.now()}`,
      ...item
    }
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, items: [...cat.items, newItem] }
        : cat
    ))
  }

  const updateMenuItem = (categoryId: string, itemId: string, item: Omit<MenuItem, 'id'>) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            items: cat.items.map(i => 
              i.id === itemId ? { ...i, ...item } : i
            )
          }
        : cat
    ))
  }

  const deleteMenuItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId 
        ? { ...cat, items: cat.items.filter(i => i.id !== itemId) }
        : cat
    ))
  }

  return (
    <MenuContext.Provider
      value={{
        categories,
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
