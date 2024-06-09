import { auth } from '@/auth/auth'

export default async function HomePage() {
  const { user } = await auth()

  return <pre>{JSON.stringify(user, null, 2)}</pre>
}
