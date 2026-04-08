import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'NeuroDesk — AI-Powered Productivity Suite',
  description: 'Chat with AI, summarize documents, review code and generate images. All in one place.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e1e2d', color: '#fff' },
          duration: 4000,
        }} />
        {children}
      </body>
      </html>
    </ClerkProvider>
  )
}
