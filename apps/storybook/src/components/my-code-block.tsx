import '../globals.css'

import { CodeBlock, useCodeEditor } from '@snipshare/code-block'
import { Loader2, RocketIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { buttonVariants } from './ui/button'

interface MyCodeBlockProps {
  styled?: boolean
}

export const MyCodeBlock: React.FC<MyCodeBlockProps> = ({ styled = false }) => {
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
        <CodeBlock.Editor />
        <CodeBlock.ControlButton>
          {isRunning ? 'Stop running' : 'Run code'}
        </CodeBlock.ControlButton>
        <CodeBlock.OutputDisplay />
      </div>
    )
  }

  return (
    <div className="flex h-full max-h-[600px] flex-1 gap-4">
      <div className="flex flex-1 flex-col gap-4" ref={editorColumnRef}>
        <CodeBlock.Editor
          padding={styled ? 32 : undefined}
          style={{
            overflowY: 'scroll',
          }}
          className="min-w-96 flex-1 overflow-y-scroll whitespace-pre rounded-3xl border border-zinc-700 bg-primary text-base font-medium tracking-wide text-zinc-100 shadow-inner"
        />
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
        className="flex w-96 flex-col overflow-auto whitespace-pre rounded-3xl bg-black p-4 text-sm text-zinc-400"
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
        <div className="flex flex-col bg-white text-sm text-zinc-400"></div>
      </div>
    </div>
  )
}
