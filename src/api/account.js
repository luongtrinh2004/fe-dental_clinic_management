import { AuthService } from 'src/utils/axios/auth'

export function getInfoAccount() {
  return AuthService({
    url: '/my-account',
    method: 'get'
  })
}
