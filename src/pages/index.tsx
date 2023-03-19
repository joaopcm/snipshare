import { NextSeo } from 'next-seo'
import { Editor } from '@/components/Editor'

export default function NewNote() {
  return (
    <>
      <NextSeo noindex title="New note" />
      <Editor />
    </>
  )
}
