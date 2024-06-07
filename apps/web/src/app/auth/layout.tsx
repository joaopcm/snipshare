import type { PropsWithChildren } from 'react'

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xs">{children}</div>
    </div>
  )
}
