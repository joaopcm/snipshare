import { NodeViewWrapper } from '@tiptap/react'
import { Lightning, Spinner } from 'phosphor-react'
import ANSIToHTML from 'ansi-to-html'
// import CodeEditor from '@uiw/react-textarea-code-editor'
import { getWebContainerInstance } from '@/helpers//web-container'
import { useState } from 'react'
import { extractDependencies } from '@/helpers/extract-dependencies'
import dynamic from 'next/dynamic'

const CodeEditor = dynamic(
  () => import('@uiw/react-textarea-code-editor').then((mod) => mod.default),
  { ssr: false },
)

const initialCode = [
  `import 'isomorphic-fetch';`,
  ``,
  `fetch("https://api.github.com/users/joaopcm")`,
  `  .then((response) => response.json())`,
  `  .then((data) => {`,
  `    console.log(data);`,
  `  });`,
].join('\n')

const ANSIConverter = new ANSIToHTML()

export function WebContainerEditor() {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  async function handleEvaluateCode() {
    setIsRunning(true)

    const webContainer = await getWebContainerInstance()
    const dependenciesToInstall = extractDependencies(code)

    await webContainer.mount({
      'index.js': {
        file: {
          contents: code,
        },
      },
      'package.json': {
        file: {
          contents: `
            {
              "name": "example-app",
              "type": "module",
              "dependencies": {
                ${dependenciesToInstall
                  .map((dep) => `"${dep}": "latest"`)
                  .join(',')}
              },
              "scripts": {
                "start": "node index.js"
              }
            }
          `.trim(),
        },
      },
    })

    setOutput(['🔍 Looking for dependencies to install...'])
    setOutput((state) => [
      ...state,
      `📦 Found ${dependenciesToInstall.length} dependencies to install!`,
    ])

    const install = await webContainer.spawn('pnpm', ['i'])

    setOutput((state) => [
      ...state,
      '---------',
      '🚧 Installing dependencies...',
    ])

    install.output.pipeTo(
      new WritableStream({
        write(data) {
          setOutput((state) => [...state, ANSIConverter.toHtml(data)])
        },
      }),
    )

    await install.exit

    setOutput((state) => [...state, '---------', '🚀 Running the application!'])

    const start = await webContainer.spawn('pnpm', ['start'])

    start.output.pipeTo(
      new WritableStream({
        write(data) {
          setOutput((state) => [...state, ANSIConverter.toHtml(data)])
        },
      }),
    )

    setIsRunning(false)
  }

  function handleStopEvaluation() {
    setIsRunning(false)
  }

  return (
    <NodeViewWrapper className="not-prose">
      <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code only."
        onChange={(event) => setCode(event.target.value)}
        minHeight={80}
        padding={20}
        spellCheck={false}
        className="text-sm bg-[#21202e] font-monospace rounded"
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
  )
}
