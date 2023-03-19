import React, { createContext, useContext } from 'react'
import { useEditor as useEditorHook, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Placeholder from '@tiptap/extension-placeholder'

import { EditorBlock } from '@/components/EditorBlock'
import { TrailingNode } from '@/components/TrailingNode'
import { DEFAULT_DESCRIPTION } from '@/config/seo.config'

interface EditorContextValue {
  editor: Editor | null
}

const EditorContext = createContext<EditorContextValue>(
  {} as EditorContextValue,
)

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const editor = useEditorHook({
    editorProps: {
      attributes: {
        class: 'prose prose-invert focus:outline-none',
      },
    },
    extensions: [
      Document.extend({
        content: 'heading block*',
      }),
      StarterKit.configure({
        codeBlock: false,
        document: false,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Untitled'
          }
          if (node.type.name === 'editorBlock') {
            return ''
          }
          return DEFAULT_DESCRIPTION
        },
      }),
      EditorBlock,
      TrailingNode,
    ],
    content: ``,
  })

  // if (editor) {
  //   editor.on('update', ({ transaction, editor }) => {
  //     if (transaction.docChanged) {
  //       console.log(editor.getHTML())
  //     }
  //   })
  // }

  return (
    <EditorContext.Provider value={{ editor }}>
      {children}
    </EditorContext.Provider>
  )
}

export function useEditor() {
  const { editor } = useContext(EditorContext)

  return editor
}
