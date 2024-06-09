import { redirect } from 'next/navigation'
import type { PropsWithChildren } from 'react'

import { isAuthenticated } from '@/auth/auth'
import { Header } from '@/components/header'

export default async function AppLayout({
  children,
}: Readonly<PropsWithChildren>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px]">{children}</main>
    </div>
  )
}
