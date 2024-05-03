import ANSIToHTML from 'ansi-to-html'
import React, {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react'

import { buildPackageFile } from '../helpers/build-package-file'
import { buildTSConfigFile } from '../helpers/build-tsconfig-file'
import { extractDependencies } from '../helpers/extract-dependencies'
import { useWebContainer } from './web-container'

export interface CodeEditorContextType {
  code: string
  setCode: (code: string) => void

  output: string[]
  setOutput: React.Dispatch<React.SetStateAction<string[]>>

  isRunning: boolean
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>

  evaluateCode: () => Promise<void>
}

export const CodeEditorContext = createContext<
  CodeEditorContextType | undefined
>(undefined)

export interface CodeEditorProviderProps extends PropsWithChildren {}

export const CodeEditorProvider: React.FC<CodeEditorProviderProps> = ({
  children,
}) => {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const { getWebContainerInstance } = useWebContainer()

  const printNodeJSVersion = useCallback(async () => {
    const webContainer = await getWebContainerInstance()
    const nodeVersionProcess = await webContainer.spawn('node', ['-v'])
    await nodeVersionProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          setOutput((state) => [...state, `📦 Using Node.js ${data}`])
        },
      }),
    )
    await nodeVersionProcess.exit
  }, [getWebContainerInstance])

  const installDevDependencies = useCallback(async () => {
    const webContainer = await getWebContainerInstance()
    setOutput((state) => [
      ...state,
      '📥 Installing required, internal dependencies...',
    ])
    const installProcess = await webContainer.spawn('pnpm', ['i', '--only=dev'])
    await installProcess.exit
  }, [getWebContainerInstance])

  const installDependencies = useCallback(async () => {
    const webContainer = await getWebContainerInstance()
    const dependenciesToInstall = await extractDependencies(code)
    if (!dependenciesToInstall.length) return

    setOutput((state) => [
      ...state,
      `📦 Found ${dependenciesToInstall.length} dependencies to install...`,
    ])
    setOutput((state) => [...state, '📥 Installing found dependencies...'])

    const ANSIConverter = new ANSIToHTML()
    const installProcess = await webContainer.spawn('pnpm', ['i'])
    await installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          setOutput((state) => [...state, ANSIConverter.toHtml(data)])
        },
      }),
    )
    await installProcess.exit
  }, [code, getWebContainerInstance])

  const executeCode = useCallback(async () => {
    const webContainer = await getWebContainerInstance()
    setOutput((state) => [...state, '🚀 Building the application...'])
    const buildProcess = await webContainer.spawn('pnpm', ['build'])
    await buildProcess.exit

    setOutput((state) => [...state, '💻 Running the application...'])
    const startProcess = await webContainer.spawn('pnpm', ['start'])
    const ANSIConverter = new ANSIToHTML()
    await startProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          setOutput((state) => [...state, ANSIConverter.toHtml(data)])
        },
      }),
    )

    webContainer.on('server-ready', (_, url) => {
      // TODO: The URL should be set in an iframe element in the same browser tab
      // https://webcontainers.io/guides/quickstart#_4-preview
      setOutput((state) => [
        ...state,
        `🌎 We have detected a server running. Please use this URL to access it: ${url}`,
      ])
    })

    await startProcess.exit
  }, [getWebContainerInstance])

  const evaluateCode = useCallback(async () => {
    setIsRunning(true)
    setOutput([])

    setOutput((state) => [...state, '🔧 Preparing environment...'])
    const webContainer = await getWebContainerInstance()
    await webContainer.mount({
      'index.ts': {
        file: { contents: code },
      },
      'tsconfig.json': buildTSConfigFile(),
      'package.json': await buildPackageFile(code),
    })

    await Promise.all([
      installDevDependencies(),
      installDependencies(),
      printNodeJSVersion(),
    ])
    await executeCode()
    setIsRunning(false)
  }, [
    code,
    getWebContainerInstance,
    installDevDependencies,
    installDependencies,
    printNodeJSVersion,
    executeCode,
  ])

  return (
    <CodeEditorContext.Provider
      value={{
        code,
        setCode,
        output,
        setOutput,
        evaluateCode,
        isRunning,
        setIsRunning,
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  )
}

export const useCodeEditor = () => {
  const context = useContext(CodeEditorContext)
  if (!context)
    throw new Error(
      'useCodeEditor hook must be used within a CodeEditorProvider',
    )
  return context
}
