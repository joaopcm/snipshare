import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { RocketLaunch, Plus, GithubLogo } from 'phosphor-react'

import nodepadLogo from '@/images/logo.webp'
import { useEditor } from '@/contexts/EditorContext'
import { save } from '@/services/api'
import { CopyLinkModal } from './CopyLinkModal'
import Link from 'next/link'

export function Menu() {
  const [createdNoteLink, setCreatedNoteLink] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { editor, codeSnippet, resetCodeSnippet } = useEditor()
  const router = useRouter()

  const isEditing = router.pathname === '/[id]'
  const { id } = router.query

  const newNote = () => {
    editor?.commands.setContent('')
    resetCodeSnippet()
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
          contentEditable={false}
          className="text-xs bg-emerald-500 rounded px-3 py-2 flex items-center gap-1 text-white font-semibold hover:bg-emerald-600"
        >
          <Plus weight="bold" color="#FFF" size={14} />
          Create a new note
        </button>
      )
    }

    return (
      <button
        type="button"
        onClick={() => saveNote()}
        contentEditable={false}
        disabled={isLoading}
        className="text-xs bg-emerald-500 rounded px-3 py-2 flex items-center gap-1 text-white font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 disabled:hover:cursor-wait"
      >
        <RocketLaunch weight="bold" color="#FFF" size={14} />
        Save this note
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
                  <>
                    <span className="mr-2 text-gray-400">/</span>
                    <span className="inline-flex items-center rounded-full bg-omni-dark px-2.5 py-0.5 text-xs font-medium text-gray-400">
                      {id}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
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
