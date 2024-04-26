import '../globals.css'

import {
  CodeBlock,
  CodeEditorProps,
  useCodeEditor,
} from '@snipshare/code-block'
import { Loader2, RocketIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { buttonVariants } from './ui/button'

interface MyCodeBlockProps extends CodeEditorProps {
  styled?: boolean
}

export const MyCodeBlock: React.FC<MyCodeBlockProps> = ({
  styled = false,
  readOnly,
  initialCode,
}) => {
  const { isRunning, output, code } = useCodeEditor()
  const editorColumnRef = useRef<HTMLDivElement>(null)
  const [terminalHeight, setTerminalHeight] = useState<string>('auto')

  useEffect(() => {
    if (!editorColumnRef.current) return
    setTerminalHeight(`${editorColumnRef.current.clientHeight}px`)
  }, [editorColumnRef, code])

  if (!styled) {
    return (
      <div>
        <CodeBlock.Editor readOnly={readOnly} initialCode={initialCode} />
        <CodeBlock.ControlButton>
          {isRunning ? 'Stop running' : 'Run code'}
        </CodeBlock.ControlButton>
        <CodeBlock.OutputDisplay />
      </div>
    )
  }

  return (
    <div className="flex min-h-[600px] flex-1 gap-4">
      <div className="flex flex-1 flex-col gap-4" ref={editorColumnRef}>
        <div className="flex flex-1 overflow-y-scroll rounded-3xl border border-zinc-700 bg-primary p-8 shadow-inner">
          <CodeBlock.Editor
            className="flex-1 bg-primary text-base font-medium tracking-wide text-zinc-100"
            readOnly={readOnly}
            initialCode={initialCode}
          />
        </div>

        <CodeBlock.ControlButton
          className={cn(
            buttonVariants({
              variant: isRunning ? 'destructive' : 'default',
              size: 'lg',
            }),
            'rounded-3xl',
          )}
        >
          {isRunning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RocketIcon className="mr-2 h-4 w-4" />
          )}

          {isRunning ? 'Stop running' : 'Run code'}
        </CodeBlock.ControlButton>
      </div>

      <div
        className="flex w-1/3 flex-col overflow-auto whitespace-pre rounded-3xl bg-black p-4 font-mono text-xs text-zinc-400"
        style={{
          maxHeight: terminalHeight,
          overflow: 'auto',
        }}
      >
        {output.map((line, index) => (
          <span
            key={`${line}-${index}`}
            dangerouslySetInnerHTML={{ __html: line }}
            className="block"
          />
        ))}
      </div>
    </div>
  )
}
