'use client'

import { useState } from 'react'
import { useCarousel } from '@/contexts/carousel-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react'
import { CarouselSlideDialog } from './carousel-slide-dialog'

export function CarouselSlideManager() {
  const { slides, deleteSlide } = useCarousel()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<any>(null)

  const handleAddSlide = () => {
    setEditingSlide(null)
    setIsDialogOpen(true)
  }

  const handleEditSlide = (slide: any) => {
    setEditingSlide(slide)
    setIsDialogOpen(true)
  }

  const handleDeleteSlide = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the slide "${title}"?`)) {
      deleteSlide(id)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Carousel Slides</h2>
            <p className="text-muted-foreground">Manage the main hero carousel slides</p>
          </div>
          <Button onClick={handleAddSlide} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Slide
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {slides.map((slide) => (
            <Card key={slide.id} className="border-border overflow-hidden group">
              <div className="relative h-48 bg-secondary/20">
                {slide.image ? (
                  <img
                    src={slide.image || "/placeholder.svg"}
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
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold">Highlight:</span> {slide.highlight}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSlide(slide)}
                    className="flex-1"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSlide(slide.id, slide.title)}
                    className="flex-1"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {slides.length === 0 && (
            <Card className="border-border col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">No slides yet. Create your first one!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <CarouselSlideDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingSlide={editingSlide}
        onSuccess={() => {
          setIsDialogOpen(false)
          setEditingSlide(null)
        }}
      />
    </>
  )
}
