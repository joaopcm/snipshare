import { Editor } from '@/components/Editor'

export default function Home() {
  return (
    <div className="h-screen bg-omni-dark flex">
      <main className="flex-1 px-10 py-16 max-w-3xl mx-auto">
        <Editor />
      </main>
    </div>
  )
}
