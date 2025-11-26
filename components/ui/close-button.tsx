"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

interface CloseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iconClassName?: string
}

export const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ className, iconClassName, "aria-label": ariaLabel, ...props }, ref) => {
    return (
      <button
        type="button"
        ref={ref}
        aria-label={ariaLabel ?? "Close"}
        className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center border border-border bg-background/80 text-muted-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        <X className={cn("w-5 h-5", iconClassName)} />
      </button>
    )
  }
)

CloseButton.displayName = "CloseButton"
