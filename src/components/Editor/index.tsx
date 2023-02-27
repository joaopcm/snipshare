import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import Document from '@tiptap/extension-document'
import Placeholder from '@tiptap/extension-placeholder'

import { EditorBlock } from './plugins/EditorBlock'
import { TrailingNode } from './plugins/TrailingNode'

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

          return 'Build your notes using Markdown... Plus, have all the code blocks interactively run in the browser 🚀'
        },
      }),
      EditorBlock,
      TrailingNode,
    ],
    content: ``,
  })

  return <EditorContent editor={editor} />
}
