import { ability, getCurrentOrgSlug } from '@/auth/auth'

import { NavLink } from './nav-link'
import { Button } from './ui/button'

export async function Tabs() {
  const currentOrgSlug = getCurrentOrgSlug()
  const permissions = await ability()

  const canUpdateOrganization = permissions?.can('update', 'Organization')
  const canGetBillingDetails = permissions?.can('get', 'Billing')
  const canGetMemberships = permissions?.can('get', 'User')
  const canGetProjects = permissions?.can('get', 'Project')

  const LINKS = [
    {
      name: 'Projects',
      href: `/org/${currentOrgSlug}/projects`,
      enabled: canGetProjects,
    },
    {
      name: 'Members',
      href: `/org/${currentOrgSlug}/members`,
      enabled: canGetMemberships,
    },
    {
      name: 'Settings & Billing',
      href: `/org/${currentOrgSlug}/settings`,
      enabled: canUpdateOrganization || canGetBillingDetails,
    },
  ]

  if (!currentOrgSlug) {
    return null
  }

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        {LINKS.map((item) => {
          if (!item.enabled) {
            return null
          }

          return (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
            >
              <NavLink href={item.href}>{item.name}</NavLink>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
