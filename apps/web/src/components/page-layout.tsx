import type { PropsWithChildren } from 'react'

export function PageLayout({ children }: PropsWithChildren) {
  return <div className="space-y-4">{children}</div>
}
