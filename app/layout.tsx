import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stay Booking - Book Your Perfect Stay',
  description: 'Book your perfect stay in India with easy online payments',
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
