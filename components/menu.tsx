'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { ShoppingCart } from 'lucide-react'

interface MenuItem {
  name: string
  price: string
  description: string
  details?: string
  image?: string
}

const menuItems = [
  {
    category: 'Espresso Bar',
    items: [
      { 
        name: 'Espresso', 
        price: '$3.50', 
        description: 'Rich, bold shot of pure coffee essence',
        details: 'A classic Italian-style espresso made from carefully selected Arabica beans, roasted to perfection. Enjoy the intense flavor and aromatic crema.',
        image: '/espresso-shot-in-white-cup-close-up.jpg'
      },
      { 
        name: 'Cappuccino', 
        price: '$4.50', 
        description: 'Perfect balance of espresso, steamed milk, and foam',
        details: 'Traditional Italian cappuccino with equal parts espresso, steamed milk, and velvety microfoam. Dusted with a hint of cocoa.',
        image: '/cappuccino-with-latte-art-in-ceramic-cup.jpg'
      },
      { 
        name: 'Flat White', 
        price: '$4.75', 
        description: 'Velvety microfoam with double ristretto shots',
        details: 'Originating from Australia, this smooth beverage features double ristretto shots combined with silky steamed milk and minimal foam.',
        image: '/flat-white-coffee-with-latte-art.jpg'
      },
      { 
        name: 'Cortado', 
        price: '$4.25', 
        description: 'Equal parts espresso and steamed milk',
        details: 'Spanish-style coffee drink with equal proportions of espresso and warm milk, reducing the acidity while maintaining the bold coffee flavor.',
        image: '/cortado-coffee-in-glass.jpg'
      },
    ],
  },
  {
    category: 'Signature Brews',
    items: [
      { 
        name: 'Pour Over', 
        price: '$5.00', 
        description: 'Single-origin coffee, carefully extracted',
        details: 'Meticulously brewed using the pour-over method to highlight the unique characteristics of our rotating single-origin beans.',
        image: '/pour-over-coffee-brewing-process.jpg'
      },
      { 
        name: 'Cold Brew', 
        price: '$5.50', 
        description: 'Smooth, low-acid, steeped for 16 hours',
        details: 'Coffee grounds steeped in cold water for 16 hours, resulting in a naturally sweet, smooth, and less acidic brew.',
        image: '/cold-brew-coffee.jpg'
      },
      { 
        name: 'Nitro Cold Brew', 
        price: '$6.00', 
        description: 'Creamy, cascading nitrogen infusion',
        details: 'Cold brew infused with nitrogen gas for a creamy, Guinness-like cascade and smooth, naturally sweet taste.',
        image: '/nitro-cold-brew-coffee-cascading.jpg'
      },
      { 
        name: 'Aeropress', 
        price: '$5.25', 
        description: 'Clean, bright, full-bodied cup',
        details: 'Innovative brewing method that uses air pressure to extract a clean, bright, and full-bodied cup with complex flavor notes.',
        image: '/aeropress-coffee-brewing-method.jpg'
      },
    ],
  },
  {
    category: 'Seasonal Specials',
    items: [
      { 
        name: 'Honey Lavender Latte', 
        price: '$6.00', 
        description: 'Floral notes with natural sweetness',
        details: 'House-made lavender syrup and local honey combined with espresso and steamed milk for a uniquely aromatic and delicate experience.',
        image: '/lavender-honey-latte-with-flowers.jpg'
      },
      { 
        name: 'Maple Cinnamon Macchiato', 
        price: '$6.25', 
        description: 'Warm spices meet rich espresso',
        details: 'Pure maple syrup and freshly ground cinnamon blend with espresso and steamed milk, topped with a caramel drizzle and cinnamon dust.',
        image: '/maple-cinnamon-macchiato-coffee.jpg'
      },
      { 
        name: 'Cardamom Rose Coffee', 
        price: '$5.75', 
        description: 'Exotic aromatics in perfect harmony',
        details: 'Middle Eastern-inspired blend featuring cardamom spice and rose water, creating an aromatic and sophisticated coffee experience.',
        image: '/cardamom-rose-coffee-with-rose-petals.jpg'
      },
      { 
        name: 'Golden Turmeric Latte', 
        price: '$5.50', 
        description: 'Anti-inflammatory wellness blend',
        details: 'Turmeric, ginger, cinnamon, and black pepper blended with steamed milk and a touch of honey for a warming, health-boosting beverage.',
        image: '/golden-turmeric-latte-with-foam-art.jpg'
      },
    ],
  },
]

export function Menu() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            menuItems.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 200)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem({
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: 1
      })
      setIsDialogOpen(false)
    }
  }

  return (
    <>
      <section ref={sectionRef} id="menu" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              Our Menu
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Discover our carefully curated selection of handcrafted beverages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {menuItems.map((category, categoryIndex) => {
              const isVisible = visibleCards.includes(categoryIndex)
              return (
                <Card 
                  key={categoryIndex} 
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
                    {category.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
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
            })}
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
                      src={selectedItem.image || "/placeholder.svg"}
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    {selectedItem.details}
                  </p>
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
                      Add to Cart
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
