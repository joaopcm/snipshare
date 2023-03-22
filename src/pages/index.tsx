import { NextSeo } from 'next-seo'
import { useEffect } from 'react'

import { Editor } from '@/components/Editor'
import { initialCode, useEditor } from '@/contexts/EditorContext'
import { useCounter } from '@/contexts/CounterContext'

export default function NewNote() {
  const { editor, setCodeSnippet } = useEditor()
  const { setCounter } = useCounter()

  useEffect(() => {
    editor?.commands.clearContent()
    setCodeSnippet(initialCode)
    setCounter(0)
  }, [editor, setCodeSnippet, setCounter])

  return (
    <>
      <NextSeo noindex title="New note" />
      <Editor />
    </>
  )
}
