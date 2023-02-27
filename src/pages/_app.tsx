import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { SEOConfig } from '@/config/seo.config'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <DefaultSeo {...SEOConfig} />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
