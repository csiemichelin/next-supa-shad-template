'use client'

import { Coffee, Heart, Leaf, Clock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const features = [
  {
    icon: Coffee,
    title: '時光烘焙',
    description: '小批次烘焙控制每一次風味，確保每杯咖啡都保持最佳新鮮度與香氣。',
  },
  {
    icon: Heart,
    title: '滿懷用心',
    description: '我們的咖啡師以熱情和細緻的態度手作每一杯飲品，用心呈現迷人的風味。',
  },
  {
    icon: Leaf,
    title: '永續來源',
    description: '與理念相同的咖啡農建立直接合作關係，追求品質的同時，也一起守護土地。',
  },
  {
    icon: Clock,
    title: '永遠新鮮',
    description: '全天現煮現萃，只為讓你每次品嚐，都能感受到最新鮮、最純粹的咖啡風味。',
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
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 lang="zh-Hant" className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            為什麼來到時光咖啡
          </h2>
          <p lang="the-Peak" className="text-lg text-muted-foreground leading-relaxed">
            在這裡，咖啡承載的不只是香氣與味道，更是一份讓人放慢腳步、靜靜感受的片刻。
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
                <h3 lang="zh-Hant" className="text-2xl font-semibold">{feature.title}</h3>
                <p lang="the-Peak" className="text-[1.1rem] text-muted-foreground leading-relaxed">
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
