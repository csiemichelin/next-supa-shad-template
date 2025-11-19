'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useMenu } from '@/contexts/menu-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogOut, Plus, Pencil, Trash2, Coffee, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react'
import { CategoryDialog } from '@/components/admin/category-dialog'
import { MenuItemDialog } from '@/components/admin/menu-item-dialog'
import { CarouselSlideManager } from '@/components/admin/carousel-slide-manager'

export default function AdminPage() {
  const { user, logout, isAdmin, isLoading } = useAuth()
  const { categories, deleteCategory, deleteMenuItem, moveCategory, moveMenuItem } = useMenu()
  const router = useRouter()
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null)
  const [editingMenuItem, setEditingMenuItem] = useState<{ categoryId: string; item: any } | null>(null)
  const [selectedCategoryForNewItem, setSelectedCategoryForNewItem] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/login')
    }
  }, [user, isAdmin, isLoading, router])

  useEffect(() => {
    setExpandedCategories((prev) => {
      const next: Record<string, boolean> = {}
      categories.forEach((cat) => {
        next[cat.id] = prev[cat.id] ?? false
      })
      return next
    })
  }, [categories])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleEditCategory = (id: string, name: string) => {
    setEditingCategory({ id, name })
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteCategory = async (id: string, categoryName: string) => {
    if (confirm(`是否確定刪除分類「 ${categoryName} 」?`)) {
      await deleteCategory(id)
    }
  }

  const handleAddMenuItem = (categoryId: string) => {
    setSelectedCategoryForNewItem(categoryId)
    setEditingMenuItem(null)
    setIsMenuItemDialogOpen(true)
  }

  const handleEditMenuItem = (categoryId: string, item: any) => {
    setSelectedCategoryForNewItem(categoryId)
    setEditingMenuItem({ categoryId, item })
    setIsMenuItemDialogOpen(true)
  }

  const handleDeleteMenuItem = async (categoryId: string, itemId: string, itemName: string) => {
    if (confirm(`是否確定刪除餐點「 ${itemName} 」?`)) {
      await deleteMenuItem(categoryId, itemId)
    }
  }

  const toggleCategoryVisibility = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !(prev[categoryId] ?? false),
    }))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        後台載入中…
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-accent/5">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Coffee className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 lang="zh-Hant" className="text-3xl font-bold text-foreground">系統管理後台</h1>
                <p lang="the-Peak" className="text-lg text-muted-foreground">管理您的咖啡店</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">系統管理者</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                  登出
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger className="w-full" value="menu">菜單管理</TabsTrigger>
            <TabsTrigger className="w-full" value="carousel">輪播圖管理</TabsTrigger>
          </TabsList>

          {/* Menu Management Tab */}
          <TabsContent value="menu" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 lang="zh-Hant" className="text-3xl font-bold text-foreground">菜單管理</h2>
                <p lang="the-Peak" className="text-lg text-muted-foreground">管理菜單分類與餐點</p>
              </div>
              <Button onClick={() => {
                setEditingCategory(null)
                setIsCategoryDialogOpen(true)
              }} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                新增分類
              </Button>
            </div>

            <div className="grid gap-6">
              {categories.map((category, categoryIndex) => {
                const isExpanded = expandedCategories[category.id] ?? false
                return (
                  <Card key={category.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg md:text-2xl text-primary">{category.category}</CardTitle>
                        <CardDescription>{category.items.length} 種餐點</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategoryVisibility(category.id)}
                          aria-expanded={isExpanded}
                          aria-controls={`category-items-${category.id}`}
                          title={isExpanded ? '收合餐點列表' : '展開餐點列表'}
                          className="hidden sm:flex items-center gap-1 text-muted-foreground hover:text-white"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                          <span className="text-sm">{isExpanded ? '收合' : '展開'}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void moveCategory(category.id, 'up')}
                          disabled={categoryIndex === 0}
                          title="向上移動"
                          className="h-7 w-7 md:h-8 md:w-8 p-1 md:p-2"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void moveCategory(category.id, 'down')}
                          disabled={categoryIndex === categories.length - 1}
                          title="向下移動"
                          className="h-7 w-7 md:h-8 md:w-8 p-1 md:p-2"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category.id, category.category)}
                          className="h-7 w-7 md:h-8 md:w-8 p-1 md:p-2"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id, category.category)}
                          className="h-7 w-7 md:h-8 md:w-8 p-1 md:p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAddMenuItem(category.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      新增餐點
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCategoryVisibility(category.id)}
                      aria-expanded={isExpanded}
                      aria-controls={`category-items-${category.id}`}
                      className="sm:hidden w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground my-0"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      />
                      <span>{isExpanded ? '收合餐點' : '展開餐點'}</span>
                    </Button>

                    <div
                      id={`category-items-${category.id}`}
                      className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <div className="overflow-hidden rounded-2xl border border-dashed border-border/60 bg-secondary/10">
                        <div className="space-y-3 p-4">
                      {category.items.map((item, itemIndex) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 bg-secondary/20 rounded-lg border border-border hover:border-accent/50 transition-all"
                        >
                          <div className="flex-1">
                            {/* 上半部：手機版 name+price + 按鈕 各佔 50% 寬，桌機只顯示左半（右半隱藏） */}
                            <div className="flex items-center gap-2">
                              {/* 左側：名稱 + 價格（手機 50% 寬） */}
                              <div className="flex items-baseline gap-2 w-1/2 sm:w-auto">
                                <h4 className="font-semibold text-foreground truncate">
                                  {item.name}
                                </h4>
                                <span className="text-accent font-semibold">{item.price}</span>
                              </div>

                              {/* 右側：手機版的按鈕群（50% 寬），桌機隱藏 */}
                              <div className="flex items-center justify-end gap-1 w-1/2 sm:hidden">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => void moveMenuItem(category.id, item.id, 'up')}
                                  disabled={itemIndex === 0}
                                  title="向上移動"
                                  className="h-7 w-7 md:h-8 md:w-8 p-1 md:p-2"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => void moveMenuItem(category.id, item.id, 'down')}
                                  disabled={itemIndex === category.items.length - 1}
                                  title="向下移動"
                                  className="h-7 w-7 md:h-8 md:w-8 p-1 md:p-2"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditMenuItem(category.id, item)}
                                  className="h-7 w-7 md:h-8 md:w-8 p-1 md:p-2"
                                >
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteMenuItem(category.id, item.id, item.name)}
                                  className="h-7 w-7 md:h-8 md:w-8 p-1 md:p-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* description 與上方整組（name+price + 按鈕）垂直排列 */}
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          </div>

                          {/* 桌機版按鈕群：維持原來位置與大小，手機隱藏 */}
                          <div className="hidden sm:flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => void moveMenuItem(category.id, item.id, 'up')}
                              disabled={itemIndex === 0}
                              title="向上移動"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => void moveMenuItem(category.id, item.id, 'down')}
                              disabled={itemIndex === category.items.length - 1}
                              title="向下移動"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMenuItem(category.id, item)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMenuItem(category.id, item.id, item.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {category.items.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">此分類尚無餐點</p>
                      )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

              {categories.length === 0 && (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Coffee className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">目前沒有分類，趕快新增一個吧！</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Carousel Management Tab */}
          <TabsContent value="carousel">
            <CarouselSlideManager />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        editingCategory={editingCategory}
        onSuccess={() => {
          setIsCategoryDialogOpen(false)
          setEditingCategory(null)
        }}
      />

      <MenuItemDialog
        open={isMenuItemDialogOpen}
        onOpenChange={setIsMenuItemDialogOpen}
        categoryId={selectedCategoryForNewItem}
        editingItem={editingMenuItem}
        onSuccess={() => {
          setIsMenuItemDialogOpen(false)
          setEditingMenuItem(null)
          setSelectedCategoryForNewItem(null)
        }}
      />
    </div>
  )
}
