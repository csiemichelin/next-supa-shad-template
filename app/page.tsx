import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Features } from '@/components/features'
import { Menu } from '@/components/menu'
import { Gallery } from '@/components/gallery'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden max-w-full">
      <Header />
      <Hero />
      <Features />
      <Menu />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  )
}
