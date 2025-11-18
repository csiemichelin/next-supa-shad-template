'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CarouselSlide {
  id: string
  image: string
  title: string
  description: string
  highlight: string
}

interface CarouselContextType {
  slides: CarouselSlide[]
  addSlide: (slide: Omit<CarouselSlide, 'id'>) => void
  updateSlide: (id: string, slide: Omit<CarouselSlide, 'id'>) => void
  deleteSlide: (id: string) => void
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined)

const defaultSlides: CarouselSlide[] = [
  {
    id: '1',
    image: '/cozy-modern-coffee-shop-interior-with-natural-ligh.jpg',
    title: 'Crafted with Care',
    description: 'Experience the art of coffee making in our carefully curated space. Every bean tells a story, every cup creates a memory.',
    highlight: 'Care'
  },
  {
    id: '2',
    image: '/artisan-coffee-brewing-process-close-up.jpg',
    title: 'Expertly Brewed',
    description: 'Our skilled baristas craft each cup with precision and passion, using only the finest single-origin beans.',
    highlight: 'Brewed'
  },
  {
    id: '3',
    image: '/coffee-shop-cozy-reading-corner-warm-lighting.jpg',
    title: 'Warm Atmosphere',
    description: 'Unwind in our welcoming space designed for connection, creativity, and quiet moments of reflection.',
    highlight: 'Atmosphere'
  }
]

export function CarouselProvider({ children }: { children: ReactNode }) {
  const [slides, setSlides] = useState<CarouselSlide[]>([])

  useEffect(() => {
    const savedSlides = localStorage.getItem('carouselSlides')
    if (savedSlides) {
      setSlides(JSON.parse(savedSlides))
    } else {
      setSlides(defaultSlides)
    }
  }, [])

  useEffect(() => {
    if (slides.length > 0) {
      localStorage.setItem('carouselSlides', JSON.stringify(slides))
    }
  }, [slides])

  const addSlide = (slide: Omit<CarouselSlide, 'id'>) => {
    const newSlide: CarouselSlide = {
      id: Date.now().toString(),
      ...slide
    }
    setSlides([...slides, newSlide])
  }

  const updateSlide = (id: string, slide: Omit<CarouselSlide, 'id'>) => {
    setSlides(slides.map(s => 
      s.id === id ? { ...s, ...slide } : s
    ))
  }

  const deleteSlide = (id: string) => {
    setSlides(slides.filter(s => s.id !== id))
  }

  return (
    <CarouselContext.Provider
      value={{
        slides,
        addSlide,
        updateSlide,
        deleteSlide,
      }}
    >
      {children}
    </CarouselContext.Provider>
  )
}

export function useCarousel() {
  const context = useContext(CarouselContext)
  if (context === undefined) {
    throw new Error('useCarousel must be used within a CarouselProvider')
  }
  return context
}
