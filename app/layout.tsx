import type { Metadata } from 'next'
import { Crimson_Text } from 'next/font/google'
import localFont from "next/font/local";
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { MenuProvider } from '@/contexts/menu-context'
import './globals.css'

const crimsonText = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  display: 'swap',
});

// 加入辰宇落雁體
const chenYu = localFont({
  src: '../public/fonts/ChenYuluoyan-2.0-Thin.ttf',
  display: 'swap',
  variable: '--font-chernyu',
})

// 加入隨峰體
const thePeak = localFont({
  src: '../public/fonts/ThePeakFontBeta_V0_102.ttf',
  display: 'swap',
  variable: '--font-thepeak',
})

export const metadata: Metadata = {
  title: '時光咖啡 Shiguang Coffee',
  description: '在溫暖靜謐的空間裡，細細品味每一杯手作咖啡，讓時光慢一點走。',
  generator: 'v0.app',
  icons: {
    icon: '/logo/logo_white.png',
    apple: '/logo/logo_white.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${chenYu.variable} ${thePeak.variable}`} suppressHydrationWarning>
      <body className={`${crimsonText.className} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <MenuProvider>
            {children}
          </MenuProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
