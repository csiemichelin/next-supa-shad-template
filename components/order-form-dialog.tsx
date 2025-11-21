'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface OrderFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ICE_OPTIONS = ['正常冰', '少冰', '微冰', '去冰', '熱飲']
const SWEETNESS_OPTIONS = ['正常糖', '少糖', '半糖', '微糖', '無糖']

export function OrderFormDialog({ open, onOpenChange }: OrderFormDialogProps) {
  const { items, getTotal, clearCart } = useCart()
  const router = useRouter()
  const [orderType, setOrderType] = useState<'dine-in' | 'takeout'>('dine-in')
  const [tableNumber, setTableNumber] = useState('')
  const [iceLevel, setIceLevel] = useState(ICE_OPTIONS[0])
  const [sweetness, setSweetness] = useState(SWEETNESS_OPTIONS[0])
  const [specialRequest, setSpecialRequest] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const hasItems = items.length > 0
  const totalCost = useMemo(() => getTotal(), [getTotal, items])

  useEffect(() => {
    if (!open) {
      setStatusMessage(null)
      setErrorMessage(null)
      setIsSubmitting(false)
    }
  }, [open])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatusMessage(null)
    setErrorMessage(null)

    if (!hasItems) {
      setErrorMessage('購物車為空，請先選擇餐點')
      return
    }

    if (orderType === 'dine-in' && !tableNumber.trim()) {
      setErrorMessage('內用請輸入桌號')
      return
    }

    setIsSubmitting(true)

    const payload = {
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber.trim() : '外帶',
      iceLevel,
      sweetness,
      specialRequest: specialRequest.trim(),
      contactInfo: contactInfo.trim(),
      items,
      total: totalCost,
    }

    console.info('[OrderFormDialog] 客戶送出線上點餐資料', payload)

    setStatusMessage('收到您的需求囉！餐點準備中')
    clearCart()
    setIsSubmitting(false)
    setIsSuccessModalOpen(true)
    onOpenChange(false)
  }

  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false)
    router.push('/')
  }

  const handleOrderTypeChange = (type: 'dine-in' | 'takeout') => {
    setOrderType(type)
    if (type === 'takeout') {
      setTableNumber('')
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="
            max-w-3xl
            md:max-w-4xl
            fixed left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            max-h-[calc(100vh-2rem)]
            overflow-y-auto
            custom-scrollbar
          "
        >
          <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle lang="zh-Hant" className="text-3xl font-bold">
              線上點餐單
            </DialogTitle>
            <DialogDescription lang="the-Peak" className="text-base">
              {hasItems
                ? `已選擇 ${items.length} 種餐點，請填寫取餐方式與備註`
                : '購物車為空，請先選擇餐點'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-xl border border-border/60 bg-muted/30 p-4 md:p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">已選擇的餐點</h3>
              </div>
              {hasItems ? (
                <ul className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {items.map((item) => (
                    <li key={item.name} className="flex items-start justify-between gap-3 bg-background rounded-lg p-3 shadow-sm">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">數量：{item.quantity}</p>
                        <p className="text-sm text-muted-foreground">{item.price}</p>
                      </div>
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-md border border-dashed border-border/70 bg-background/60 p-4 text-center text-sm text-muted-foreground">
                  購物車為空
                </div>
              )}
              <div className="flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-base font-semibold">預估金額</span>
                <span className="text-xl font-bold text-primary">
                  NT${totalCost.toFixed(2)}
                </span>
              </div>
            </section>

            <section className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  取餐方式
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={orderType === 'dine-in' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handleOrderTypeChange('dine-in')}
                  >
                    內用
                  </Button>
                  <Button
                    type="button"
                    variant={orderType === 'takeout' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => handleOrderTypeChange('takeout')}
                  >
                    外帶
                  </Button>
                </div>
                {orderType === 'dine-in' && (
                  <div className="flex flex-col gap-2">
                    <label htmlFor="tableNumber" className="text-sm font-medium">
                      請輸入桌號
                    </label>
                    <input
                      id="tableNumber"
                      name="tableNumber"
                      value={tableNumber}
                      onChange={(event) => setTableNumber(event.target.value)}
                      placeholder="例如：A3 或 B1"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">冰塊</label>
                  <InlineSelect
                    value={iceLevel}
                    options={ICE_OPTIONS}
                    onChange={setIceLevel}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">甜度</label>
                  <InlineSelect
                    value={sweetness}
                    options={SWEETNESS_OPTIONS}
                    onChange={setSweetness}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact" className="text-sm font-medium">
                  聯繫資訊
                </label>
                <input
                  id="contact"
                  name="contact"
                  value={contactInfo}
                  onChange={(event) => setContactInfo(event.target.value)}
                  placeholder="方便聯繫的暱稱或電話"
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="specialRequest" className="text-sm font-medium">
                  特殊要求
                </label>
                <textarea
                  id="specialRequest"
                  name="specialRequest"
                  rows={4}
                  value={specialRequest}
                  onChange={(event) => setSpecialRequest(event.target.value)}
                  placeholder="例如：預計 13:00 取餐、去奶、備註過敏食材..."
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
            </section>
          </div>

          {(errorMessage || statusMessage) && (
            <div
              className={`rounded-md border px-4 py-2 text-sm ${
                errorMessage
                  ? 'border-destructive/40 text-destructive bg-destructive/10'
                  : 'border-green-5 text-green-700 bg-green-50'
              }`}
            >
              {errorMessage ?? statusMessage}
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto"
              disabled={isSubmitting || !hasItems}
            >
              {isSubmitting ? '送出中...' : '送出訂單'}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="w-full text-center px-4 py-8 custom-scrollbar" showCloseButton={false}>
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-40 w-40 overflow-hidden rounded-full bg-[#FCEBD9]">
              <Image
                src="/gif/coffee-preparing-v2.gif"
                alt="咖啡製作中"
                fill
                className="object-cover"
                sizes="160px"
                priority
              />
            </div>
            <DialogTitle lang="zh-Hant" className="text-3xl font-bold text-primary">
              收到您的需求囉！
            </DialogTitle>
            <DialogDescription lang="the-Peak" className="text-base leading-relaxed text-muted-foreground">
              餐點準備中，請稍候，精彩風味即將送上
            </DialogDescription>
            <Button className="mt-2 px-8" onClick={handleSuccessConfirm}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface InlineSelectProps {
  value: string
  options: string[]
  onChange: (value: string) => void
}

function InlineSelect({ value, options, onChange }: InlineSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    const handleClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [open])

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex w-full items-center justify-between
          rounded-md border border-input bg-background
          px-3 py-2 text-left text-sm
          focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-primary/40
        "
      >
        <span>{value}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-md border border-border bg-background shadow-md">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                option === value
                  ? 'bg-primary/5 font-semibold text-primary'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => {
                onChange(option)
                setOpen(false)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
