import TextareaCodeEditor, {
  TextareaCodeEditorProps,
} from '@uiw/react-textarea-code-editor'

import { useCodeEditor } from './contexts/code-editor'

type LimitedTextareaCodeEditorProps = Omit<
  TextareaCodeEditorProps,
  'lang' | 'language' | 'value' | 'onChange' | 'spellCheck'
>

export interface CodeEditorProps extends LimitedTextareaCodeEditorProps {}

export const CodeEditor: React.FC<CodeEditorProps> = ({ ...props }) => {
  const { code, setCode } = useCodeEditor()

  return (
    <TextareaCodeEditor
      value={code}
      onChange={(event) => setCode(event.target.value)}
      language="ts"
      spellCheck={false}
      {...props}
    />
  )
}
