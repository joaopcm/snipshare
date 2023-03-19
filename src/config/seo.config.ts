import { DefaultSeoProps } from 'next-seo/lib'

const DEFAULT_TITLE = 'Nodepad'
export const DEFAULT_DESCRIPTION =
  'Revolutionize your coding experience with this all-in-one markdown-based platform for creating, executing, and sharing code snippets right in your browser. Elevate your development skill with Nodepad today!'

export const SEOConfig: DefaultSeoProps = {
  titleTemplate: '%s | Nodepad',
  defaultTitle: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  canonical: 'https://getnodepad.com',
  themeColor: '#181621',
  robotsProps: {
    noarchive: false,
    nosnippet: false,
    maxSnippet: -1,
    maxImagePreview: 'large',
    maxVideoPreview: -1,
    notranslate: true,
    noimageindex: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://getnodepad.com',
    siteName: 'Nodepad',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: 'https://getnodepad.com/og.png',
        width: 1200,
        height: 630,
        alt: 'Nodepad',
      },
    ],
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
}
