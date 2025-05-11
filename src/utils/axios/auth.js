import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { refreshTokens } from 'src/api/auth'
import { isExpired } from 'src/utils/base'
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../localStorage'
import { toast } from 'react-hot-toast'

export const AuthService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/v1',
  timeout: 5000
})

AuthService.interceptors.request.use(
  async config => {
    // Lấy refresh token từ LS
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      let expRefreshToken = jwt_decode(refreshToken).exp
      if (!isExpired(expRefreshToken)) {
        const accessToken = getAccessToken()
        if (!accessToken) {
          await refreshTokens({
            refreshToken
          }).then(res => {
            setAccessToken(res.access.token)
            setRefreshToken(res.refresh.token)
          })
        } else {
          let dateTimeExpToken = jwt_decode(accessToken).exp
          if (isExpired(dateTimeExpToken)) {
            // Handle refresh tokens
            await refreshTokens({
              refreshToken
            }).then(res => {
              setAccessToken(res.access.token)
              setRefreshToken(res.refresh.token)
            })
          }
        }
        config.headers.Authorization = 'Bearer ' + getAccessToken()
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

AuthService.interceptors.response.use(
  response => {
    return response.data
  },
  async error => {
    toast.error(error.response.data.message || 'Network Error')

    return Promise.reject(error)
  }
)
