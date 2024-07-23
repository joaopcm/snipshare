import { getCurrentOrgSlug } from '@/auth/auth'

import { NavLink } from './nav-link'
import { Button } from './ui/button'

const LINKS = [
  {
    name: 'Projects',
    href: (slug: string) => `/org/${slug}/projects`,
  },
  {
    name: 'Members',
    href: (slug: string) => `/org/${slug}/members`,
  },
  {
    name: 'Settings & Billing',
    href: (slug: string) => `/org/${slug}/settings`,
  },
]

export function Tabs() {
  const currentOrgSlug = getCurrentOrgSlug()

  if (!currentOrgSlug) {
    return null
  }

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        {LINKS.map((item) => (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
          >
            <NavLink href={item.href(currentOrgSlug!)}>{item.name}</NavLink>
          </Button>
        ))}
      </nav>
    </div>
  )
}
