import { api } from './api-client'

interface ResetPasswordRequest {
  code: string
  password: string
}

export async function resetPassword({ code, password }: ResetPasswordRequest) {
  await api.post('password/reset', {
    json: {
      code,
      password,
    },
  })
}
