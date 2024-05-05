import '../globals.css'

import {
  CodeBlock,
  CodeEditorProps,
  useCodeEditor,
} from '@snipshare/code-block'
import { Loader2, RocketIcon } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import { buttonVariants } from './ui/button'

export const editorTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#18181B',
  },
}

interface MyCodeBlockProps extends CodeEditorProps {
  styled?: boolean
}

export const MyCodeBlock: React.FC<MyCodeBlockProps> = ({
  styled = false,
  initialCode,
}) => {
  const { isRunning, output } = useCodeEditor()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [output])

  if (!styled) {
    return (
      <div>
        <CodeBlock.Editor initialCode={initialCode} height={300} width={600} />
        <CodeBlock.ControlButton>
          {isRunning ? 'Stop running' : 'Run code'}
        </CodeBlock.ControlButton>
        <CodeBlock.OutputDisplay />
      </div>
    )
  }

  return (
    <div className="flex h-[700px] max-w-screen-xl flex-1 gap-4">
      <div className="w-2/3 flex-1 rounded-3xl border border-zinc-700 bg-primary px-4 shadow-inner">
        <CodeBlock.Editor
          initialCode={initialCode}
          options={{
            cursorSmoothCaretAnimation: 'on',
            lineDecorationsWidth: 0,
            lineNumbers: 'off',
            fontSize: 16,
            padding: {
              top: 32,
              bottom: 32,
            },
            scrollbar: {
              vertical: 'hidden',
            },
            cursorBlinking: 'smooth',
            renderLineHighlight: 'none',
          }}
          theme={editorTheme}
        />

        <CodeBlock.ControlButton
          className={cn(
            buttonVariants({
              variant: isRunning ? 'destructive' : 'default',
            }),
            'relative -top-16 right-2 float-end rounded-2xl',
          )}
        >
          {isRunning ? (
            <Loader2 className="mr-3 h-4 w-4 animate-spin" />
          ) : (
            <RocketIcon className="mr-3 h-4 w-4" />
          )}

          {isRunning ? 'Stop running' : 'Run code'}
        </CodeBlock.ControlButton>
      </div>

      <div
        ref={scrollRef}
        className="flex w-1/3 flex-col overflow-auto whitespace-pre rounded-3xl bg-black p-4 font-mono text-xs text-zinc-400"
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
