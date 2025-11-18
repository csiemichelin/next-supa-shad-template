'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useMenu } from '@/contexts/menu-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogOut, Plus, Pencil, Trash2, Coffee } from 'lucide-react'
import { CategoryDialog } from '@/components/admin/category-dialog'
import { MenuItemDialog } from '@/components/admin/menu-item-dialog'
import { CarouselSlideManager } from '@/components/admin/carousel-slide-manager'

export default function AdminPage() {
  const { user, logout, isAdmin, isLoading } = useAuth()
  const { categories, deleteCategory, deleteMenuItem } = useMenu()
  const router = useRouter()
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null)
  const [editingMenuItem, setEditingMenuItem] = useState<{ categoryId: string; item: any } | null>(null)
  const [selectedCategoryForNewItem, setSelectedCategoryForNewItem] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/login')
    }
  }, [user, isAdmin, isLoading, router])

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
                <p lang="zh-Hant" className="text-xl text-muted-foreground">管理您的咖啡店</p>
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
                <p lang="zh-Hant" className="text-2xl text-muted-foreground">管理菜單分類與餐點</p>
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
              {categories.map((category) => (
                <Card key={category.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl text-primary">{category.category}</CardTitle>
                        <CardDescription>{category.items.length} 種餐點</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCategory(category.id, category.category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id, category.category)}
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
                      <Plus className="w-4 h-4 mr-2" />
                      新增餐點
                    </Button>
                    
                    <div className="space-y-3">
                      {category.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border hover:border-accent/50 transition-all"
                        >
                          <div className="flex-1">
                            <div className="flex items-baseline gap-2">
                              <h4 className="font-semibold text-foreground">{item.name}</h4>
                              <span className="text-accent font-semibold">{item.price}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
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
                  </CardContent>
                </Card>
              ))}

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
