import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Multilingual Shopify SEO & Conversion Tool',
  description: 'AI-powered SEO descriptions and conversion optimization for Shopify',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
