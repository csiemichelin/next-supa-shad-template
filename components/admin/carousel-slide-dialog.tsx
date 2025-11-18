'use client'

import { useState, useEffect } from 'react'
import { useCarousel } from '@/contexts/carousel-context'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CarouselSlideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSlide: any | null
  onSuccess: () => void
}

export function CarouselSlideDialog({ open, onOpenChange, editingSlide, onSuccess }: CarouselSlideDialogProps) {
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    highlight: ''
  })
  const { addSlide, updateSlide } = useCarousel()

  useEffect(() => {
    if (editingSlide) {
      setFormData({
        image: editingSlide.image,
        title: editingSlide.title,
        description: editingSlide.description,
        highlight: editingSlide.highlight
      })
    } else {
      setFormData({
        image: '',
        title: '',
        description: '',
        highlight: ''
      })
    }
  }, [editingSlide, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim() && formData.description.trim()) {
      if (editingSlide) {
        updateSlide(editingSlide.id, formData)
      } else {
        addSlide(formData)
      }
      onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingSlide ? '編輯輪播圖' : '新增輪播圖'}</DialogTitle>
          <DialogDescription>
            {editingSlide ? '更新輪播圖詳細資訊' : '建立新的首頁輪播圖'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="/image.jpg or https://..."
            />
            {formData.image && (
              <div className="mt-2 relative w-full h-40 bg-secondary/20 rounded-lg overflow-hidden">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-foreground">
              標題
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
              placeholder="e.g., Crafted with Care"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="highlight" className="text-sm font-semibold text-foreground">
              強調文字
            </label>
            <input
              id="highlight"
              type="text"
              value={formData.highlight}
              onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
              placeholder="要在標題中強調的文字 (e.g., Care)"
            />
            <p className="text-xs text-muted-foreground">
              被強調的文字將會以重點色顯示
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-foreground">
              描述
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] placeholder:text-sm"
              placeholder="描述此輪播內容..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit">
              {editingSlide ? '更新' : '建立'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
