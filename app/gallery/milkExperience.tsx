"use client"
import { Truck, Stamp, ThermometerSnowflake, CupSoda } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const features = [
  {
    icon: Truck,
    title: '每日直送鮮乳',
    description:
      '與彰化小農牧場合作，每日低溫配送 12 小時內裝瓶的鮮乳，保留完整奶香與自然甜感',
    // 奶油感偏暖黃
    gradient: 'from-emerald-200/35 via-green-100/10 to-transparent',
  },
  {
    icon: Stamp,
    title: '產地履歷',
    description:
      '每一批鮮乳皆附上生產日期與牧場資訊，來源透明可追溯，喝得安心也喝得放心',
    // 帶一點紙張＋土地的灰棕色
    gradient: 'from-stone-300/50 via-amber-100/20 to-transparent',
  },
  {
    icon: ThermometerSnowflake,
    title: '低溫冷鏈保鮮',
    description:
      '全程冷鏈運輸搭配店內 2℃ 冷藏設備，嚴格控溫，確保送入口中的每一口都維持最佳鮮度',
    // 明顯冷調藍綠
    gradient: 'from-sky-300/20 via-cyan-200/8 to-transparent',
  },
  {
    icon: CupSoda,
    title: '專屬奶泡比例',
    description:
      '依照鮮乳特性建立加熱與打發曲線，微調溫度與時間，讓奶泡綿密、甜感飽滿，特別適合拿鐵與拉花',
    // 帶奶泡感的粉橘拿鐵色
    gradient: 'from-rose-100/50 via-orange-100/30 to-transparent',
  },
]

export default function MilkExperience() {
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
      id="milk"
      ref={sectionRef}
      className="w-full px-6 pt-16 pb-20 md:pb-32 bg-secondary/30"
    >
      <div className="text-center space-y-4 mb-15">
        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#7B5538] font-bold">
          Fresh Milk
        </p>
        <h2
          lang="zh-Hant"
          className="text-3xl md:text-5xl font-bold text-foreground"
        >
          鮮乳直送
        </h2>
        <p
          lang="the-Peak"
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          與彰化小農牧場合作，每日低溫配送 12 小時內的鮮乳，讓每一杯奶咖與拉花都更順口、細緻
        </p>
        <div className="flex justify-center pt-2">
          <img
            src="/gif/milk-truck.gif"
            alt="Milk truck delivering fresh milk"
            className="w-[220px] h-[120px] md:w-[250px] md:h-[140px] drop-shadow-xl"
          />
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isVisible = visibleItems.includes(index)

            return (
              <div
                key={index}
                className={`
                  group relative overflow-hidden p-6 rounded-lg bg-card
                  hover:shadow-lg active:shadow-lg
                  hover:-translate-y-2 active:-translate-y-2
                  transition-all duration-500
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
              >
                <div
                  className={`
                    pointer-events-none absolute inset-0 bg-gradient-to-t
                    ${feature.gradient}
                    opacity-0 group-hover:opacity-100 group-active:opacity-100
                    transition-opacity duration-500
                  `}
                />
                <div className="relative z-10 space-y-4 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 transition-all hover:bg-accent/20 active:bg-accent/20 hover:scale-110 active:scale-110 hover:rotate-12 active:rotate-12 duration-300">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 lang="zh-Hant" className="text-2xl font-semibold">
                    {feature.title}
                  </h3>
                  <p
                    lang="the-Peak"
                    className="text-[1.05rem] text-muted-foreground leading-relaxed"
                  >
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
