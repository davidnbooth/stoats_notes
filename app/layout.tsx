import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stoats Notes',
  description: 'Stoats Notes - a free and shareable note-taking app',
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
