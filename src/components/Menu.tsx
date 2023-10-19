import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { GithubLogo } from 'phosphor-react'
import Link from 'next/link'
import { useHotkeys } from 'react-hotkeys-hook'

import nodepadLogo from '@/images/logo.webp'
import { useEditor } from '@/contexts/EditorContext'
import { save } from '@/services/api'
import { useCounter } from '@/contexts/CounterContext'
import { CopyLinkModal } from './CopyLinkModal'
import { hotkeysConfig } from '@/config/hotkeys'
import { usePlatform } from '@/hooks/usePlatform'

export function Menu() {
  const [createdNoteLink, setCreatedNoteLink] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { editor, codeSnippet } = useEditor()
  const { counter } = useCounter()
  const router = useRouter()
  const { isApple } = usePlatform()

  const isEditing = router.pathname === '/[id]'
  const { id } = router.query
  const primaryKeyboardKey = isApple ? '⌘' : 'Ctrl'

  useHotkeys('control+d,meta+d', () => newNote(), hotkeysConfig)
  useHotkeys('control+s,meta+s', () => saveNote(), hotkeysConfig)

  const newNote = () => {
    router.push({ pathname: '/' })
  }

  const saveNote = async () => {
    const html = editor?.getHTML()

    if (!html) return

    setIsLoading(true)

    const response = await save({
      html,
      codeSnippet,
    })

    setCreatedNoteLink(`${process.env.NEXT_PUBLIC_APP_URL}/${response.id}`)

    setIsLoading(false)
  }

  const closeCopyLinkModal = () => {
    if (!createdNoteLink) return

    router.push({
      pathname: createdNoteLink,
    })

    setCreatedNoteLink(null)
  }

  const Button = () => {
    if (isEditing) {
      return (
        <button
          type="button"
          onClick={() => newNote()}
          className="text-xs bg-emerald-500 rounded px-2 py-2.5 md:py-1.5 flex items-center gap-1 text-white font-semibold hover:bg-emerald-600"
        >
          Create a new note
          <span className="ml-1 flex-none font-semibold text-white bg-emerald-600 px-2 py-1 rounded-md hidden md:flex">
            <kbd className="font-sans">{primaryKeyboardKey} + D</kbd>
          </span>
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={() => saveNote()}
        disabled={isLoading}
        className="text-xs bg-emerald-500 rounded px-2 py-2.5 md:py-1.5 flex items-center gap-1 text-white font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 disabled:hover:cursor-wait"
      >
        Save this note
        <span className="ml-1 flex-none text-xs font-semibold text-white bg-emerald-600 px-2 py-1 rounded-md hidden md:flex">
          <kbd className="font-sans">{primaryKeyboardKey} + S</kbd>
        </span>
      </button>
    )
  }

  return (
    <>
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
                {isEditing && (
                  <div className="hidden sm:block">
                    <span className="mr-2 text-gray-400">/</span>
                    <span className="inline-flex items-center rounded-full bg-omni-dark px-2.5 py-0.5 text-xs font-medium text-gray-400">
                      {id}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {counter > 0 && (
                <span className="inline-flex items-center rounded-full bg-omni-dark px-2.5 py-0.5 text-xs font-medium text-gray-400">
                  {counter} {counter === 1 ? 'view' : 'views'}
                </span>
              )}

              <div className="flex-shrink-0">
                <Button />
              </div>

              <Link href="https://github.com/joaopcm/nodepad" target="_blank">
                <button
                  type="button"
                  className="rounded-full bg-omni-dark p-3 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  <GithubLogo className="h-6 w-6" aria-hidden="true" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <CopyLinkModal link={createdNoteLink} onClose={closeCopyLinkModal} />
    </>
  )
}
