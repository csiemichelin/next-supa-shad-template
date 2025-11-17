'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useState } from 'react'
import { CartDrawer } from './cart-drawer'

export function CartButton() {
  const { items } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="relative bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all"
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>
      <CartDrawer open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
