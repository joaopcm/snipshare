import './globals.css'

import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'

import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Snipshare',
}

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
