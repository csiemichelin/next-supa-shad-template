'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useMenu } from '@/contexts/menu-context'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LoadingIndicator } from '@/components/loading-indicator'
import { cn } from '@/lib/utils'

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
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false)
  const [previewSource, setPreviewSource] = useState('')
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
      setPreviewSource(editingItem.item.image || '')
    } else {
      setFormData({
        name: '',
        price: '',
        description: '',
        details: '',
        image: '',
      })
      setPreviewSource('')
    }
    setIsPreviewLoaded(false)
  }, [editingItem, open])

  useEffect(() => {
    if (formData.image) {
      setIsPreviewLoaded(false)
    }
  }, [formData.image])

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

  const handleImageUrlChange = (value: string) => {
    setFormData((prev) => ({ ...prev, image: value }))
    setPreviewSource(value)
    setIsPreviewLoaded(false)
  }

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setPreviewSource(result)
      setFormData((prev) => ({ ...prev, image: result }))
      setIsPreviewLoaded(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>{editingItem ? '編輯餐點' : '新增餐點'}</DialogTitle>
          <DialogDescription>
            {editingItem ? '更新餐點資訊' : '在此分類新增一筆餐點'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-base font-semibold text-foreground">
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
            <label htmlFor="price" className="text-base font-semibold text-foreground">
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
            <label htmlFor="description" className="text-base font-semibold text-foreground">
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
            <label htmlFor="details" className="text-base font-semibold text-foreground">
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

          <div className="space-y-3">
            <label className="text-base font-semibold text-foreground">
              上傳圖片
            </label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full cursor-pointer rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2 text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary hover:border-primary/60"
              />
              <input
                id="image"
                type="text"
                value={formData.image}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
                placeholder="輸入圖片網址 /images/menu-item.jpg 或 https://..."
              />
            </div>
            <div className="mt-2 relative w-full h-45 bg-secondary/20 border border-dashed border-border rounded-lg overflow-hidden flex items-center justify-center text-sm text-muted-foreground">
              {previewSource ? (
                <>
                  {!isPreviewLoaded && (
                    <LoadingIndicator
                      size={120}
                      imageClassName="text-amber-700 dark:text-amber-300"
                      wrapperClassName="py-8 scale-[0.67] sm:scale-100 origin-top"
                    />
                  )}
                  <img
                    src={previewSource}
                    alt="Preview"
                    className={cn(
                      'w-full h-full object-cover transition-opacity duration-300',
                      isPreviewLoaded ? 'opacity-100' : 'opacity-0'
                    )}
                    onLoad={() => setIsPreviewLoaded(true)}
                    onError={() => {
                      setIsPreviewLoaded(true)
                      setPreviewSource('')
                    }}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <img
                    src="/icons/image-regular.png"
                    alt="placeholder illustration"
                    className="h-35 w-40 opacity-80"
                  />
                </div>
              )}
            </div>
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
