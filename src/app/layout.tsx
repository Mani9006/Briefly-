import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Briefly - AI-Powered Transcription & Meeting Notes',
  description: 'Transform conversations into actionable insights. Real-time transcription, AI summaries, and smart meeting notes.',
  icons: {
    icon: '/favicon.svg',
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
