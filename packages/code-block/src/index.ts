import { CodeEditor } from './code-editor'
import { ControlButton } from './control-button'
import { OutputDisplay } from './output-display'

export * from './contexts/web-container'
export * from './contexts/code-editor'

export type { CodeEditorProps } from './code-editor'
export type { ControlButtonProps } from './control-button'
export type { OutputDisplayProps } from './output-display'

export const CodeBlock = {
  Editor: CodeEditor,
  ControlButton,
  OutputDisplay,
}
