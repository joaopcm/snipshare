import CodeEditor from '@uiw/react-textarea-code-editor'

import {
  getWebContainerInstance,
  installDependencies,
  installDevDependencies,
  printNodeJSVersion,
  runCode,
} from './helpers/web-container'
import { extractDependencies } from './helpers/extract-dependencies'
import { useState } from 'react'

export interface CodeBlockProps {
  initialCode?: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ initialCode = '' }) => {
  const [codeSnippet, setCodeSnippet] = useState(initialCode)
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  async function handleEvaluateCode() {
    setIsRunning(true)
    setOutput([])

    const webContainer = await getWebContainerInstance()
    const dependenciesToInstall = await extractDependencies(codeSnippet)

    await webContainer.mount({
      'index.ts': {
        file: { contents: codeSnippet },
      },
      'tsconfig.json': {
        file: {
          contents: JSON.stringify(
            {
              compilerOptions: {
                target: 'es2017',
                module: 'commonjs',
                lib: ['es2017'],
                esModuleInterop: true,
                moduleResolution: 'node',
              },
              include: ['index.ts'],
            },
            null,
            2
          ),
        },
      },
      'package.json': {
        file: {
          contents: JSON.stringify(
            {
              name: 'example-app',
              scripts: {
                build: 'tsc index.ts',
                start: 'node index.js',
              },
              devDependencies: { typescript: '5.2.2' },
              dependencies: dependenciesToInstall.reduce(
                (acc, dep) => ({ ...acc, [dep]: 'latest' }),
                {}
              ),
            },
            null,
            2
          ),
        },
      },
    })

    await printNodeJSVersion(setOutput)
    await installDevDependencies(setOutput)
    await installDependencies(setOutput, dependenciesToInstall)
    await runCode(setOutput)
    setIsRunning(false)
  }

  return (
    <>
      <CodeEditor
        value={codeSnippet}
        language="ts"
        onChange={(event) => setCodeSnippet(event.target.value)}
        minHeight={80}
        padding={20}
        spellCheck={false}
      />

      <button onClick={handleEvaluateCode} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Code'}
      </button>

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
    </>
  )
}
