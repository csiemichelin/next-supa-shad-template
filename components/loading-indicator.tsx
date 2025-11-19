import { cn } from '@/lib/utils'
import { useRef } from 'react'
import type { CSSProperties } from 'react'

type LoadingIndicatorProps = {
  wrapperClassName?: string
  imageClassName?: string
  size?: number
}

export function LoadingIndicator({ wrapperClassName, imageClassName, size = 96 }: LoadingIndicatorProps) {
  const cacheBusterRef = useRef<number | null>(null)
  if (cacheBusterRef.current === null) {
    cacheBusterRef.current = Date.now()
  }

  return (
    <div
      className={cn('flex items-center justify-center', wrapperClassName)}
      style={
        {
          '--loader-size': `${size}px`,
        } as CSSProperties
      }
    >
      <img
        src={`/gif/coffee-loading.gif?reload=${cacheBusterRef.current}`}
        alt="Loading animation"
        className={cn('h-[var(--loader-size)] w-[var(--loader-size)] object-contain', imageClassName)}
      />
    </div>
  )
}
