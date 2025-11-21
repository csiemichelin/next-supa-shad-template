'use client'

import { useState, useEffect, ChangeEvent } from 'react'
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
  const [previewSource, setPreviewSource] = useState('')

  useEffect(() => {
    if (editingSlide) {
      setFormData({
        image_url: editingSlide.image_url,
        title: editingSlide.title,
        description: editingSlide.description,
        highlight: editingSlide.highlight,
      })
      setPreviewSource(editingSlide.image_url || '')
    } else {
      setFormData({
        image_url: '',
        title: '',
        description: '',
        highlight: '',
      })
      setPreviewSource('')
    }
  }, [editingSlide, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) {
      return
    }
    await onSubmit(formData, editingSlide?.id)
  }

  const handleImageUrlChange = (value: string) => {
    setFormData((prev) => ({ ...prev, image_url: value }))
    setPreviewSource(value)
  }

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setPreviewSource(result)
      setFormData((prev) => ({ ...prev, image_url: result }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl custom-scrollbar">
        <DialogHeader>
          <DialogTitle>{editingSlide ? '編輯輪播圖' : '新增輪播圖'}</DialogTitle>
          <DialogDescription>
            {editingSlide ? '更新輪播圖的內容與圖片' : '為首頁輪播新增一張圖片與文案'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                type="text"
                value={formData.image_url}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
                placeholder="輸入圖片網址 /images/slide.jpg 或 https://..."
              />
            </div>
            <div className="mt-2 relative w-full h-45 bg-secondary/20 border border-dashed border-border rounded-lg overflow-hidden flex items-center justify-center text-sm text-muted-foreground">
              {previewSource ? (
                <img
                  src={previewSource}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewSource('')}
                />
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

          <div className="space-y-2">
            <label htmlFor="title" className="text-base font-semibold text-foreground">
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
            <label htmlFor="highlight" className="text-base font-semibold text-foreground">
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
            <label htmlFor="description" className="text-base font-semibold text-foreground">
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
