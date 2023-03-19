import { useEffect, useState } from 'react'

import { Editor } from '@/components/Editor'
import { useEditor } from '@/contexts/EditorContext'
import { useRouter } from 'next/router'
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
        .finally(() => setTimeout(() => setIsLoading(false), 500))
    }
  }, [editor, id, setCodeSnippet])

  return (
    <>
      <Loading isLoading={isLoading} />
      <Editor />
    </>
  )
}
