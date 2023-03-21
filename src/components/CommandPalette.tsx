import { Fragment, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { MagnifyingGlass, FilePlus, FloppyDisk, Folder } from 'phosphor-react'
import { useRouter } from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'

const projects = [
  {
    id: 1,
    name: "Welcome / What's Nodepad?",
    url: '/64178627ec38e4c7c42c6285',
  },
  {
    id: 2,
    name: 'Welcome / How to use Nodepad?',
    url: '/641785ffec38e4c7c42c6284',
  },
  {
    id: 3,
    name: 'Examples / Consuming Chuck Norris API',
    url: '/64191fb8d30fcb9c63ea8e0c',
  },
  {
    id: 4,
    name: 'Examples / Fibonacci',
    url: '/64192042a8d84c7d5f089e66',
  },
  {
    id: 5,
    name: 'Examples / Bhaskara formula',
    url: '/641920a0a8d84c7d5f089e67',
  },
  {
    id: 6,
    name: 'Examples / Kinematic equation of acceleration',
    url: '/6417b06e9aa670470911a0a5',
  },
  {
    id: 7,
    name: "Examples / Newton's law of universal gravitation",
    url: '/6417b1389aa670470911a0a6',
  },
  {
    id: 8,
    name: 'Examples / Lorentz force equation',
    url: '/6417b1b79aa670470911a0a7',
  },
  {
    id: 9,
    name: "Examples / Dijkstra's algorithm",
    url: '/6417bbdbe70df47ed9cc7b4d',
  },
]
const recommended = projects.splice(0, 3)
const quickActions = [
  {
    name: 'Create new note...',
    icon: FilePlus,
    shortcut: 'N',
    url: '/',
  },
  { name: 'Save this note...', icon: FloppyDisk, shortcut: 'S', url: '/' },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CommandPalette() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useHotkeys('meta+k,ctrl+k', () => setOpen(true))

  const filteredProjects =
    query === ''
      ? []
      : projects.filter((project) => {
          return project.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => setQuery('')}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-omni-dark bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-10 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-omni-light shadow-2xl transition-all">
              <Combobox
                onChange={(item: { url: string }) => {
                  router.push({
                    pathname: item.url,
                  })
                  setOpen(false)
                }}
              >
                <div className="relative">
                  <MagnifyingGlass
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white focus:ring-0 sm:text-sm"
                    placeholder='Search... (you can also search for all the available examples with "examples")'
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {(query === '' || filteredProjects.length > 0) && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
                  >
                    <li className="p-2">
                      {query === '' && (
                        <h2 className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">
                          Recommended
                        </h2>
                      )}
                      <ul className="text-sm text-gray-400">
                        {(query === '' ? recommended : filteredProjects).map(
                          (project) => (
                            <Combobox.Option
                              key={project.id}
                              value={project}
                              className={({ active }) =>
                                classNames(
                                  'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                  active && 'bg-emerald-500 bg-opacity-25',
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <Folder
                                    className={classNames(
                                      'h-6 w-6 flex-none',
                                      active ? 'text-white' : 'text-gray-500',
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="ml-3 flex-auto truncate">
                                    {project.name}
                                  </span>
                                  {active && (
                                    <span className="ml-3 flex-none text-gray-400">
                                      Bungee jump to...
                                    </span>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          ),
                        )}
                      </ul>
                    </li>
                    {query === '' && (
                      <li className="p-2">
                        <h2 className="sr-only">Quick actions</h2>
                        <ul className="text-sm text-gray-400">
                          {quickActions.map((action) => (
                            <Combobox.Option
                              key={action.shortcut}
                              value={action}
                              className={({ active }) =>
                                classNames(
                                  'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                  active && 'bg-emerald-500 bg-opacity-25',
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <action.icon
                                    className={classNames(
                                      'h-6 w-6 flex-none',
                                      active ? 'text-white' : 'text-gray-500',
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="ml-3 flex-auto truncate">
                                    {action.name}
                                  </span>
                                  <span className="ml-3 flex-none text-xs font-semibold text-gray-400">
                                    <kbd className="font-sans">⌘ + </kbd>
                                    <kbd className="font-sans">
                                      {action.shortcut}
                                    </kbd>
                                  </span>
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    )}
                  </Combobox.Options>
                )}

                {query !== '' && filteredProjects.length === 0 && (
                  <div className="py-14 px-6 text-center sm:px-14">
                    <Folder
                      className="mx-auto h-6 w-6 text-gray-500"
                      aria-hidden="true"
                    />
                    <p className="mt-4 text-sm text-gray-200">
                      Uh-oh, looks like our search is as empty-handed as a
                      penguin in a desert. Can you give it another try?
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
