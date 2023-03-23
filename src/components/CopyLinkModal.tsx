import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Copy } from 'phosphor-react'

interface CopyLinkModalProps {
  link: string | null
  onClose: () => void
}

export function CopyLinkModal({ link, onClose }: CopyLinkModalProps) {
  const isOpen = link !== null

  const onCloseCallback = () => setTimeout(() => onClose(), 500)

  const copyToClipboard = () => {
    if (!link) return

    navigator.clipboard.writeText(link)

    onCloseCallback()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onCloseCallback}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-omni-dark bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-omni-light px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
                    <Copy
                      weight="bold"
                      size={14}
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-white"
                    >
                      All hail the note-saving master!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-300">
                        Your note is now saved, and you are officially the
                        note-saving master. Copy the URL and bask in your glory!
                      </p>

                      <div className="mt-8 flex rounded-md shadow-sm">
                        <div className="relative flex flex-grow items-stretch focus-within:z-10">
                          <input
                            type="text"
                            name="url"
                            id="url"
                            value={link || undefined}
                            className="block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-300 ring-2 focus:ring-2 ring-inset focus:ring-inset ring-emerald-500 focus:ring-emerald-500 sm:text-sm sm:leading-6 bg-omni-dark"
                            disabled
                          />
                        </div>
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-white bg-emerald-500 ring-1 ring-inset ring-emerald-500 hover:bg-emerald-600 hover:ring-emerald-600"
                        >
                          <Copy
                            weight="bold"
                            size={14}
                            className="-ml-0.5 h-5 w-5 text-white"
                            aria-hidden="true"
                          />
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
