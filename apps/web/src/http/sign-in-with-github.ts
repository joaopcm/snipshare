import { api } from './api-client'

interface SignInWithGitHubRequest {
  code: string
}

interface SignInWithGitHubResponse {
  token: string
}

export async function signInWithGitHub({ code }: SignInWithGitHubRequest) {
  const result = await api
    .post('sessions/github', {
      json: {
        code,
      },
    })
    .json<SignInWithGitHubResponse>()

  return result
}
