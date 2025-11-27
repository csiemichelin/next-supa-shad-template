import type { Metadata } from 'next'
import { Crimson_Text } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/contexts/auth-context'
import { MenuProvider } from '@/contexts/menu-context'
import './globals.css'

const crimsonText = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const chenYu = localFont({
  src: '../public/fonts/ChenYuluoyan-2.0-Thin.ttf',
  display: 'swap',
  variable: '--font-chernyu',
})

const thePeak = localFont({
  src: '../public/fonts/ThePeakFontBeta_V0_102.ttf',
  display: 'swap',
  variable: '--font-thepeak',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://shiguang-coffee.vercel.app'),
  title: {
    default: '時光咖啡 | 台北精品咖啡・手沖・拉花拿鐵',
    template: '%s | 時光咖啡',
  },
  description:
    '時光咖啡（Shiguang Coffee）位於台北，主打手沖精品咖啡、拉花拿鐵與手作甜點，提供外帶外送與舒適內用空間。',
  keywords: [
    '時光咖啡',
    '台北咖啡',
    '台北咖啡廳',
    '精品咖啡',
    '手沖咖啡',
    '拿鐵拉花',
    '手作甜點',
    'Shiguang Coffee',
  ],
  applicationName: '時光咖啡',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '時光咖啡 | 台北精品咖啡・手沖・拉花拿鐵',
    description:
      '台北「時光咖啡」以手沖精品咖啡、拉花拿鐵、手作甜點與外帶外送，陪你在城市裡留下一刻靜好。',
    url: 'https://shiguang-coffee.vercel.app/',
    siteName: '時光咖啡 Shiguang Coffee',
    locale: 'zh_TW',
    type: 'website',
    images: [
      {
        url: '/images/store-front.png',
        width: 1200,
        height: 630,
        alt: '時光咖啡 台北咖啡店門市',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '時光咖啡 | 台北精品咖啡・拉花拿鐵・手作甜點',
    description: '台北時光咖啡，手沖精品咖啡、拉花拿鐵、甜點外帶外送。',
    images: ['/images/store-front.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.app',
  icons: {
    icon: '/logo/logo_white.png',
    apple: '/logo/logo_white.png',
  },
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CafeOrCoffeeShop',
  name: '時光咖啡',
  url: 'https://shiguang-coffee.vercel.app',
  image: 'https://shiguang-coffee.vercel.app/images/store-front.png',
  description:
    '台北時光咖啡，主打手沖精品咖啡、拉花拿鐵與手作甜點，提供外帶外送與舒適內用空間。',
  address: {
    '@type': 'PostalAddress',
    addressLocality: '台北市',
    addressRegion: '台北市',
    addressCountry: 'TW',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.033,
    longitude: 121.5654,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday', 'Sunday'],
      opens: '08:00',
      closes: '20:00',
    },
  ],
  priceRange: '$$',
  servesCuisine: ['Coffee', 'Desserts'],
  menu: 'https://shiguang-coffee.vercel.app/#menu',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${chenYu.variable} ${thePeak.variable}`}
      suppressHydrationWarning
    >
      <body className={`${crimsonText.className} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <MenuProvider>{children}</MenuProvider>
        </AuthProvider>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  )
}
