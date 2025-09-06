import axios, { type AxiosInstance } from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const PaaSsible: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
})

PaaSsible.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

PaaSsible.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      //JWT refresh 로직
      // const refreshToken = localStorage.getItem('refreshToken')
    }
    return Promise.reject(error)
  },
)

export default PaaSsible
