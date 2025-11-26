"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoadingIndicator } from "@/components/loading-indicator"

export default function LatteArtGallery() {
  const [showLoader, setShowLoader] = useState(true)
  const [isContainerHidden, setIsContainerHidden] = useState(false)

  // Loader 最快 400ms 之後關閉
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 400)
    return () => clearTimeout(timer)
  }, [])

  // GIF 載完後開始倒數 → 淡出容器
   const handleGifLoad = () => {
    setShowLoader(false)
    setTimeout(() => {
      setIsContainerHidden(true)
    }, 5000) // ✅ 五秒
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <LoadingIndicator size={96} />
        </div>
      )}

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-24">
        <div className="text-center space-y-4 mb-10">
          <h1 lang="zh-Hant" className="text-4xl md:text-5xl font-bold text-foreground">
            手沖拉花作品
          </h1>
          <p lang="the-Peak" className="text-muted-foreground text-lg max-w-2xl mx-auto">
            以手沖細膩的節奏繪出每一杯獨特的拉花，將職人對咖啡的熱情停留在杯面
          </p>
        </div>

        <div
          className={`relative w-full max-w-3xl h-[480px] md:h-[520px] overflow-hidden rounded-[20px] border border-white/20 bg-muted/20 transition-opacity duration-700 ${
            isContainerHidden ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <img
            src={`/gif/barista_hand_drip_coffee_illustration.gif?${Date.now()}`}
            alt="Barista hand drip coffee illustration"
            className="absolute inset-0 h-full w-full object-cover object-center"
            onLoad={handleGifLoad}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
