import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PR Review Guide',
  description: "dillon-wispr's recurring PR feedback patterns",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#282a36] min-h-screen">
        <main className="prose prose-invert prose-pre:p-0 max-w-3xl mx-auto px-6 py-16">
          {children}
        </main>
      </body>
    </html>
  )
}
