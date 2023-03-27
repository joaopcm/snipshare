import { WebContainerEditor } from '@/components/WebContainerEditor'
import { useEffect } from 'react'

export default function Embed() {
  useEffect(() => {
    const body = document.getElementsByTagName('body')[0]

    body.classList.remove('bg-omni-dark')
    body.classList.remove('text-slate-200')
  }, [])

  return <WebContainerEditor />
}
