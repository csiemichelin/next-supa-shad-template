'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { useMenu } from '@/contexts/menu-context'
import { LoadingIndicator } from '@/components/loading-indicator'
import type { MenuItem as MenuItemType } from '@/contexts/menu-context'
import { cn } from '@/lib/utils'

export function Menu() {
  const { addItem } = useCart()
  const { categories, isLoading } = useMenu()
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const [currentPages, setCurrentPages] = useState<Record<string, number>>({})
  const [isDesktop, setIsDesktop] = useState(false)
  const [desktopPage, setDesktopPage] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const ITEMS_PER_PAGE = 5
  const DESKTOP_CARDS_PER_PAGE = 3

  const getCurrentPage = (categoryId: string, totalPages: number) => {
    const page = currentPages[categoryId] ?? 0
    if (page >= totalPages) return totalPages - 1
    if (page < 0) return 0
    return page
  }
  const goToPage = (categoryId: string, page: number, totalPages: number) => {
    const safePage = Math.max(0, Math.min(page, totalPages - 1))
    setCurrentPages((prev) => ({
      ...prev,
      [categoryId]: safePage,
    }))
  }
  const goNextPage = (categoryId: string, totalPages: number) => {
    setCurrentPages((prev) => {
      const current = getCurrentPage(categoryId, totalPages)
      const next = current + 1 >= totalPages ? current : current + 1
      return { ...prev, [categoryId]: next }
    })
  }
  const goPrevPage = (categoryId: string, totalPages: number) => {
    setCurrentPages((prev) => {
      const current = getCurrentPage(categoryId, totalPages)
      const next = current - 1 < 0 ? 0 : current - 1
      return { ...prev, [categoryId]: next }
    })
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const updateIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    updateIsDesktop()
    window.addEventListener('resize', updateIsDesktop)
    return () => window.removeEventListener('resize', updateIsDesktop)
  }, [])

  const desktopPages =
    categories.length > 0 ? Math.ceil(categories.length / DESKTOP_CARDS_PER_PAGE) : 0

  const handleDesktopNext = () => {
    if (desktopPages === 0) return
    setDesktopPage((prev) => (prev + 1) % desktopPages)
  }

  const handleDesktopPrev = () => {
    if (desktopPages === 0) return
    setDesktopPage((prev) => (prev - 1 + desktopPages) % desktopPages)
  }

  useEffect(() => {
    if (!isDesktop || desktopPages <= 1) return
    const interval = window.setInterval(() => {
      setDesktopPage((prev) => (prev + 1) % desktopPages)
    }, 7000)
    return () => clearInterval(interval)
  }, [isDesktop, desktopPages])

  useEffect(() => {
    if (!isDesktop) return
    if (desktopPages === 0) {
      setDesktopPage(0)
      return
    }
    setDesktopPage((prev) => (prev >= desktopPages ? 0 : prev))
  }, [desktopPages, isDesktop])

  useEffect(() => {
    setVisibleCards([])

    if (!sectionRef.current || categories.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            categories.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) =>
                  prev.includes(index) ? prev : [...prev, index]
                )
              }, index * 200)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [categories])

  const handleItemClick = (item: MenuItemType) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem({
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: 1,
        image: selectedItem.image ?? undefined,
      })
      setIsDialogOpen(false)
    }
  }

  useEffect(() => {
    setIsImageLoaded(false)
  }, [selectedItem?.image])

  const desktopStartIndex = isDesktop ? desktopPage * DESKTOP_CARDS_PER_PAGE : 0
  const categoriesToRender = isDesktop
    ? categories.slice(desktopStartIndex, desktopStartIndex + DESKTOP_CARDS_PER_PAGE)
    : categories

  return (
    <>
      <section ref={sectionRef} id="menu" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 lang="zh-Hant" className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              精選菜單
            </h2>
            <p lang="the-Peak" className="text-lg text-muted-foreground leading-relaxed">
              品味每一杯用心手作的風味
            </p>
          </div>

          {isLoading ? (
            <LoadingIndicator
              size={120}
              imageClassName="text-amber-700 dark:text-amber-300"
              wrapperClassName="py-8 scale-[0.67] sm:scale-100 origin-top"
            />
          ) : categories.length === 0 ? (
            <div className="text-center text-muted-foreground">尚未建立任何菜單內容</div>
          ) : (
            <div className="relative max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoriesToRender.map((category, index) => {
                  const originalIndex = isDesktop ? desktopStartIndex + index : index
                  const isVisible = visibleCards.includes(originalIndex)
                  const totalPages = isDesktop
                    ? Math.ceil(category.items.length / ITEMS_PER_PAGE)
                    : 1
                  const currentPage = isDesktop ? getCurrentPage(category.id, totalPages) : 0
                  const start = currentPage * ITEMS_PER_PAGE
                  const visibleItems = isDesktop
                    ? category.items.slice(start, start + ITEMS_PER_PAGE)
                    : category.items

                  return (
                    <Card
                      key={category.id}
                      className={`
                          relative
                          flex flex-col
                          md:h-[630px]
                          border-border hover:shadow-xl active:shadow-xl hover:-translate-y-1 active:-translate-y-1 hover:border-accent/50 active:border-accent/50
                          transition-all duration-500
                          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                        `}
                    >
                      <CardHeader>
                        <CardTitle lang="zh-Hant" className="text-2xl font-bold text-primary">
                          {category.category}
                        </CardTitle>
                      </CardHeader>

                      {/* 手機上要能左右滑動切換頁數 */}
                      <CardContent className="space-y-4 md:pb-14">
                        {visibleItems.map((item) => (
                          <div
                            key={item.id}
                            className="space-y-1 hover:translate-x-2 transition-transform duration-300 cursor-pointer group"
                            onClick={() => handleItemClick(item)}
                          >
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                                {item.name}
                              </h4>
                              <span className="text-accent font-semibold">{item.price}</span>
                            </div>
                            <CardDescription lang="the-Peak" className="text-sm leading-relaxed">
                              {item.description}
                            </CardDescription>
                          </div>
                        ))}
                      </CardContent>
                      {/* 分頁控制：桌機版顯示 / 手機隱藏 */}
                      {isDesktop && totalPages > 1 && (
                        <div className="hidden md:flex justify-between items-center p-3 px-6 md:absolute md:left-0 md:right-0 md:bottom-[15px]">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-sm text-muted-foreground disabled:opacity-40"
                            onClick={() => goPrevPage(category.id, totalPages)}
                            disabled={currentPage === 0}
                          >
                            上一頁
                          </Button>

                          <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => goToPage(category.id, i, totalPages)}
                                className={`h-2 w-2 rounded-full transition-all ${
                                  i === currentPage
                                    ? 'w-4 bg-accent'
                                    : 'bg-accent/30 hover:bg-accent/60 active:bg-accent/60'
                                }`}
                              />
                            ))}
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-sm text-muted-foreground disabled:opacity-40"
                            onClick={() => goNextPage(category.id, totalPages)}
                            disabled={currentPage === totalPages - 1}
                          >
                            下一頁
                          </Button>
                        </div>
                      )}
                    </Card>
                  )
                })}
              </div>

              {isDesktop && desktopPages > 1 && (
                <>
                  <button
                    onClick={handleDesktopPrev}
                    className="hidden md:flex absolute -left-[60px] top-1/2 -translate-y-1/2 z-20 hover:bg-white active:bg-white p-3 rounded-full hover:scale-110 active:scale-110 transition-all backdrop-blur-sm"
                    aria-label="Previous category page"
                  >
                    <ChevronLeft className="h-6 w-6 text-foreground" />
                  </button>
                  <button
                    onClick={handleDesktopNext}
                    className="hidden md:flex absolute -right-[60px] top-1/2 -translate-y-1/2 z-20 hover:bg-white active:bg-white p-3 rounded-full hover:scale-110 active:scale-110 transition-all backdrop-blur-sm"
                    aria-label="Next category page"
                  >
                    <ChevronRight className="h-6 w-6 text-foreground" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl custom-scrollbar">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle lang="zh-Hant" className="text-3xl font-bold text-primary">
                  {selectedItem.name}
                </DialogTitle>
                <DialogDescription lang="the-Peak" className="text-lg text-muted-foreground">
                  {selectedItem.description}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {selectedItem.image && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    {!isImageLoaded && (
                      <LoadingIndicator
                        size={120}
                        imageClassName="text-amber-700 dark:text-amber-300"
                        wrapperClassName="py-8 scale-[0.67] sm:scale-100 origin-top"
                      />
                    )}
                    <img
                      src={selectedItem.image || '/placeholder.svg'}
                      alt={selectedItem.name}
                      className={cn(
                        'w-full h-full object-cover transition-opacity duration-300',
                        isImageLoaded ? 'opacity-100' : 'opacity-0'
                      )}
                      onLoad={() => setIsImageLoaded(true)}
                      onError={(e) => {
                        setIsImageLoaded(true)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <div className="space-y-4">
                  {selectedItem.details && (
                    <p lang="the-Peak" className="text-base text-foreground leading-relaxed">
                      {selectedItem.details}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-3xl font-bold text-accent">
                      {selectedItem.price}
                    </span>
                    <Button
                      size="lg"
                      onClick={handleAddToCart}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 hover:scale-105 active:scale-105 transition-all group"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      加入購物車
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
