'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Phone, Clock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Image from "next/image"

export function Contact() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            [0, 1, 2].forEach((index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 150)
            })
            setTimeout(() => setIsButtonVisible(true), 800)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const contactCards = [
    {
      icon: MapPin,
      title: '店鋪地址',
      content: (
        <>
          台北市中正區咖啡街 123 號 1 樓<br />
        </>
      ),
    },
    {
      icon: Clock,
      title: '營業時間',
      content: (
        <>
          週一至週五｜上午 7:00 – 晚上 7:00<br />
          週六至週日｜上午 8:00 – 晚上 8:00
        </>
      ),
    },
    {
      icon: Phone,
      title: '聯絡方式',
      content: (
        <>
          電話｜(03) 1688-9457<br />
          Email｜shiguang@gmail.com
        </>
      ),
    },
  ]

  return (
    <section ref={sectionRef} id="contact" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div lang="zh-Hant" className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            聯絡我們
          </h2>
          <p className="text-2xl text-muted-foreground leading-relaxed">
            期待你的到來，來坐下喝杯咖啡，享受屬於你的慢時光
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactCards.map((card, index) => {
              const Icon = card.icon
              const isVisible = visibleCards.includes(index)
              return (
                <Card 
                  key={index} 
                  className={`border-border hover:shadow-lg hover:-translate-y-2 transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <CardContent className="pt-6 text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-2 transition-all hover:bg-accent/20 hover:scale-110 hover:rotate-12 duration-300">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {card.content}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="border-border overflow-hidden hover:shadow-xl transition-shadow duration-500">
            <CardContent className="p-0">
              <div className="aspect-[16/9] bg-muted rounded-lg overflow-hidden group">
                <img
                  src="/images/store-front.png"
                  alt="Shiguang Coffee storefront"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </CardContent>
          </Card>

          <div className={`text-center mt-12 transition-all duration-700 ${
            isButtonVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all">
              查看路線
              <Image
                src="/icons/map-location-dot-solid-full.png"
                alt="造訪我們"
                width={20}
                height={20}
                className="h-5 w-5 group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
