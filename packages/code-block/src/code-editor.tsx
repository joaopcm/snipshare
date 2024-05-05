import MonacoEditor, {
  EditorProps as MonacoEditorProps,
  useMonaco,
} from '@monaco-editor/react'
import React, { useEffect } from 'react'

import { useCodeEditor } from './contexts/code-editor'
import { deepMerge } from './helpers/deep-merge'

export interface CodeEditorProps
  extends Omit<MonacoEditorProps, 'language' | 'defaultLanguage' | 'theme'> {
  initialCode?: string
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  theme?: Record<string, any>
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  theme,
  ...props
}) => {
  const { code, setCode } = useCodeEditor()
  const monacoInstance = useMonaco()
  const { options: optionsFromProps, ...rest } = props

  useEffect(() => {
    if (!initialCode) return
    setCode(initialCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!monacoInstance || !theme) return
    // @ts-expect-error @monaco-editor/react doesn't export the IStandaloneThemeData type
    monacoInstance.editor.defineTheme('custom-theme', theme)
    monacoInstance.editor.setTheme('custom-theme')
  }, [monacoInstance, theme])

  const defaultOptions: MonacoEditorProps['options'] = {
    minimap: {
      enabled: false,
    },
    inlineSuggest: {
      enabled: true,
    },
    formatOnType: true,
    autoClosingBrackets: 'always',
    fixedOverflowWidgets: true,
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
  }

  return (
    <MonacoEditor
      language="typescript"
      value={code}
      onChange={(value) => setCode(value ?? '')}
      options={deepMerge(defaultOptions, optionsFromProps ?? {})}
      theme="custom-theme"
      {...rest}
    />
  )
}
