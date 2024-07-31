import { Metadata } from 'next'
import * as React from 'react'
import { Analytics } from "@vercel/analytics/react"
import '@/styles/globals.css'

import { siteConfig } from '@/constants/config'

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  // !STARTERCONF this is the default favicon, you can generate your own from https://realfavicongenerator.net/
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div className='py-8'>
        {children}
        <Analytics />
        </div>
      </body>
    </html>
  )
}
