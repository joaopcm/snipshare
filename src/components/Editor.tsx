import { EditorContent } from '@tiptap/react'

import { useEditor } from '@/contexts/EditorContext'

export function Editor() {
  const { editor } = useEditor()

  return <EditorContent editor={editor} />
}
