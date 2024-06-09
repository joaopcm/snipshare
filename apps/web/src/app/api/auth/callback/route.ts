import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

import { signInWithGitHub } from '@/http/sign-in-with-github'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  if (!code) {
    return NextResponse.json(
      {
        message: 'GitHub OAuth code was not round.',
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

  const redirectURL = request.nextUrl.clone()
  redirectURL.pathname = '/'
  redirectURL.search = ''
  return NextResponse.redirect(redirectURL)
}
