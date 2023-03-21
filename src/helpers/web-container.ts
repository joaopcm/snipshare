import { WebContainer } from '@webcontainer/api'
import { Dispatch, SetStateAction } from 'react'
import ANSIToHTML from 'ansi-to-html'

let webContainerInstance: WebContainer
const ANSIConverter = new ANSIToHTML()

export async function getWebContainerInstance() {
  if (!webContainerInstance) {
    webContainerInstance = await WebContainer.boot()
  }

  return webContainerInstance
}

export async function printNodeJSVersion(
  setOutput: Dispatch<SetStateAction<string[]>>,
) {
  const container = await getWebContainerInstance()
  const nodeVersionProcess = await container.spawn('node', ['-v'])

  nodeVersionProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        setOutput((state) => [...state, `ℹ️ Using Node.js ${data}`])
      },
    }),
  )
}

export async function installDependencies(
  setOutput: Dispatch<SetStateAction<string[]>>,
  dependenciesToInstall: string[],
) {
  const container = await getWebContainerInstance()

  if (dependenciesToInstall.length > 0) {
    setOutput([
      `📦 Found ${dependenciesToInstall.length} dependencies to install...`,
    ])

    setOutput((state) => [...state, '🚧 Installing dependencies...'])

    const installProcess = await container.spawn('pnpm', ['i'])

    installProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          setOutput((state) => [...state, ANSIConverter.toHtml(data)])
        },
      }),
    )

    await installProcess.exit

    setOutput((state) => [...state, '---------'])
  }
}

export async function runCode(setOutput: Dispatch<SetStateAction<string[]>>) {
  const container = await getWebContainerInstance()

  setOutput((state) => [...state, '🚀 Running the application...'])

  const startProcess = await container.spawn('pnpm', ['start'])

  startProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        setOutput((state) => [...state, ANSIConverter.toHtml(data)])
      },
    }),
  )

  container.on('server-ready', (port, url) => {
    setOutput((state) => [...state, `🌎 Server is running on ${url}`])
  })

  return startProcess.exit
}
