'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export function Gallery() {
  const images = [
    { url: '/images/latte-art-heart-design.jpg', alt: '手沖拉花', href: '/gallery/latte_art' },
    { url: '/images/coffee-beans-roasting.jpg', alt: '嚴選豆源', href: '/gallery/coffee_beans' },
    { url: '/images/espresso-machine-pouring-coffee.jpg', alt: '精品設備' },
    { url: '/images/coffee-shop-interior-cozy-seating.jpg', alt: '溫馨空間' },
    { url: '/images/barista-pouring-milk-coffee.jpg', alt: '職人堅持' },
    { url: '/images/milk.jpg', alt: '鮮乳直送' },
  ]

  const [visibleImages, setVisibleImages] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  // 手機版輪播狀態
  const [currentIndex, setCurrentIndex] = useState(1) // 從 1 開始（真實的第一張）
  const [isTransitioning, setIsTransitioning] = useState(true)
  const touchStartX = useRef<number | null>(null)

  const total = images.length
  // 無限循環陣列：[最後一張, 0, 1, 2, ..., 5, 第一張]
  const infiniteImages = [
    images[total - 1], // 複製最後一張
    ...images,
    images[0], // 複製第一張
  ]

  const displayImages = isDesktop ? images : infiniteImages

  // Intersection Observer for fade-in animation
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

  // 偵測桌面/手機版
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const applyMatch = (matches: boolean) => {
      setIsDesktop(matches)
    }

    applyMatch(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => applyMatch(event.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 手機版觸控滑動
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDesktop) return
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDesktop || touchStartX.current === null) return

    const endX = e.changedTouches[0].clientX
    const deltaX = endX - touchStartX.current
    const threshold = 50

    if (Math.abs(deltaX) < threshold) {
      touchStartX.current = null
      return
    }

    if (deltaX > 0) {
      // 往右滑：看上一張
      setCurrentIndex((prev) => prev - 1)
    } else {
      // 往左滑：看下一張
      setCurrentIndex((prev) => prev + 1)
    }

    touchStartX.current = null
  }

  // 處理邊界重置（無縫循環）
  const handleTransitionEnd = () => {
    if (isDesktop) return

    if (currentIndex === 0) {
      // 到達複製的最後一張，瞬間跳到真實的最後一張
      setIsTransitioning(false)
      setCurrentIndex(total)
    } else if (currentIndex === total + 1) {
      // 到達複製的第一張，瞬間跳到真實的第一張
      setIsTransitioning(false)
      setCurrentIndex(1)
    }
  }

  useEffect(() => {
    if (!isTransitioning && !isDesktop) {
      // 瞬間跳轉後，重新啟用動畫
      const timer = setTimeout(() => setIsTransitioning(true), 50)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning, isDesktop])

  return (
    <section ref={sectionRef} id="gallery" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 lang="zh-Hant" className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            職人匠心
          </h2>
          <p lang="the-Peak" className="text-lg text-muted-foreground leading-relaxed">
            一同探索我們的咖啡吧台、沖煮流程與店內使用的專業級咖啡設備
          </p>
        </div>

        <div className="relative">
          {/* 桌面版：Grid 佈局 */}
          {isDesktop ? (
            <div className="grid max-w-6xl mx-auto gap-4 grid-cols-2 lg:grid-cols-3">
              {displayImages.map((image, index) => {
                const isVisible = visibleImages.includes(index)
                const showCaption = hoveredIndex === index
                const card = (
                  <div
                    className={`
                      relative aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer
                      transition-all duration-700
                      ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                    `}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
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

                if (image.href) {
                  return (
                    <Link
                      key={`desktop-${index}`}
                      href={image.href}
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
                    >
                      {card}
                    </Link>
                  )
                }
                return <div key={`desktop-${index}`}>{card}</div>
              })}
            </div>
          ) : (
            /* 手機版：Flex 輪播 */
            <div className="relative overflow-hidden max-w-6xl mx-auto">
              <div
                className={`flex ${isTransitioning ? 'transition-transform duration-300 ease-out' : ''}`}
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTransitionEnd={handleTransitionEnd}
              >
                {displayImages.map((image, idx) => {
                  // 計算實際索引（用於 visibleImages）
                  const actualIndex =
                    idx === 0
                      ? total - 1
                      : idx === total + 1
                        ? 0
                        : idx - 1
                  const isVisible = visibleImages.includes(actualIndex)
                  const showCaption = currentIndex === idx

                  const card = (
                    <div
                      key={`mobile-${idx}`}
                      className="w-full flex-shrink-0 px-4"
                    >
                      <div
                        className={`
                          relative aspect-[4/3] overflow-hidden rounded-lg
                          transition-all duration-700
                          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                        `}
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
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
                    </div>
                  )

                  if (image.href) {
                    return (
                      <Link
                        key={`mobile-link-${idx}`}
                        href={image.href}
                        className="w-full flex-shrink-0"
                      >
                        {card}
                      </Link>
                    )
                  }
                  return card
                })}
              </div>

              {/* 滑動指示器 */}
              <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
                <div className="flex items-center justify-between gap-6 w-[150px] rounded-full bg-black/40 text-white px-4 py-2 text-xs font-semibold tracking-wide backdrop-blur">
                  <ChevronLeft className="h-4 w-4" />
                  <div className="h-1 w-full max-w-[40px] rounded-full bg-white/30" />
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}