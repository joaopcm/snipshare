import { EditorContent } from '@tiptap/react'

import { useEditor } from '@/contexts/EditorContext'

export function Editor() {
  const editor = useEditor()

  editor?.on('update', ({ transaction, editor }) => {
    if (transaction.docChanged) {
      console.log(editor.getHTML())
    }
  })

  return (
    <>
      <EditorContent editor={editor} />
    </>
  )
}
