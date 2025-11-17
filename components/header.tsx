'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { CartButton } from './cart-button'

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
        <div className="flex items-center justify-between h-20 md:h-24">
          <div className="text-2xl md:text-3xl font-bold text-primary hover:scale-105 transition-transform duration-300 cursor-pointer">
            Shiguang
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <a href="#home" className="nav-link group relative text-lg font-semibold text-foreground hover:text-primary transition-all">
              <span className="relative z-10">Home</span>
              <div className="coffee-cup-container">
                <svg className="coffee-cup-icon" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 10h2a3 3 0 0 1 0 6h-2m-5 4H10a4 4 0 0 1-4-4V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="steam-container">
                  <span className="steam-wisp steam-1"></span>
                  <span className="steam-wisp steam-2"></span>
                  <span className="steam-wisp steam-3"></span>
                </div>
              </div>
            </a>
            <a href="#about" className="nav-link group relative text-lg font-semibold text-foreground hover:text-primary transition-all">
              <span className="relative z-10">About</span>
              <div className="coffee-cup-container">
                <svg className="coffee-cup-icon" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 10h2a3 3 0 0 1 0 6h-2m-5 4H10a4 4 0 0 1-4-4V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="steam-container">
                  <span className="steam-wisp steam-1"></span>
                  <span className="steam-wisp steam-2"></span>
                  <span className="steam-wisp steam-3"></span>
                </div>
              </div>
            </a>
            <a href="#menu" className="nav-link group relative text-lg font-semibold text-foreground hover:text-primary transition-all">
              <span className="relative z-10">Menu</span>
              <div className="coffee-cup-container">
                <svg className="coffee-cup-icon" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 10h2a3 3 0 0 1 0 6h-2m-5 4H10a4 4 0 0 1-4-4V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="steam-container">
                  <span className="steam-wisp steam-1"></span>
                  <span className="steam-wisp steam-2"></span>
                  <span className="steam-wisp steam-3"></span>
                </div>
              </div>
            </a>
            <a href="#gallery" className="nav-link group relative text-lg font-semibold text-foreground hover:text-primary transition-all">
              <span className="relative z-10">Gallery</span>
              <div className="coffee-cup-container">
                <svg className="coffee-cup-icon" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 10h2a3 3 0 0 1 0 6h-2m-5 4H10a4 4 0 0 1-4-4V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="steam-container">
                  <span className="steam-wisp steam-1"></span>
                  <span className="steam-wisp steam-2"></span>
                  <span className="steam-wisp steam-3"></span>
                </div>
              </div>
            </a>
            <a href="#contact" className="nav-link group relative text-lg font-semibold text-foreground hover:text-primary transition-all">
              <span className="relative z-10">Contact</span>
              <div className="coffee-cup-container">
                <svg className="coffee-cup-icon" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 10h2a3 3 0 0 1 0 6h-2m-5 4H10a4 4 0 0 1-4-4V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="steam-container">
                  <span className="steam-wisp steam-1"></span>
                  <span className="steam-wisp steam-2"></span>
                  <span className="steam-wisp steam-3"></span>
                </div>
              </div>
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <CartButton />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all">
              Order Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <CartButton />
            <button
              className="p-2 hover:scale-110 transition-transform"
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
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t border-border animate-in slide-in-from-top duration-300">
            <a
              href="#home"
              className="nav-link-mobile group relative block text-lg font-semibold text-foreground hover:text-primary transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="relative z-10 inline-block hover:translate-x-2 transition-transform">Home</span>
            </a>
            <a
              href="#about"
              className="nav-link-mobile group relative block text-lg font-semibold text-foreground hover:text-primary transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="relative z-10 inline-block hover:translate-x-2 transition-transform">About</span>
            </a>
            <a
              href="#menu"
              className="nav-link-mobile group relative block text-lg font-semibold text-foreground hover:text-primary transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="relative z-10 inline-block hover:translate-x-2 transition-transform">Menu</span>
            </a>
            <a
              href="#gallery"
              className="nav-link-mobile group relative block text-lg font-semibold text-foreground hover:text-primary transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="relative z-10 inline-block hover:translate-x-2 transition-transform">Gallery</span>
            </a>
            <a
              href="#contact"
              className="nav-link-mobile group relative block text-lg font-semibold text-foreground hover:text-primary transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="relative z-10 inline-block hover:translate-x-2 transition-transform">Contact</span>
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
