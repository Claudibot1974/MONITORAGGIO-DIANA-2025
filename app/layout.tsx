import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DIANA Monitor 2025',
  description: 'Collaborative monitoring dashboard for DIANA Unit activities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <nav className="border-b">
            <div className="container flex h-16 items-center px-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold">DIANA Monitor</h1>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Team Collaboration</span>
              </div>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  )
}
