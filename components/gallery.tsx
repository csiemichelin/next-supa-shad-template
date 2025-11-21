'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

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

  const [activeIndex, setActiveIndex] = useState(-1)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isAdjustingRef = useRef(false)
  const extendedImages = useMemo(() => {
    if (images.length === 0) return []
    return [images[images.length - 1], ...images, images[0]]
  }, [images])
  const carouselImages = isDesktop ? images : extendedImages

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
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const applyMatch = (matches: boolean) => {
      setIsDesktop(matches)
      setActiveIndex(matches ? -1 : 0)
    }

    applyMatch(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => applyMatch(event.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let scrollEndTimer: NodeJS.Timeout | null = null

    const handleScroll = () => {
      if (isDesktop || isAdjustingRef.current) return
      const width = el.clientWidth
      if (!width) return

      const scrollLeft = el.scrollLeft
      
      // 清除之前的計時器
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer)
      }

      // 更新顯示的索引
      const rawIndex = Math.round(scrollLeft / width) - 1
      const normalizedIndex =
        ((rawIndex % images.length) + images.length) % images.length
      setActiveIndex(normalizedIndex)

      // 設置新的計時器，只有在真正停止滑動後才執行跳轉
      scrollEndTimer = setTimeout(() => {
        const currentIndex = Math.round(el.scrollLeft / width)
        
        // 當停在第一個複製圖片（index 0）時，跳到真實的最後一張
        if (currentIndex === 0) {
          isAdjustingRef.current = true
          el.style.scrollBehavior = 'auto'
          el.scrollLeft = width * images.length
          setTimeout(() => {
            el.style.scrollBehavior = ''
            isAdjustingRef.current = false
          }, 50)
        }
        // 當停在最後一個複製圖片時，跳到真實的第一張
        else if (currentIndex === images.length + 1) {
          isAdjustingRef.current = true
          el.style.scrollBehavior = 'auto'
          el.scrollLeft = width
          setTimeout(() => {
            el.style.scrollBehavior = ''
            isAdjustingRef.current = false
          }, 50)
        }
      }, 150) // 150ms 的延遲，確保滑動真的結束了
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      el.removeEventListener('scroll', handleScroll)
      if (scrollEndTimer) {
        clearTimeout(scrollEndTimer)
      }
    }
  }, [images.length, isDesktop])

  useEffect(() => {
    if (isDesktop) return
    const el = containerRef.current
    if (!el) return
    const width = el.clientWidth
    isAdjustingRef.current = true
    el.scrollLeft = width
    requestAnimationFrame(() => {
      isAdjustingRef.current = false
    })
  }, [isDesktop])

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

        <div className="relative">
          <div
            ref={containerRef}
            className="
              grid max-w-6xl mx-auto gap-4
              grid-flow-col auto-cols-[100%] overflow-x-auto snap-x snap-mandatory
              md:grid-flow-row md:auto-cols-auto md:grid-cols-2 lg:grid-cols-3 md:overflow-visible
              no-scrollbar
            "
          >
            {carouselImages.map((image, index) => {
              const actualIndex = isDesktop
                ? index
                : index === 0
                  ? images.length - 1
                  : index === images.length + 1
                    ? 0
                    : index - 1
              const isVisible = visibleImages.includes(actualIndex)
              const showCaption = isDesktop ? hoveredIndex === actualIndex : activeIndex === actualIndex
              return (
                <div
                  key={`${image.alt}-${index}`}
                  className={`
                    relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer
                    transition-all duration-700
                    snap-center min-w-full md:min-w-0
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                  `}
                  onMouseEnter={() => isDesktop && setHoveredIndex(actualIndex)}
                  onMouseLeave={() => isDesktop && setHoveredIndex(null)}
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
                        ${showCaption ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                      `}
                    >
                      {image.alt}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center md:hidden">
            <div className="flex items-center justify-between gap-6 w-[150px] rounded-full bg-black/40 text-white px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur">
              <ChevronLeft className="h-4 w-4 swipe-left-indicator" />
              <div className="h-1 w-full max-w-[40px] rounded-full bg-white/30" />
              <ChevronRight className="h-4 w-4 swipe-right-indicator" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
