'use client'

import { Coffee, Heart, Leaf, Clock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const features = [
  {
    icon: Coffee,
    title: 'Shiguang Roasting',
    description: 'Small-batch roasting ensures optimal freshness and flavor in every cup we serve.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Our passionate baristas craft each beverage with care and attention to detail.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Sourcing',
    description: 'Direct trade relationships with farmers who share our commitment to quality.',
  },
  {
    icon: Clock,
    title: 'Always Fresh',
    description: 'We brew throughout the day to guarantee you receive the freshest coffee possible.',
  },
]

export function Features() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = features.map((_, index) => index)
            items.forEach((index) => {
              setTimeout(() => {
                setVisibleItems((prev) => [...prev, index])
              }, index * 150)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Why Choose Shiguang
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We believe coffee is more than a beverage—it's an experience to be savored
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isVisible = visibleItems.includes(index)
            return (
              <div
                key={index}
                className={`text-center space-y-4 p-6 rounded-lg hover:bg-card hover:shadow-lg hover:-translate-y-2 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 transition-all hover:bg-accent/20 hover:scale-110 hover:rotate-12 duration-300">
                  <Icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
