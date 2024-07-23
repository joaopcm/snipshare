import { PropsWithChildren } from 'react'

import { Header } from './header'

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <div className="space-y-4 py-4">
      <Header />

      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        {children}
      </main>
    </div>
  )
}
