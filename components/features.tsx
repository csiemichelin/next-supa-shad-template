'use client'

import { Coffee, Heart, Leaf, Clock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const features = [
  {
    icon: Coffee,
    title: '時光烘焙',
    description: '小批次烘焙控制每一次風味，確保每杯咖啡都保持最佳新鮮度與香氣',
    gradient: 'from-orange-200/40 via-amber-100/10 to-transparent',
  },
  {
    icon: Heart,
    title: '滿懷用心',
    description: '我們的咖啡師以熱情和細緻的態度手作每一杯飲品，用心呈現迷人的風味',
    gradient: 'from-rose-200/40 via-pink-100/15 to-transparent',
  },
  {
    icon: Leaf,
    title: '永續來源',
    description: '與理念相同的咖啡農建立直接合作關係，追求品質的同時，也一起守護土地',
    gradient: 'from-emerald-200/35 via-green-100/10 to-transparent',
  },
  {
    icon: Clock,
    title: '永遠新鮮',
    description: '全天現煮現萃，只為讓你每次品嚐，都能感受到最新鮮、最純粹的咖啡風味',
    gradient: 'from-sky-200/40 via-cyan-100/10 to-transparent',
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
    <section
      ref={sectionRef}
      id="about-features"
      className="py-20 md:py-32"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <h2 lang="zh-Hant" className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            從程式碼到咖啡香：<br />
            一位台北工程師寫下的時光日記
          </h2>
          <p lang="the-Peak" className="text-lg text-muted-foreground leading-relaxed text-left">
            「時光咖啡」的故事，始於一位在台北忙得不可開交的工程師。多年來，他被專案與無止盡的 Bug 塞滿生活，凌晨寫程式、匆忙買咖啡成了日常。直到某天，他在一家小咖啡館裡，看著窗外車流，突然想起——人生或許該有個讓時間慢下來的地方。<br />
            那晚，他決定做一件最不像工程師的事：辭職、旅行、學習咖啡，重新開始。他走訪各地、向職人請益，重新理解了「時間」的味道，也找到了想帶給人的那份片刻寧靜。
            於是，「時光咖啡」誕生了。店裡的線條、配色、氛圍，都藏著他的工程師靈魂；而溫度、香氣與節奏，則是他重新拾回的生活步調。他希望每位來訪的人，都能在這裡找回一段被忙碌偷走的時光。<br /><br />
          </p>
          <p lang="zh-Hant" className="text-2xl md:text-2xl font-bold text-muted-foreground leading-relaxed">
            這，也許是他寫過最溫柔的一段程式
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-2 px-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isVisible = visibleItems.includes(index)
            return (
              <div
                key={index}
                className={`group relative overflow-hidden p-6 rounded-lg bg-card hover:shadow-lg active:shadow-lg hover:-translate-y-2 active:-translate-y-2 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${feature.gradient} opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500`}
                />
                <div className="relative z-10 space-y-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 transition-all hover:bg-accent/20 active:bg-accent/20 hover:scale-110 active:scale-110 hover:rotate-12 active:rotate-12 duration-300">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 lang="zh-Hant" className="text-2xl font-semibold">
                    {feature.title}
                  </h3>
                  <p lang="the-Peak" className="text-[1.1rem] text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
