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
  
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleScroll = () => {
      const width = el.clientWidth
      if (!width) return
      const index = Math.round(el.scrollLeft / width)
      setActiveIndex(index)
    }

    el.addEventListener("scroll", handleScroll, { passive: true })
    return () => el.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} id="gallery" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 lang="zh-Hant" className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            職人匠心
          </h2>
          <p  lang="the-Peak" className="text-lg text-muted-foreground leading-relaxed">
            一同探索我們的咖啡吧台、沖煮流程與店內使用的專業級咖啡設備
          </p>
        </div>

        <div
          ref={containerRef}
          className="
            grid max-w-6xl mx-auto gap-4
            grid-flow-col auto-cols-[100%] overflow-x-auto snap-x snap-mandatory
            md:grid-flow-row md:auto-cols-auto md:grid-cols-2 lg:grid-cols-3 md:overflow-visible
            no-scrollbar
          "
        >
          {images.map((image, index) => {
            const isVisible = visibleImages.includes(index)
            return (
              <div
                key={index}
                className={`
                  relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer
                  transition-all duration-700
                  snap-center min-w-full md:min-w-0
                  ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                `}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`
                      text-white bg-black/90 px-4 py-2 rounded-full text-sm font-semibold
                      transition-all duration-[1200ms] ease-out
                      ${
                        activeIndex === index
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-6"
                      }
                      md:opacity-0 md:translate-y-6
                      md:group-hover:opacity-100 md:group-hover:translate-y-0
                    `}
                  >
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
