import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from "@/components/navbar"
import './globals.css'

export const metadata: Metadata = {
  title: 'BilliardPro - Tournament Management',
  description: 'Create and manage professional billiard tournaments',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
