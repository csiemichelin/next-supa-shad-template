'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, LogIn } from 'lucide-react'
import { CartButton } from './cart-button'
import Link from "next/link"

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
          <Link href="/" className="inline-flex">
            <div className="flex items-center text-primary hover:scale-105 transition-transform duration-300 cursor-pointer">
              <img
                src="/logo/logo_black.png"
                alt="時光咖啡 Shiguang Coffee"
                className="h-20 md:h-20 object-contain"
              />
              <span lang="zh-Hant" className="text-2xl md:text-3xl font-bold">
                時光咖啡
              </span>
            </div>
          </Link>
  
          <nav className="hidden md:flex items-center gap-10">
            <Link href="#home" className="nav-link group relative text-lg font-semibold text-foreground hover:text-primary transition-all">
              <span
                lang="zh-Hant"
                className="
                  relative z-10 
                  font-normal 
                  text-[1.1rem] md:text-[1.2rem] 
                  transition-all 
                  group-hover:font-bold
                "
              >
                首頁
              </span>
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
            </Link>
            <Link href="#about" className="nav-link group relative text-lg font-semibold text-foreground hover:text-primary transition-all">
              <span
                lang="zh-Hant"
                className="
                  relative z-10 
                  font-normal 
                  text-[1.1rem] md:text-[1.2rem] 
                  transition-all 
                  group-hover:font-bold
                "
              >
                關於我們
              </span>
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
            </Link>
            <Link href="#menu" className="nav-link group relative text-lg font-semibold text-foreground hover:text-primary transition-all">
              <span
                lang="zh-Hant"
                className="
                  relative z-10 
                  font-normal 
                  text-[1.1rem] md:text-[1.2rem] 
                  transition-all 
                  group-hover:font-bold
                "
              >
                菜單
              </span>
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
            </Link>
            <Link href="#gallery" className="nav-link group relative text-lg font-semibold text-foreground hover:text-primary transition-all">
              <span
                lang="zh-Hant"
                className="
                  relative z-10 
                  font-normal 
                  text-[1.1rem] md:text-[1.2rem] 
                  transition-all 
                  group-hover:font-bold
                "
              >
                職人匠心
              </span>
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
            </Link>
            <Link href="#contact" className="nav-link group relative text-lg font-semibold text-foreground hover:text-primary transition-all">
              <span
                lang="zh-Hant"
                className="
                  relative z-10 
                  font-normal 
                  text-[1.1rem] md:text-[1.2rem] 
                  transition-all 
                  group-hover:font-bold
                "
              >
                聯絡我們
              </span>
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
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <CartButton />
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all">
              立即點餐
            </Button>
            <Link href="/login">
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                管理者登入
              </Button>
            </Link>
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
            <Link className="block" href="#home" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary transition-all"
              >
                <span
                  lang="zh-Hant"
                  className="
                    relative z-10 
                    font-normal 
                    text-[1.2rem]
                    transition-all 
                    active:font-bold
                  "
                >首頁</span>
              </Button>
            </Link>
            <Link className="block" href="#about" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary transition-all"
              >
                <span
                  lang="zh-Hant"
                  className="
                    relative z-10 
                    font-normal 
                    text-[1.2rem]
                    transition-all 
                    active:font-bold
                  "
                >關於我們</span>
              </Button>
            </Link>
            <Link className="block" href="#menu" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary transition-all"
              >
                <span
                  lang="zh-Hant"
                  className="
                    relative z-10 
                    font-normal 
                    text-[1.2rem]
                    transition-all 
                    active:font-bold
                  "
                >菜單</span>
              </Button>
            </Link>
            <Link className="block" href="#gallery" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary transition-all"
              >
                <span
                  lang="zh-Hant"
                  className="
                    relative z-10 
                    font-normal 
                    text-[1.2rem]
                    transition-all 
                    active:font-bold
                  "
                >職人匠心</span>
              </Button>
            </Link>
            <Link className="block" href="#contact" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-primary transition-all"
              >
                <span
                  lang="zh-Hant"
                  className="
                    relative z-10 
                    font-normal 
                    text-[1.2rem]
                    transition-all 
                    active:font-bold
                  "
                >聯絡我們</span>
              </Button>
            </Link>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all">
              立即點餐
            </Button>
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                管理者登入
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
