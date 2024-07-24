import { api } from './api-client'

export async function requestPasswordRecover(email: string) {
  await api.post('password/recover', {
    json: {
      email,
    },
  })
}
