import Image from 'next/image'
import { RocketLaunch } from 'phosphor-react'

import nodepadLogo from '@/images/logo.webp'
import { useEditor } from '@/contexts/EditorContext'

export function Menu() {
  const { editor } = useEditor()

  const saveNote = () => {
    console.log(editor?.getHTML())
  }

  return (
    <nav className="bg-omni-light">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Image
                priority
                className="h-16 w-auto"
                src={nodepadLogo}
                alt="Nodepad"
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={() => saveNote()}
                contentEditable={false}
                className="text-xs bg-emerald-500 rounded px-3 py-2 flex items-center gap-1 text-white font-semibold hover:bg-emerald-600"
              >
                <RocketLaunch weight="bold" color="#FFF" size={14} />
                Save this note
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
