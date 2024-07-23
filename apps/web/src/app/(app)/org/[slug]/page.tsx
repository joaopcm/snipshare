import { redirect } from 'next/navigation'

import { getCurrentOrgSlug } from '@/auth/auth'

export default async function OrgHomePage() {
  const currentOrgSlug = getCurrentOrgSlug()

  return redirect(`/org/${currentOrgSlug}/projects`)
}
