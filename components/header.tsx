'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-border shadow-sm' 
        : 'bg-background/80 backdrop-blur-sm border-border/50'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="text-2xl md:text-3xl font-bold text-primary hover:scale-105 transition-transform duration-300 cursor-pointer">
            Artisan
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-semibold text-foreground hover:text-primary hover:translate-y-[-2px] transition-all">
              Home
            </a>
            <a href="#about" className="text-sm font-semibold text-foreground hover:text-primary hover:translate-y-[-2px] transition-all">
              About
            </a>
            <a href="#menu" className="text-sm font-semibold text-foreground hover:text-primary hover:translate-y-[-2px] transition-all">
              Menu
            </a>
            <a href="#gallery" className="text-sm font-semibold text-foreground hover:text-primary hover:translate-y-[-2px] transition-all">
              Gallery
            </a>
            <a href="#contact" className="text-sm font-semibold text-foreground hover:text-primary hover:translate-y-[-2px] transition-all">
              Contact
            </a>
          </nav>

          <Button className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all">
            Order Now
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:scale-110 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t border-border animate-in slide-in-from-top duration-300">
            <a
              href="#home"
              className="block text-sm font-semibold text-foreground hover:text-primary hover:translate-x-2 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#about"
              className="block text-sm font-semibold text-foreground hover:text-primary hover:translate-x-2 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#menu"
              className="block text-sm font-semibold text-foreground hover:text-primary hover:translate-x-2 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </a>
            <a
              href="#gallery"
              className="block text-sm font-semibold text-foreground hover:text-primary hover:translate-x-2 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </a>
            <a
              href="#contact"
              className="block text-sm font-semibold text-foreground hover:text-primary hover:translate-x-2 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all">
              Order Now
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
