"use client"

import { useEffect, useRef, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoadingIndicator } from "@/components/loading-indicator"
import { ChevronLeft, ChevronRight } from "lucide-react"

const latteArtWorks = [
  {
    id: 0,
    title: "森羽綻",
    subtitle: "羽葉像在林中盛開",
    image: "/images/latte_art/forest/forest_10.png",
  },
  {
    id: 1,
    title: "森林心湖",
    subtitle: "像靜在林中的一面心形湖",
    image: "/images/latte_art/forest/forest_1.png",
  },
  {
    id: 2,
    title: "林間漣漪",
    subtitle: "拉花像落在湖面的暖漣漪",
    image: "/images/latte_art/forest/forest_2.png",
  },
  {
    id: 3,
    title: "羽葉漫舞",
    subtitle: "奶泡像羽葉在林中飛舞",
    image: "/images/latte_art/forest/forest_3.png",
  },
  {
    id: 4,
    title: "林羽微漾",
    subtitle: "羽狀葉影在杯面輕輕漂動",
    image: "/images/latte_art/forest/forest_4.png",
  },
  {
    id: 5,
    title: "羽心森語",
    subtitle: "羽葉間開了兩朵心花",
    image: "/images/latte_art/forest/forest_5.png",
  },
  {
    id: 6,
    title: "羽林共生",
    subtitle: "三枝羽葉一起向上生長",
    image: "/images/latte_art/forest/forest_6.png",
  },
  {
    id: 7,
    title: "羽森環繞",
    subtitle: "主羽葉被小羽枝簇擁著",
    image: "/images/latte_art/forest/forest_7.png",
  },
  {
    id: 8,
    title: "孤林羽",
    subtitle: "一枝羽葉靜靜展開",
    image: "/images/latte_art/forest/forest_8.png",
  },
  {
    id: 9,
    title: "多羽森生",
    subtitle: "多枝羽葉一同向上長",
    image: "/images/latte_art/forest/forest_9.png",
  }
]

export default function LatteArtGallery() {
  const [showLoader, setShowLoader] = useState(true)
  const [isContainerHidden, setIsContainerHidden] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [desktopPage, setDesktopPage] = useState(0)

  const desktopCardsPerPage = 4
  const desktopPages = Math.ceil(latteArtWorks.length / desktopCardsPerPage)

  const [currentIndex, setCurrentIndex] = useState(1) // 從 1 開始（因為 0 是複製的最後一張）
  const [isTransitioning, setIsTransitioning] = useState(true)
  const touchStartX = useRef<number | null>(null)

  const total = latteArtWorks.length
  // 建立無限循環陣列：[最後一張, 0, 1, 2, ..., 9, 第一張]
  const infiniteWorks = [
    latteArtWorks[total - 1], // 複製最後一張放最前面
    ...latteArtWorks,
    latteArtWorks[0], // 複製第一張放最後面
  ]

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return

    const endX = e.changedTouches[0].clientX
    const deltaX = endX - touchStartX.current
    const threshold = 50

    if (Math.abs(deltaX) < threshold) {
      touchStartX.current = null
      return
    }

    if (deltaX > 0) {
      // 👉 往右滑:看上一張
      setCurrentIndex((prev) => prev - 1)
    } else {
      // 👈 往左滑:看下一張
      setCurrentIndex((prev) => prev + 1)
    }

    touchStartX.current = null
  }

  // 處理邊界重置（無縫循環）
  const handleTransitionEnd = () => {
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
    if (!isTransitioning) {
      // 瞬間跳轉後，重新啟用動畫
      const timer = setTimeout(() => setIsTransitioning(true), 50)
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const handleGifLoad = () => {
    setShowLoader(false)
    setTimeout(() => {
      setIsContainerHidden(true)
    }, 5000)
  }

  useEffect(() => {
    const updateViewport = () => setIsDesktop(window.innerWidth >= 1024)
    updateViewport()
    window.addEventListener("resize", updateViewport)
    return () => window.removeEventListener("resize", updateViewport)
  }, [])

  useEffect(() => {
    if (!isDesktop) {
      setDesktopPage(0)
    } else if (desktopPage >= desktopPages) {
      setDesktopPage(0)
    }
  }, [isDesktop, desktopPage, desktopPages])

  const desktopVisibleCards = latteArtWorks.slice(
    desktopPage * desktopCardsPerPage,
    desktopPage * desktopCardsPerPage + desktopCardsPerPage
  )

  const handleDesktopPrev = () => {
    setDesktopPage((prev) => (prev - 1 + desktopPages) % desktopPages)
  }

  const handleDesktopNext = () => {
    setDesktopPage((prev) => (prev + 1) % desktopPages)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <LoadingIndicator size={96} />
        </div>
      )}

      <Header />

      <main className="flex-1 flex flex-col items-center px-4 pt-32 pb-16">
        <div className="text-center space-y-4 mb-15">
          <h1
            lang="zh-Hant"
            className="text-3xl md:text-5xl font-bold text-foreground"
          >
            手沖拉花
          </h1>
          <p
            lang="the-Peak"
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            以手沖細膩的節奏繪出每一杯獨特的拉花
          </p>
        </div>

        <section className="w-full max-w-5xl space-y-10 relative">
          {!isContainerHidden && (
            <div className="relative w-full md:max-w-3xl mx-auto aspect-[16/9] overflow-hidden rounded-[20px] border border-white/20 bg-muted/20 transition-opacity duration-700">
              <img
                src={`/gif/barista_hand_drip_coffee_illustration.gif?${Date.now()}`}
                alt="手沖咖啡與拉花插畫 Barista hand drip coffee illustration"
                className="absolute inset-0 h-full w-full object-cover object-center"
                onLoad={handleGifLoad}
              />
            </div>
          )}

          {isContainerHidden && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h2
                  lang="zh-Hant"
                  className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-700"
                >
                  小魚拉花師的自然系作品
                </h2>
                <p
                  lang="the-Peak"
                  className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-emerald-700 to-emerald-400"
                >
                  《 樹影與花語 》
                </p>
              </div>

              {isDesktop ? (
                <div className="relative">
                  <div className="grid grid-cols-4 gap-10">
                    {desktopVisibleCards.map((work) => (
                      <div
                        key={work.id}
                        className="mx-2 rounded-[15px] border border-white/10 bg-muted/25 overflow-hidden shadow-lg flex flex-col"
                      >
                        <div className="h-35 w-full bg-white/5">
                          <img
                            src={work.image}
                            alt={work.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-3 text-center space-y-1 flex-1 flex flex-col justify-center">
                          <p
                            lang="zh-Hant"
                            className="text-lg font-semibold text-foreground"
                          >
                            {work.title}
                          </p>
                          <p
                            lang="the-Peak"
                            className=" text-xs text-muted-foreground"
                          >
                            {work.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {desktopPages > 1 && (
                    <>
                      <button
                        onClick={handleDesktopPrev}
                        className="hidden md:flex absolute md:-left-[60px] xl:-left-[80px] top-1/2 -translate-y-1/2 z-20 hover:bg-white active:bg-white p-3 rounded-full hover:scale-110 active:scale-110 transition-all backdrop-blur-sm"
                        aria-label="Previous works page"
                      >
                        <ChevronLeft className="h-6 w-6 text-foreground" />
                      </button>
                      <button
                        onClick={handleDesktopNext}
                        className="hidden md:flex absolute md:-right-[60px] xl:-right-[80px] top-1/2 -translate-y-1/2 z-20 hover:bg-white active:bg-white p-3 rounded-full hover:scale-110 active:scale-110 transition-all backdrop-blur-sm"
                        aria-label="Next works page"
                      >
                        <ChevronRight className="h-6 w-6 text-foreground" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative overflow-hidden">
                  <div 
                    className={`flex ${isTransitioning ? 'transition-transform duration-300 ease-out' : ''}`}
                    style={{ 
                      transform: `translateX(-${currentIndex * 100}%)` 
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTransitionEnd={handleTransitionEnd}
                  >
                    {infiniteWorks.map((work, idx) => (
                      <div
                        key={`${work.id}-${idx}`}
                        className="w-full flex-shrink-0 px-4"
                      >
                        <div
                          className="
                            max-w-[350px] w-full
                            rounded-[20px]
                            bg-muted/25
                            overflow-hidden
                            shadow-sm active:shadow-xl
                            transition-shadow duration-300
                            mx-auto
                          "
                        >
                          <div className="w-full bg-white/5">
                            <img
                              src={work.image}
                              alt={work.title}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="p-6 text-center space-y-1">
                            <p
                              lang="zh-Hant"
                              className="text-2xl font-semibold text-foreground"
                            >
                              {work.title}
                            </p>
                            <p
                              lang="the-Peak"
                              className="text-sm text-muted-foreground"
                            >
                              {work.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
