import { Editor } from '@/components/Editor'
import { Menu } from '@/components/Menu'

export default function Home() {
  return (
    <>
      <Menu />
      <div className="h-screen bg-omni-dark flex max-w-3xl mx-auto">
        <main className="flex-1">
          <div className="px-10 py-16">
            <Editor />
          </div>
        </main>
      </div>
    </>
  )
}
