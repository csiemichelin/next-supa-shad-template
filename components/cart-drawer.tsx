'use client'

import { useState } from 'react'
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
import { OrderFormDialog } from './order-form-dialog'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCart()
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false)

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const isCartEmpty = items.length === 0

  const handleDecrease = (name: string, quantity: number) => {
    if (quantity > 1) {
      updateQuantity(name, quantity - 1)
    } else {
      removeItem(name)
    }
  }

  const handleOrderClick = () => {
    setIsOrderFormOpen(true)
    onOpenChange(false)
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle lang="zh-Hant" className="text-3xl md:text-4xl font-bold text-primary">
              購物車
            </SheetTitle>
            <SheetDescription lang="the-Peak">
              {totalQuantity === 0
                ? '你的購物車是空的'
                : `你的購物車中共有 ${totalQuantity} 件品項`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto py-6">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex flex-row items-start gap-4 rounded-lg bg-muted/50 p-4 lg:items-center"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-background">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      無圖
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between lg:block">
                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground lg:mt-1">
                      {item.price}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-end gap-1 lg:hidden">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => handleDecrease(item.name, item.quantity)}
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
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive active:bg-destructive/10 active:text-destructive"
                      onClick={() => removeItem(item.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="hidden w-32 flex-shrink-0 items-center justify-end gap-1 lg:flex">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => handleDecrease(item.name, item.quantity)}
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
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive active:bg-destructive/10 active:text-destructive"
                    onClick={() => removeItem(item.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {!isCartEmpty && (
            <div className="space-y-4 border-t border-border px-4 pb-6 pt-6">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-accent">${getTotal().toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90"
                size="lg"
                onClick={handleOrderClick}
              >
                線上點餐
              </Button>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                清空購物車
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <OrderFormDialog
        open={isOrderFormOpen}
        onOpenChange={setIsOrderFormOpen}
      />
    </>
  )
}
