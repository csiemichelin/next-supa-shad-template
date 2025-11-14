'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'

const menuItems = [
  {
    category: 'Espresso Bar',
    items: [
      { name: 'Espresso', price: '$3.50', description: 'Rich, bold shot of pure coffee essence' },
      { name: 'Cappuccino', price: '$4.50', description: 'Perfect balance of espresso, steamed milk, and foam' },
      { name: 'Flat White', price: '$4.75', description: 'Velvety microfoam with double ristretto shots' },
      { name: 'Cortado', price: '$4.25', description: 'Equal parts espresso and steamed milk' },
    ],
  },
  {
    category: 'Signature Brews',
    items: [
      { name: 'Pour Over', price: '$5.00', description: 'Single-origin coffee, carefully extracted' },
      { name: 'Cold Brew', price: '$5.50', description: 'Smooth, low-acid, steeped for 16 hours' },
      { name: 'Nitro Cold Brew', price: '$6.00', description: 'Creamy, cascading nitrogen infusion' },
      { name: 'Aeropress', price: '$5.25', description: 'Clean, bright, full-bodied cup' },
    ],
  },
  {
    category: 'Seasonal Specials',
    items: [
      { name: 'Honey Lavender Latte', price: '$6.00', description: 'Floral notes with natural sweetness' },
      { name: 'Maple Cinnamon Macchiato', price: '$6.25', description: 'Warm spices meet rich espresso' },
      { name: 'Cardamom Rose Coffee', price: '$5.75', description: 'Exotic aromatics in perfect harmony' },
      { name: 'Golden Turmeric Latte', price: '$5.50', description: 'Anti-inflammatory wellness blend' },
    ],
  },
]

export function Menu() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

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

  return (
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
  )
}
