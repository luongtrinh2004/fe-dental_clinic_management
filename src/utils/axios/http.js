import axios from 'axios'
import { toast } from 'react-hot-toast'

export const HttpService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/v1',
  timeout: 5000
})

HttpService.interceptors.request.use(
  async config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

HttpService.interceptors.response.use(
  response => {
    return response.data
  },
  async error => {
    toast.error(error.response.data.message || 'Network Error')

    return Promise.reject(error)
  }
)
