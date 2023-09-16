import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { Lightning, Spinner, Robot } from 'phosphor-react'
import { NodeViewWrapper } from '@tiptap/react'
import '@uiw/react-textarea-code-editor/dist.css'

import {
  getWebContainerInstance,
  installDependencies,
  printNodeJSVersion,
  runCode,
} from '@/helpers/web-container'
import { extractDependencies } from '@/helpers/extract-dependencies'
import { useEditor } from '@/contexts/EditorContext'
import { getAIExplanation } from '@/services/api'
import { Transition } from '@headlessui/react'

const CodeEditor = dynamic(
  () => import('@uiw/react-textarea-code-editor').then((mod) => mod.default),
  { ssr: false },
)

export function WebContainerEditor() {
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [aiExplanation, setAIExplanation] = useState<string>()
  const [askingAI, setAskingAI] = useState(false)
  const { codeSnippet, setCodeSnippet } = useEditor()
  const router = useRouter()

  const id = router.query.id as string
  const isSavedNotePage = typeof id === 'string'

  useEffect(() => {
    return () => {
      setOutput([])
      setAIExplanation(undefined)
    }
  }, [router.asPath])

  async function handleEvaluateCode() {
    setIsRunning(true)
    setOutput([])

    const webContainer = await getWebContainerInstance()
    const dependenciesToInstall = await extractDependencies(codeSnippet)

    await webContainer.mount({
      'index.ts': {
        file: {
          contents: codeSnippet,
        },
      },
      'tsconfig.json': {
        file: {
          contents: `
          {
            "compilerOptions": {
              "target": "es2017",
              "module": "commonjs",
              "lib": ["es2017", "dom"],
              "esModuleInterop": true,
              "moduleResolution": "node",
              "resolveJsonModule": true,
              "skipLibCheck": true,
              "strict": false,
              "noImplicitAny": false,
              "noImplicitThis": false,
              "alwaysStrict": false,
              "strictNullChecks": false,
              "strictFunctionTypes": false,
              "strictPropertyInitialization": false,
              "strictBindCallApply": false,
              "forceConsistentCasingInFileNames": true,
              "sourceMap": true,
              "outDir": "./dist"
            },
            "include": ["index.ts"],
            "exclude": ["node_modules"]
          }`.trim(),
        },
      },
      'package.json': {
        file: {
          contents: `
            {
              "name": "example-app",
              "devDependencies": {
                "typescript": "latest"
              },
              "dependencies": {
                ${dependenciesToInstall
                  .map((dep) => `"${dep}": "latest"`)
                  .join(',')}
              },
              "scripts": {
                "build": "tsc",
                "start": "node dist/index.js"
              }
            }
          `.trim(),
        },
      },
    })

    await printNodeJSVersion(setOutput)
    await installDependencies(setOutput, dependenciesToInstall)
    await runCode(setOutput)

    setIsRunning(false)
  }

  async function handleAskAI() {
    if (!id) return null

    setAskingAI(true)

    const { answer } = await getAIExplanation({
      id,
      codeSnippet,
    })

    setAIExplanation(answer)
    setAskingAI(false)
  }

  function handleStopEvaluation() {
    setIsRunning(false)
  }

  const DisabledAskAIButton = () => (
    <button
      type="button"
      contentEditable={false}
      disabled
      className="text-xs bg-gray-300 rounded px-3 py-2 flex items-center gap-1 text-omni-dark font-semibold ml-auto top-12 right-4 relative z-10 opacity-25 hover:cursor-not-allowed"
    >
      <Robot weight="bold" color="#181621" size={14} />
      Save this note to ask AI
    </button>
  )

  const AskAIButton = () => {
    return askingAI ? (
      <button
        type="button"
        disabled
        contentEditable={false}
        className="text-xs bg-omni-dark rounded px-3 py-2 flex items-center gap-1 text-white font-semibol ml-auto top-12 right-4 relative z-10 opacity-50 hover:opacity-100 hover:cursor-progress"
      >
        <Spinner
          weight="bold"
          color="#FFF"
          size={14}
          className="animate-spin"
        />
        Asking AI...
      </button>
    ) : (
      <button
        type="button"
        onClick={handleAskAI}
        contentEditable={false}
        className="text-xs bg-emerald-500 rounded px-3 py-2 flex items-center gap-1 text-white font-semibold hover:bg-emerald-600 ml-auto top-12 right-4 relative z-10 opacity-50 hover:opacity-100"
      >
        <Robot weight="bold" color="#FFF" size={14} />
        Ask AI
      </button>
    )
  }

  return (
    <>
      <NodeViewWrapper className="not-prose">
        <Transition.Root
          show={!!aiExplanation}
          as={Fragment}
          afterLeave={() => setAIExplanation(undefined)}
          appear
        >
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <div className="bg-omni-light p-5 rounded mb-2 text-sm relative ring-1 ring-emerald-500">
              <p
                className="font-monospace text-xs leading-loose"
                contentEditable={false}
              >
                <span className="text-emerald-500 font-semibold">AI:</span>{' '}
                {aiExplanation}
              </p>
            </div>
          </Transition.Child>
        </Transition.Root>

        {isSavedNotePage ? <AskAIButton /> : <DisabledAskAIButton />}

        <CodeEditor
          value={codeSnippet}
          language="ts"
          placeholder="Please enter TS or JS code."
          onChange={(event) => setCodeSnippet(event.target.value)}
          minHeight={80}
          padding={20}
          spellCheck={false}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            borderRadius: '0.25rem',
            backgroundColor: '#21202e',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
          }}
          data-color-mode="dark"
        />
        <div
          className="bg-black p-5 min-h-[64px] rounded mt-2 text-sm relative"
          contentEditable={false}
          spellCheck={false}
        >
          {output.length > 0 ? (
            <div className="font-monospace text-xs leading-loose">
              {output.map((line, index) => {
                return (
                  <p
                    key={`${line}-${index}`}
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                )
              })}
            </div>
          ) : (
            <span className="text-zinc-400">
              Click on run to evaluate the code.
            </span>
          )}

          <div className="absolute right-4 top-4">
            {isRunning ? (
              <button
                type="button"
                onClick={handleStopEvaluation}
                contentEditable={false}
                className="text-xs bg-zinc-500 rounded px-3 py-2 flex items-center gap-1 text-white font-semibold hover:bg-zinc-600"
              >
                <Spinner
                  weight="bold"
                  color="#FFF"
                  size={14}
                  className="animate-spin"
                />
                Stop running
              </button>
            ) : (
              <button
                type="button"
                onClick={handleEvaluateCode}
                contentEditable={false}
                className="text-xs bg-emerald-500 rounded px-3 py-2 flex items-center gap-1 text-white font-semibold hover:bg-emerald-600"
              >
                <Lightning weight="bold" color="#FFF" size={14} />
                Run code
              </button>
            )}
          </div>
        </div>
      </NodeViewWrapper>
    </>
  )
}
