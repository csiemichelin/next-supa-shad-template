'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react'
import { CarouselSlideDialog } from './carousel-slide-dialog'
import { supabase } from '@/lib/supabaseClient'
import type { Database } from '@/types/supabase'
import { LoadingIndicator } from '@/components/loading-indicator'

type SlideRow = Database['public']['Tables']['slides']['Row']
type SlidePayload = Pick<SlideRow, 'title' | 'description' | 'highlight' | 'image_url'>

export function CarouselSlideManager() {
  const [slides, setSlides] = useState<SlideRow[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<SlideRow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadSlides = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('slides')
      .select('id, title, description, highlight, image_url, created_at')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Failed to load slides', error)
      setError('無法載入輪播資料，請稍後再試')
    } else {
      setSlides(data ?? [])
      setError(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadSlides()
  }, [])

  const handleSaveSlide = async (values: SlidePayload, slideId?: number) => {
    setIsSaving(true)
    try {
      if (slideId) {
        const { error } = await supabase.from('slides').update(values).eq('id', slideId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('slides').insert(values)
        if (error) throw error
      }
      await loadSlides()
      setIsDialogOpen(false)
      setEditingSlide(null)
    } catch (err) {
      console.error('Failed to save slide', err)
      setError('儲存輪播資料時發生錯誤，請再試一次')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSlide = async (id: number, title: string) => {
    const confirmed = confirm(`確定要刪除輪播「${title}」嗎？`)
    if (!confirmed) return

    const { error } = await supabase.from('slides').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete slide', error)
      setError('刪除輪播失敗，請稍後再試')
      return
    }
    await loadSlides()
  }

  const openForCreate = () => {
    setEditingSlide(null)
    setIsDialogOpen(true)
  }

  const openForEdit = (slide: SlideRow) => {
    setEditingSlide(slide)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 lang="zh-Hant" className="text-3xl font-bold text-foreground">
              輪播管理
            </h2>
            <p lang="the-Peak" className="text-lg text-muted-foreground">
              管理首頁主視覺的輪播內容
            </p>
          </div>
          <Button onClick={openForCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            新增輪播
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <Card className="border-border col-span-full">
              <CardContent className="py-16">
                <LoadingIndicator
                  size={120}
                  imageClassName="text-amber-700 dark:text-amber-300"
                  wrapperClassName="py-8 scale-[0.67] sm:scale-100 origin-top"
                />
              </CardContent>
            </Card>
          ) : slides.length === 0 ? (
            <Card className="border-border col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">目前沒有輪播資料，點擊右上角建立第一筆！</p>
              </CardContent>
            </Card>
          ) : (
            slides.map((slide) => (
              <Card key={slide.id} className="border-border overflow-hidden group">
                <div className="relative h-48 bg-secondary/20">
                  {slide.image_url ? (
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-lg text-balance">{slide.title}</h3>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{slide.description}</p>
                  <div className="text-sm text-accent font-semibold">
                    <span>Highlight：</span>
                    {slide.highlight || '-'}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => openForEdit(slide)} className="flex-1">
                      <Pencil className="w-4 h-4 mr-1" />
                      編輯
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSlide(slide.id, slide.title)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      刪除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <CarouselSlideDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingSlide(null)
          }
        }}
        editingSlide={editingSlide}
        onSubmit={handleSaveSlide}
        isSaving={isSaving}
      />
    </>
  )
}
