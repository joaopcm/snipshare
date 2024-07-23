import { redirect } from 'next/navigation'
import type { PropsWithChildren } from 'react'

import { isAuthenticated } from '@/auth/auth'

interface AppLayoutProps extends PropsWithChildren {
  sheet: React.ReactNode
}

export default async function AppLayout({
  children,
  sheet,
}: Readonly<AppLayoutProps>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}
