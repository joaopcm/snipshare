import { Node, textblockTypeInputRule } from '@tiptap/core'
import { mergeAttributes, ReactNodeViewRenderer } from '@tiptap/react'

import { WebContainerEditor } from './WebContainerEditor'

export const EditorBlock = Node.create({
  name: 'editorBlock',
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  isolating: true,

  addOptions() {
    return {
      languageClassPrefix: 'language-',
      exitOnTripleEnter: true,
      exitOnArrowDown: true,
      HTMLAttributes: {},
    }
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: /^```([a-z]+)?[\s\n]$/,
        type: this.type,
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(WebContainerEditor)
  },

  parseHTML() {
    return [{ tag: 'editor-block' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['editor-block', mergeAttributes(HTMLAttributes)]
  },
})
