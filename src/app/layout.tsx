import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SideQuest',
  description: 'Your life. Your quest board.',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 antialiased">{children}</body>
    </html>
  )
}
