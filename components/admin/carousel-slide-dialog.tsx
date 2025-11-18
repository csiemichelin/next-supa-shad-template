'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Database } from '@/types/supabase'

type SlideRow = Database['public']['Tables']['slides']['Row']
type SlidePayload = Pick<SlideRow, 'title' | 'description' | 'highlight' | 'image_url'>

interface CarouselSlideDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingSlide: SlideRow | null
  onSubmit: (values: SlidePayload, slideId?: number) => Promise<void>
  isSaving: boolean
}

export function CarouselSlideDialog({
  open,
  onOpenChange,
  editingSlide,
  onSubmit,
  isSaving,
}: CarouselSlideDialogProps) {
  const [formData, setFormData] = useState<SlidePayload>({
    image_url: '',
    title: '',
    description: '',
    highlight: '',
  })

  useEffect(() => {
    if (editingSlide) {
      setFormData({
        image_url: editingSlide.image_url,
        title: editingSlide.title,
        description: editingSlide.description,
        highlight: editingSlide.highlight,
      })
    } else {
      setFormData({
        image_url: '',
        title: '',
        description: '',
        highlight: '',
      })
    }
  }, [editingSlide, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) {
      return
    }
    await onSubmit(formData, editingSlide?.id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingSlide ? '編輯輪播圖' : '新增輪播圖'}</DialogTitle>
          <DialogDescription>
            {editingSlide ? '更新輪播圖的內容與圖片' : '為首頁輪播新增一張圖片與文案'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="image_url" className="text-sm font-semibold text-foreground">
              圖片網址
            </label>
            <input
              id="image_url"
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
              placeholder="/images/slide.jpg 或 https://..."
            />
            {formData.image_url && (
              <div className="mt-2 relative w-full h-40 bg-secondary/20 rounded-lg overflow-hidden">
                <img
                  src={formData.image_url || '/placeholder.svg'}
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
              placeholder="例如：Where Time Slows"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="highlight" className="text-sm font-semibold text-foreground">
              強調字詞
            </label>
            <input
              id="highlight"
              type="text"
              value={formData.highlight}
              onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
              placeholder="標題中需要加強的詞 (例如：Times)"
            />
            <p className="text-xs text-accent">強調字將以品牌色顯示</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-foreground">
              內容描述
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] placeholder:text-sm"
              placeholder="描述這張輪播圖想傳達的情境"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? '儲存中...' : editingSlide ? '更新' : '新增'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
