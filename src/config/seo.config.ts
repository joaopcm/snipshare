import { DefaultSeoProps } from 'next-seo/lib'

const DEFAULT_TITLE = 'NodePad'
export const DEFAULT_DESCRIPTION =
  'Build your notes using Markdown... Plus, have all the code blocks interactively run in the browser 🚀'

export const SEOConfig: DefaultSeoProps = {
  titleTemplate: 'NodePad | %s',
  defaultTitle: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  canonical: 'https://nodepad.jopcmelo.dev',
  themeColor: '#191622',
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
    url: 'https://nodepad.jopcmelo.dev',
    siteName: 'NodePad',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: 'https://nodepad.jopcmelo.dev/logo.png',
        width: 1200,
        height: 630,
        alt: 'NodePad logo',
      },
    ],
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
}
