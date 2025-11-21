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
  const [isSaving, setIsSaving] = useState(false)
  const { addCategory, updateCategory } = useMenu()

  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name)
    } else {
      setCategoryName('')
    }
  }, [editingCategory, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) return

    setIsSaving(true)
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryName)
      } else {
        await addCategory(categoryName)
      }
      onSuccess()
      setCategoryName('')
    } catch (error) {
      console.error('Failed to save category', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>{editingCategory ? '編輯分類' : '新增分類'}</DialogTitle>
          <DialogDescription>
            {editingCategory ? '更新分類名稱' : '建立新的菜單分類'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="categoryName" className="text-sm font-semibold text-foreground">
              分類名稱
            </label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-sm"
              placeholder="例如：咖啡、甜點、飲品"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              取消
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? '儲存中...' : editingCategory ? '更新' : '建立'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
