'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Image from "next/image"
import { LoadingIndicator } from '@/components/loading-indicator'

type Slide = {
  id: number
  title: string
  description: string
  highlight: string
  image_url: string
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    async function loadSlides() {
      const { data, error } = await supabase
        .from("slides")
        .select("id, title, description, highlight, image_url")
        .order("created_at", { ascending: true });

      if (error) {
        // console.error("Supabase load error:", error);
        return;
      }

      // console.log("Slides loaded:", data);
      setSlides(data || []);
    }

    loadSlides();
  }, []);

  useEffect(() => {
    // console.log('slides state updated:', slides)
  }, [slides])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (slides.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <LoadingIndicator
          size={120}
          imageClassName="text-amber-700 dark:text-amber-300"
          wrapperClassName="py-8 scale-[0.67] sm:scale-100 origin-top"
        />
      </section>
    );
  }

  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images with Transition */}
      <div className="absolute inset-0 z-0">
        {/* 底層：會左右滑動且縮放的圖片列 */}
        <div
          className="absolute inset-0 flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative w-full h-full flex-shrink-0 overflow-hidden"
            >
              {/* 只讓這一層做縮放動畫 */}
              <div className="absolute inset-0 scale-105 animate-subtle-zoom">
                <img
                  src={slide.image_url || "/placeholder.svg"}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            </div>
          ))}
        </div>

        {/* 最上層：固定的半透明漸層（不跟著縮放或滑動） */}
        <div className="pointer-events-none absolute inset-0 bottom-[15px] bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="min-h-[120px] md:min-h-[240px] flex items-end">
            <h1 className={`w-full text-center text-5xl md:text-7xl lg:text-8xl font-bold text-balance leading-tight transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {slides[currentSlide].title.split(' ').map((word, i) => (
                word === slides[currentSlide].highlight ? (
                  <span key={i} className="text-accent">{word} </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              ))}
            </h1>
          </div>
          <p lang="the-Peak" className={`text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-200 min-h-[120px] md:min-h-[90px] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {slides[currentSlide].description}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 hover:scale-105 active:scale-105 transition-all group">
              瀏覽菜單
              <Image
                src="/icons/mug-hot-solid-full.png"
                alt="瀏覽菜單"
                width={20}
                height={20}
                className="h-5 w-5 group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 active:bg-primary/10 hover:scale-105 active:scale-105 hover:text-primary active:text-primary transition-all">
              造訪我們
              <Image
                src="/icons/hand-pointer-regular-full.svg"
                alt="造訪我們"
                width={20}
                height={20}
                className="h-5 w-5 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background active:bg-background p-3 rounded-full hover:scale-110 active:scale-110 transition-all backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background active:bg-background p-3 rounded-full hover:scale-110 active:scale-110 transition-all backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-foreground" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'w-8 bg-primary'
                : 'w-2 bg-primary/30 hover:bg-primary/50 active:bg-primary/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary/50 rounded-full" />
        </div>
      </div> */}
    </section>
  )
}
