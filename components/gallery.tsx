'use client'

import { useEffect, useRef, useState } from 'react'

export function Gallery() {
  const images = [
    { url: '/images/latte-art-heart-design.jpg', alt: '手沖拉花' },
    { url: '/images/coffee-beans-roasting.jpg', alt: '嚴選豆源' },
    { url: '/images/espresso-machine-pouring-coffee.jpg', alt: '精品設備' },
    { url: '/images/coffee-shop-interior-cozy-seating.jpg', alt: '溫馨空間' },
    { url: '/images/barista-pouring-milk-coffee.jpg', alt: '職人堅持' },
    { url: '/images/milk.jpg', alt: '鮮乳直送' },
  ]

  const [visibleImages, setVisibleImages] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            images.forEach((_, index) => {
              setTimeout(() => {
                setVisibleImages((prev) => [...prev, index])
              }, index * 100)
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
    <section ref={sectionRef} id="gallery" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div lang="zh-Hant" className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            職人匠心
          </h2>
          <p className="text-2xl text-muted-foreground leading-relaxed">
            一同探索我們的咖啡吧台、沖煮流程與店內使用的專業級咖啡設備
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {images.map((image, index) => {
            const isVisible = visibleImages.includes(index)
            return (
              <div
                key={index}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-background bg-foreground/90 px-4 py-2 rounded-full text-sm font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {image.alt}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
