import { Slash } from 'lucide-react'
import Image from 'next/image'

import snipshareIcon from '@/assets/logo.webp'

import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          priority
          src={snipshareIcon}
          className="aspect-auto w-20 dark:invert"
          alt="Snipshare logo"
        />

        <Slash className="size-3 -rotate-[24deg] text-border" />

        <OrganizationSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
