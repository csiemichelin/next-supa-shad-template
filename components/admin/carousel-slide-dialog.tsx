'use client'

import { useState, useEffect, ChangeEvent, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LoadingIndicator } from '@/components/loading-indicator'
import { cn } from '@/lib/utils'
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
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const previewObjectUrlRef = useRef<string | null>(null)

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
    setPendingFile(null)
    setIsPreviewLoaded(false)
    revokePreviewObjectUrl()
    setUploadError(null)
  }, [editingSlide, open])

  useEffect(() => {
    return () => {
      revokePreviewObjectUrl()
    }
  }, [])

  const revokePreviewObjectUrl = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = null
    }
  }

  const deleteImageFromStorage = async (imageUrl?: string | null) => {
    if (!imageUrl) return
    try {
      const response = await fetch(
        `/api/slides/upload-image?imageUrl=${encodeURIComponent(imageUrl)}`,
        { method: 'DELETE' }
      )
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Failed to delete slide image', errorData)
      }
    } catch (error) {
      console.error('Failed to call delete slide image API', error)
    }
  }

  const uploadPendingImage = async () => {
    if (!pendingFile) return null
    const payload = new FormData()
    payload.append('file', pendingFile)
    setIsUploading(true)
    setUploadError(null)
    try {
      const response = await fetch('/api/slides/upload-image', {
        method: 'POST',
        body: payload,
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.message || '圖片上傳失敗')
      }
      const data = await response.json()
      return data.url as string
    } catch (error) {
      console.error('Slide image upload failed', error)
      setUploadError(error instanceof Error ? error.message : '圖片上傳失敗，請稍後再試')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) {
      return
    }

    try {
      let imageUrl = formData.image_url
      if (pendingFile) {
        const uploadedUrl = await uploadPendingImage()
        if (!uploadedUrl) return
        imageUrl = uploadedUrl
        revokePreviewObjectUrl()
        setPendingFile(null)
        setPreviewSource(uploadedUrl)
        setIsPreviewLoaded(false)
        setFormData((prev) => ({ ...prev, image_url: uploadedUrl }))
      }

      const payload: SlidePayload = {
        image_url: imageUrl,
        title: formData.title,
        description: formData.description,
        highlight: formData.highlight,
      }

      await onSubmit(payload, editingSlide?.id)

      if (editingSlide && editingSlide.image_url && editingSlide.image_url !== imageUrl) {
        await deleteImageFromStorage(editingSlide.image_url)
      }
    } catch (error) {
      console.error('Failed to submit slide', error)
      if (!uploadError) {
        setUploadError('儲存輪播資料時發生錯誤，請再試一次')
      }
    }
  }

  const handleImageUrlChange = (value: string) => {
    revokePreviewObjectUrl()
    setPendingFile(null)
    setFormData((prev) => ({ ...prev, image_url: value }))
    setPreviewSource(value)
    setIsUploading(false)
    setUploadError(null)
    setIsPreviewLoaded(false)
  }

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    revokePreviewObjectUrl()
    const previewUrl = URL.createObjectURL(file)
    previewObjectUrlRef.current = previewUrl
    setPreviewSource(previewUrl)
    setPendingFile(file)
    setFormData((prev) => ({ ...prev, image_url: '' }))
    setUploadError(null)
    setIsPreviewLoaded(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
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
                disabled={isSaving || isUploading}
                className="w-full cursor-pointer rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2 text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary hover:border-primary/60 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                選擇檔案先預覽，送出後會自動上傳到 Storage 的 slides 資料夾。
              </p>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
                placeholder="輸入圖片網址 /images/slide.jpg 或 https://..."
              />
              {isUploading && <p className="text-xs text-muted-foreground">圖片上傳中...</p>}
              {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
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
                      revokePreviewObjectUrl()
                      setPendingFile(null)
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
            <Button type="submit" disabled={isSaving || isUploading}>
              {isSaving ? '儲存中...' : isUploading ? '圖片上傳中...' : editingSlide ? '更新' : '新增'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
