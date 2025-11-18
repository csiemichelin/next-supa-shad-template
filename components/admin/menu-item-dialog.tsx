'use client'

import { useState, useEffect } from 'react'
import { useMenu } from '@/contexts/menu-context'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface MenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryId: string | null
  editingItem: { categoryId: string; item: any } | null
  onSuccess: () => void
}

export function MenuItemDialog({ open, onOpenChange, categoryId, editingItem, onSuccess }: MenuItemDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    details: '',
    image: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const { addMenuItem, updateMenuItem } = useMenu()

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.item.name,
        price: editingItem.item.price,
        description: editingItem.item.description,
        details: editingItem.item.details || '',
        image: editingItem.item.image || '',
      })
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        details: '',
        image: '',
      })
    }
  }, [editingItem, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.price.trim() || !formData.description.trim()) return

    const targetCategoryId = editingItem?.categoryId || categoryId
    if (!targetCategoryId) return

    setIsSaving(true)
    try {
      const payload = {
        name: formData.name,
        price: formData.price,
        description: formData.description,
        details: formData.details,
        image: formData.image,
      }
      if (editingItem) {
        await updateMenuItem(targetCategoryId, editingItem.item.id, payload)
      } else {
        await addMenuItem(targetCategoryId, payload)
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save menu item', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? '編輯餐點' : '新增餐點'}</DialogTitle>
          <DialogDescription>
            {editingItem ? '更新餐點資訊' : '在此分類新增一筆餐點'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-foreground">
              餐點名稱
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
              placeholder="例如：熱卡布奇諾"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-semibold text-foreground">
              價格
            </label>
            <input
              id="price"
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
              placeholder="例如：$4.50 或 NT$140"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-foreground">
              簡短描述
            </label>
            <input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
              placeholder="用一句話說明餐點特色"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="details" className="text-sm font-semibold text-foreground">
              詳細描述
            </label>
            <textarea
              id="details"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] placeholder:text-sm"
              placeholder="輸入更完整的介紹內容（選填）"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-semibold text-foreground">
              圖片網址
            </label>
            <input
              id="image"
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
              placeholder="/images/menu-item.jpg 或 https://..."
            />
            {formData.image && (
              <div className="mt-2 relative w-full h-40 bg-secondary/20 rounded-lg overflow-hidden">
                <img
                  src={formData.image || '/placeholder.svg'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              取消
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? '儲存中...' : editingItem ? '更新' : '新增'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
