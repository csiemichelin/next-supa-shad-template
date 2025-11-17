'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { HeroCarousel } from '@/components/hero-carousel'

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <HeroCarousel />
  )
}
