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
          <DialogTitle>{editingSlide ? 'Edit Carousel Slide' : 'Add Carousel Slide'}</DialogTitle>
          <DialogDescription>
            {editingSlide ? 'Update the slide details' : 'Create a new hero carousel slide'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-semibold text-foreground">
              Image URL
            </label>
            <input
              id="image"
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Crafted with Care"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="highlight" className="text-sm font-semibold text-foreground">
              Highlight Word
            </label>
            <input
              id="highlight"
              type="text"
              value={formData.highlight}
              onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Word from title to highlight (e.g., Care)"
            />
            <p className="text-xs text-muted-foreground">
              The highlighted word will appear in accent color
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-foreground">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              placeholder="Describe the slide..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingSlide ? 'Update Slide' : 'Add Slide'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
