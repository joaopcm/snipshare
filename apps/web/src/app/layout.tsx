import './globals.css'

import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Snipshare',
}

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
