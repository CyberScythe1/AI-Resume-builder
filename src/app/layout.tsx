import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Resume Maker',
  description: 'Build your professional resume powered by AI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
