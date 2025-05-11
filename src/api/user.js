import { AuthService } from 'src/utils/axios/auth'

export function getUsers(params) {
  return AuthService({
    url: '/users',
    method: 'get',
    params
  })
}

export function createUser(data) {
  return AuthService({
    url: '/users',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return AuthService({
    url: `/users/${id}`,
    method: 'patch',
    data
  })
}
