'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LoadingIndicator } from '@/components/loading-indicator'
import { Gallery, type GallerySectionId } from '@/components/gallery'
import LatteArtGallery from "@/app/gallery/latteArtGallery"
import OriginsPage from "@/app/gallery/originsPage"
import EquipmentShowcase from "@/app/gallery/equipmentShowcase"
import SpaceExperience from "@/app/gallery/spaceExperience"
import CraftsmanshipShowcase from "@/app/gallery/craftsmanshipShowcase"
import MilkExperience from "@/app/gallery/milkExperience"

export default function AboutPage() {
  const [showLoader, setShowLoader] = useState(true)
  const [activeSection, setActiveSection] = useState<GallerySectionId | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 400)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash?.replace('#', '')
    if (hash === 'latte_art' || hash === 'coffee_beans') {
      setActiveSection(hash as GallerySectionId)
    }
  }, [])

  const handleSelect = (sectionId: GallerySectionId | null) => {
    setActiveSection(sectionId)
    if (typeof window !== 'undefined') {
      if (sectionId) {
        const newHash = `#${sectionId}`
        if (window.location.hash !== newHash) {
          window.history.replaceState(null, '', newHash)
        }
      } else {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }

  return (
    <div className="overflow-x-hidden max-w-full flex flex-col">
      {showLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <LoadingIndicator />
        </div>
      )}
      <Header />
      <main className="flex-1 pt-20">
        <Gallery onSelectSection={handleSelect} />
        <div className="space-y-24 pt-12">
          {activeSection === 'latte_art' && (
            <section id="latte_art" className="scroll-mt-24 md:scroll-mt-32">
              <LatteArtGallery />
            </section>
          )}
          {activeSection === 'coffee_beans' && (
            <section id="coffee_beans" className="scroll-mt-24 md:scroll-mt-32">
              <OriginsPage />
            </section>
          )}
          {activeSection === 'equipment' && <EquipmentShowcase />}
          {activeSection === 'space' && <SpaceExperience />}
          {activeSection === 'craftsmanship' && <CraftsmanshipShowcase />}
          {activeSection === 'milk' && <MilkExperience />}
        </div>
      </main>
      <Footer />
    </div>
  )
}
