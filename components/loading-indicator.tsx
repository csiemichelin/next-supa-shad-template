import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

type LoadingIndicatorProps = {
  wrapperClassName?: string
  imageClassName?: string
  size?: number
}

export function LoadingIndicator({ wrapperClassName, imageClassName, size = 96 }: LoadingIndicatorProps) {
  const [cacheBuster, setCacheBuster] = useState<number | null>(null)

  
  useEffect(() => {
    setCacheBuster(Date.now())
  }, [])

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
        src={cacheBuster
          ? `/gif/coffee-loading.gif?reload=${cacheBuster}`
          : `/gif/coffee-loading.gif`}
        alt="Loading animation"
        className={cn('h-[var(--loader-size)] w-[var(--loader-size)] object-contain', imageClassName)}
      />
    </div>
  )
}
