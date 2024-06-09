import Image from 'next/image'

import snipshareIcon from '@/assets/logo.webp'

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
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}
