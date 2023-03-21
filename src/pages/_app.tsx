import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import { DefaultSeo } from 'next-seo'
import { HotkeysProvider } from 'react-hotkeys-hook'

import { SEOConfig } from '@/config/seo.config'
import { EditorProvider } from '@/contexts/EditorContext'
import { Menu } from '@/components/Menu'
import CommandPalette from '@/components/CommandPalette'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...SEOConfig} />

      <HotkeysProvider>
        <EditorProvider>
          <Menu />
          <CommandPalette />

          <div className="h-screen bg-omni-dark flex max-w-3xl mx-auto">
            <main className="flex-1">
              <div className="px-10 py-16">
                <Component {...pageProps} />
              </div>
            </main>
          </div>
        </EditorProvider>
      </HotkeysProvider>

      <Analytics />
    </>
  )
}
