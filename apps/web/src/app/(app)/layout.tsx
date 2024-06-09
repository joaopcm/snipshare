import { redirect } from 'next/navigation'
import type { PropsWithChildren } from 'react'

import { isAuthenticated } from '@/auth/auth'

export default async function AppLayout({
  children,
}: Readonly<PropsWithChildren>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return <>{children}</>
}
