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
    image: ''
  })
  const { addMenuItem, updateMenuItem } = useMenu()

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.item.name,
        price: editingItem.item.price,
        description: editingItem.item.description,
        details: editingItem.item.details || '',
        image: editingItem.item.image || ''
      })
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        details: '',
        image: ''
      })
    }
  }, [editingItem, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.price.trim() && formData.description.trim()) {
      const targetCategoryId = editingItem?.categoryId || categoryId
      if (targetCategoryId) {
        if (editingItem) {
          updateMenuItem(targetCategoryId, editingItem.item.id, formData)
        } else {
          addMenuItem(targetCategoryId, formData)
        }
        onSuccess()
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingItem ? '編輯餐點' : '新增餐點'}</DialogTitle>
          <DialogDescription>
            {editingItem ? '更新餐點詳細資訊' : '在分類中新增餐點'}
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
              placeholder="e.g., 卡布奇諾"
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
              placeholder="e.g., NT$140"
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
              placeholder="簡介"
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
              placeholder="於對話框中輸入完整描述"
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
              placeholder="/image.jpg 或 https://..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingItem ? '更新' : '建立'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
