import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import Document from '@tiptap/extension-document'
import Placeholder from '@tiptap/extension-placeholder'

import { EditorBlock } from './plugins/EditorBlock'
import { TrailingNode } from './plugins/TrailingNode'

import { DEFAULT_DESCRIPTION } from '@/config/seo.config'

export function Editor() {
  const editor = useEditor({
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

  editor?.on('update', ({ transaction, editor }) => {
    if (transaction.docChanged) {
      console.log(editor.getHTML())
    }
  })

  // if (editor) {
  //   console.log(editor.getHTML())
  // }

  return <EditorContent editor={editor} />
}
