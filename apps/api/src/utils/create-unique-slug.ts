import { nanoid } from 'nanoid'

import { createSlug } from './create-slug'

export async function createUniqueSlug(
  name: string,
  duplicateChecker: (slug: string) => Promise<boolean>,
  retryCount = 0,
) {
  if (retryCount > 5) {
    throw new Error('Failed to create unique slug.')
  }

  const slug = createSlug(name) + (retryCount > 0 ? `-${nanoid(5)}` : '')
  const existingOrganizationWithSameSlug = await duplicateChecker(slug)
  if (!existingOrganizationWithSameSlug) {
    return slug
  }

  return createUniqueSlug(name, duplicateChecker, retryCount + 1)
}
