import { NextSeo } from 'next-seo'
import { useEffect } from 'react'

import { Editor } from '@/components/Editor'
import { initialCode, useEditor } from '@/contexts/EditorContext'

export default function NewNote() {
  const { editor, setCodeSnippet } = useEditor()

  useEffect(() => {
    editor?.commands.clearContent()
    setCodeSnippet(initialCode)
  }, [editor, setCodeSnippet])

  return (
    <>
      <NextSeo noindex title="New note" />
      <Editor />
    </>
  )
}
