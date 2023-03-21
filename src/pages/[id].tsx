import { useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'

import { Editor } from '@/components/Editor'
import { useEditor } from '@/contexts/EditorContext'
import { Loading } from '@/components/Loading'

export default function Note() {
  const { editor, setCodeSnippet } = useEditor()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const { id } = router.query

  useEffect(() => {
    if (editor && id) {
      fetch(`/api/${id}`)
        .then((res) => res.json())
        .then((data) => {
          editor.commands.setContent(data.html)
          setCodeSnippet(data.codeSnippet)
        })
        .finally(() => setIsLoading(false))
    }
  }, [editor, id, setCodeSnippet])

  return (
    <>
      <Loading isLoading={isLoading} />
      <NextSeo noindex />

      <Editor />
    </>
  )
}
