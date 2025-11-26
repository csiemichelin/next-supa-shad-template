"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoadingIndicator } from "@/components/loading-indicator"

export default function LatteArtGallery() {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 400)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fallback = setTimeout(() => setIsImageLoaded(true), 800)
    return () => clearTimeout(fallback)
  }, [])

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
        <div className="relative w-full max-w-3xl border border-border rounded-3xl overflow-hidden shadow-2xl bg-muted/30 flex items-center justify-center">
          <img
            src="/images/barista_hand_drip_coffee_illustration.png"
            alt="Barista hand drip coffee illustration"
            className={`max-w-full object-contain transition-opacity duration-500 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <LoadingIndicator size={64} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
