import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { signInWithGitHub } from '@/http/sign-in-with-github'
import { acceptInviteIfAny } from '@/lib/accept-invite-if-any'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  if (!code) {
    return NextResponse.json(
      {
        message: 'GitHub OAuth code was not found.',
      },
      {
        status: 400,
      },
    )
  }

  const { token } = await signInWithGitHub({ code })
  cookies().set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week in seconds
  })

  await acceptInviteIfAny()

  const redirectURL = request.nextUrl.clone()
  redirectURL.pathname = '/'
  redirectURL.search = ''
  return NextResponse.redirect(redirectURL)
}
