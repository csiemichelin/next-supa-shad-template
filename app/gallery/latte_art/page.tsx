"use client"

import { useEffect, useRef, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoadingIndicator } from "@/components/loading-indicator"
import { ChevronLeft, ChevronRight } from "lucide-react"

const latteArtWorks = [
  {
    id: 1,
    title: "Forest Light #1",
    subtitle: "森林光影的細膩層次",
    image: "/images/latte_art/forest/forest_1.png",
  },
  {
    id: 2,
    title: "Forest Light #2",
    subtitle: "森林光影的細膩層次",
    image: "/images/latte_art/forest/forest_2.png",
  },
  {
    id: 3,
    title: "Forest Light #3",
    subtitle: "森林光影的細膩層次",
    image: "/images/latte_art/forest/forest_3.png",
  },
  {
    id: 4,
    title: "Forest Light #4",
    subtitle: "森林光影的細膩層次",
    image: "/images/latte_art/forest/forest_4.png",
  },
  {
    id: 5,
    title: "Forest Light #5",
    subtitle: "森林光影的細膩層次",
    image: "/images/latte_art/forest/forest_5.png",
  },
  {
    id: 6,
    title: "Forest Light #6",
    subtitle: "森林光影的細膩層次",
    image: "/images/latte_art/forest/forest_6.png",
  },
  {
    id: 7,
    title: "Forest Light #7",
    subtitle: "森林光影的細膩層次",
    image: "/images/latte_art/forest/forest_7.png",
  },
  {
    id: 8,
    title: "Forest Light #8",
    subtitle: "森林光影的細膩層次",
    image: "/images/latte_art/forest/forest_8.png",
  },
  {
    id: 9,
    title: "Forest Light #9",
    subtitle: "森林光影的細膩層次",
    image: "/images/latte_art/forest/forest_9.png",
  },
  {
    id: 10,
    title: "Forest Light #10",
    subtitle: "森林光影的細膩層次",
    image: "/images/latte_art/forest/forest_10.png",
  },
]

export default function LatteArtGallery() {
  const [showLoader, setShowLoader] = useState(true)
  const [isContainerHidden, setIsContainerHidden] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [desktopPage, setDesktopPage] = useState(0)
  const mobileCarouselRef = useRef<HTMLDivElement | null>(null)

  const desktopCardsPerPage = 4
  const desktopPages = Math.ceil(latteArtWorks.length / desktopCardsPerPage)

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

  const mobileLoopItems = !isDesktop && latteArtWorks.length > 0
    ? [
        latteArtWorks[latteArtWorks.length - 1],
        ...latteArtWorks,
        latteArtWorks[0],
      ]
    : latteArtWorks

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
          <h1 lang="zh-Hant" className="text-3xl md:text-5xl font-bold text-foreground">
            手沖拉花
          </h1>
          <p lang="the-Peak" className="text-muted-foreground text-lg max-w-2xl mx-auto">
            以手沖細膩的節奏繪出每一杯獨特的拉花
          </p>
        </div>

        <section className="w-full max-w-5xl space-y-10 relative">
          {!isContainerHidden && (
            <div className="relative w-full h-[480px] md:h-[520px] overflow-hidden rounded-[20px] border border-white/20 bg-muted/20 transition-opacity duration-700">
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
                <h2 lang="zh-Hant" className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-500">
                  小魚拉花師的自然系作品
                </h2>
                <p lang="the-Peak" className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-emerald-700 to-emerald-400">
                  《 樹影與花語 》
                </p>
              </div>

              {isDesktop ? (
                <div className="relative">
                  <div className="grid grid-cols-4 gap-6">
                    {desktopVisibleCards.map((work) => (
                      <div
                        key={work.id}
                        className="rounded-[24px] border border-white/10 bg-muted/25 overflow-hidden shadow-lg flex flex-col"
                      >
                        <div className="h-40 w-full bg-white/5">
                          <img
                            src={work.image}
                            alt={work.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4 text-center space-y-1 flex-1 flex flex-col justify-center">
                          <p className="text-base font-semibold text-foreground">{work.title}</p>
                          <p className="text-xs text-muted-foreground">{work.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {desktopPages > 1 && (
                    <>
                      <button
                        onClick={handleDesktopPrev}
                        className="hidden md:flex absolute -left-[60px] top-1/2 -translate-y-1/2 z-20 hover:bg-white active:bg-white p-3 rounded-full hover:scale-110 active:scale-110 transition-all backdrop-blur-sm"
                        aria-label="Previous works page"
                      >
                        <ChevronLeft className="h-6 w-6 text-foreground" />
                      </button>
                      <button
                        onClick={handleDesktopNext}
                        className="hidden md:flex absolute -right-[60px] top-1/2 -translate-y-1/2 z-20 hover:bg-white active:bg-white p-3 rounded-full hover:scale-110 active:scale-110 transition-all backdrop-blur-sm"
                        aria-label="Next works page"
                      >
                        <ChevronRight className="h-6 w-6 text-foreground" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div 
                  ref={mobileCarouselRef}
                  className="flex overflow-x-auto no-scrollbar"
                  style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
                >
                  {mobileLoopItems.map((work, index) => (
                    <div
                      key={`${work.id}-${index}`}
                      className="min-w-full rounded-[24px] border border-white/10 bg-muted/25 overflow-hidden shadow-sm flex-shrink-0 mr-4"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <div className="h-56 w-full bg-white/5">
                        <img
                          src={work.image}
                          alt={work.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-6 text-center space-y-1">
                        <p className="text-lg font-semibold text-foreground">{work.title}</p>
                        <p className="text-sm text-muted-foreground">{work.subtitle}</p>
                      </div>
                    </div>
                  ))}
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
