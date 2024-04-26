import TextareaCodeEditor, {
  TextareaCodeEditorProps,
} from '@uiw/react-textarea-code-editor'
import { useEffect } from 'react'

import { useCodeEditor } from './contexts/code-editor'

type LimitedTextareaCodeEditorProps = Omit<
  TextareaCodeEditorProps,
  'lang' | 'language' | 'value' | 'onChange' | 'spellCheck' | 'disabled'
>

export interface CodeEditorProps extends LimitedTextareaCodeEditorProps {
  readOnly?: boolean
  initialCode?: string
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  readOnly = false,
  initialCode,
  placeholder = 'Write your code here...',
  ...props
}) => {
  const { code, setCode } = useCodeEditor()

  useEffect(() => {
    if (!initialCode) return
    setCode(initialCode)
  }, [])

  return (
    <TextareaCodeEditor
      disabled={readOnly}
      value={code}
      onChange={(event) => setCode(event.target.value)}
      placeholder={placeholder}
      language="ts"
      spellCheck={false}
      {...props}
    />
  )
}
