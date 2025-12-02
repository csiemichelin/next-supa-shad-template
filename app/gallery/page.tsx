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
    <main className="min-h-screen overflow-x-hidden max-w-full">
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <LoadingIndicator />
        </div>
      )}
      <Header />
      <div className="pt-20">
        <Gallery />
      </div>
      <Footer />
    </main>
  )
}
