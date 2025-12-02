'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LoadingIndicator } from '@/components/loading-indicator'
import { Gallery } from '@/components/gallery'

export default function AboutPage() {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden max-w-full flex flex-col">
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <LoadingIndicator />
        </div>
      )}
      <Header />
      <main className="flex-1 pt-20">
        <Gallery />
      </main>
      <Footer />
    </div>
  )
}
