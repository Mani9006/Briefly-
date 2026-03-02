import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0c8eeb',
}

export const metadata: Metadata = {
  title: 'Briefly - AI-Powered Transcription & Meeting Notes',
  description: 'Transform conversations into actionable insights. Real-time transcription, AI summaries, and smart meeting notes.',
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Briefly - AI-Powered Transcription & Meeting Notes',
    description: 'Transform conversations into actionable insights. Real-time transcription, AI summaries, and smart meeting notes.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
