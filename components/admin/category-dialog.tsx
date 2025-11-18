'use client'

import { useState, useEffect } from 'react'
import { useMenu } from '@/contexts/menu-context'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingCategory: { id: string; name: string } | null
  onSuccess: () => void
}

export function CategoryDialog({ open, onOpenChange, editingCategory, onSuccess }: CategoryDialogProps) {
  const [categoryName, setCategoryName] = useState('')
  const { addCategory, updateCategory } = useMenu()

  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name)
    } else {
      setCategoryName('')
    }
  }, [editingCategory, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (categoryName.trim()) {
      if (editingCategory) {
        updateCategory(editingCategory.id, categoryName)
      } else {
        addCategory(categoryName)
      }
      onSuccess()
      setCategoryName('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogDescription>
            {editingCategory ? 'Update the category name' : 'Create a new menu category'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="categoryName" className="text-sm font-semibold text-foreground">
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Coffee, Pastries, Beverages"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
