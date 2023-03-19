import { NextSeo } from 'next-seo'
import { GetStaticPaths, GetStaticProps } from 'next'

import { Editor } from '@/components/Editor'
import { useEditor } from '@/contexts/EditorContext'
import { getNoteById } from '@/services/getNoteById'

interface NodeProps {
  html: string
  codeSnippet: string
}

export default function Note({ html, codeSnippet }: NodeProps) {
  const { editor, setCodeSnippet } = useEditor()

  if (!editor) {
    return null
  }

  editor.commands.setContent(html)
  setCodeSnippet(codeSnippet)

  return (
    <>
      <NextSeo noindex />

      <Editor />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string

  const data = await getNoteById(id)

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...data,
    },
    revalidate: 60 * 60 * 24 * 30, // 30 days, in seconds
  }
}
