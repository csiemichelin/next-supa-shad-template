'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useMenu } from '@/contexts/menu-context'
import type { MenuItem as MenuItemType } from '@/contexts/menu-context'

export function Menu() {
  const { addItem } = useCart()
  const { categories, isLoading } = useMenu()
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setVisibleCards([])

    if (!sectionRef.current || categories.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            categories.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) =>
                  prev.includes(index) ? prev : [...prev, index]
                )
              }, index * 200)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [categories])

  const handleItemClick = (item: MenuItemType) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem({
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: 1,
        image: selectedItem.image ?? undefined,
      })
      setIsDialogOpen(false)
    }
  }

  return (
    <>
      <section ref={sectionRef} id="menu" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div lang="zh-Hant" className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              精選菜單
            </h2>
            <p className="text-2xl text-muted-foreground leading-relaxed">
              品味每一杯用心手作的風味
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {isLoading ? (
              <div className="col-span-full text-center text-muted-foreground">
                菜單載入中…
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground">
                尚未建立任何菜單內容
              </div>
            ) : (
              categories.map((category, categoryIndex) => {
                const isVisible = visibleCards.includes(categoryIndex)
                return (
                  <Card
                    key={category.id}
                    className={`border-border hover:shadow-xl hover:-translate-y-1 hover:border-accent/50 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-primary">
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {category.items.map((item) => (
                        <div
                          key={item.id}
                          className="space-y-1 hover:translate-x-2 transition-transform duration-300 cursor-pointer group"
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                              {item.name}
                            </h4>
                            <span className="text-accent font-semibold">{item.price}</span>
                          </div>
                          <CardDescription className="text-sm leading-relaxed">
                            {item.description}
                          </CardDescription>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-primary">
                  {selectedItem.name}
                </DialogTitle>
                <DialogDescription className="text-lg text-muted-foreground">
                  {selectedItem.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {selectedItem.image && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <img
                      src={selectedItem.image || '/placeholder.svg'}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  {selectedItem.details && (
                    <p className="text-foreground leading-relaxed">
                      {selectedItem.details}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-3xl font-bold text-accent">
                      {selectedItem.price}
                    </span>
                    <Button
                      size="lg"
                      onClick={handleAddToCart}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all group"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      加入購物車
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
