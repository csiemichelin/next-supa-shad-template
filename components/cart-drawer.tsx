'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { Minus, Plus, Trash2 } from 'lucide-react'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col h-full">
        <SheetHeader lang="zh-Hant">
          <SheetTitle className="text-3xl md:text-4xl font-bold text-primary">購物車</SheetTitle>
          <SheetDescription className="text-2xl">
            {items.length === 0 ? '你的購物車是空的' : `你的購物車中有 ${items.length} 件商品`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-background">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                    無圖片
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground">{item.name}</h4>
                <p className="text-sm text-muted-foreground">{item.price}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 w-32 justify-end">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() =>
                    item.quantity > 1
                      ? updateQuantity(item.name, item.quantity - 1)
                      : removeItem(item.name)
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => updateQuantity(item.name, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeItem(item.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border pt-6 pb-6 px-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-accent">${getTotal().toFixed(2)}</span>
            </div>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              線上點餐
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={clearCart}
            >
              清空購物車
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
