import type { Metadata } from 'next'
import { Crimson_Text } from 'next/font/google'
import localFont from "next/font/local";
import { Analytics } from '@vercel/analytics/next'
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

export const metadata: Metadata = {
  title: 'Shiguang Coffee House - Crafted with Care',
  description: 'Experience the finest shiguangal coffee in a warm, welcoming atmosphere. Every cup tells a story.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={chenYu.variable}>
      <body className={`${crimsonText.className} font-sans antialiased suppressHydrationWarning`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
