import axios, { AxiosError, type AxiosInstance } from 'axios'

const API_URL = import.meta.env.VITE_API_RECRUIT_URL

const PaaSsibleRecruit: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
})
console.log(PaaSsibleRecruit.defaults)
PaaSsibleRecruit.interceptors.request.use(
  (config) => {
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

PaaSsibleRecruit.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        // refresh 요청 (서버가 refreshToken 쿠키 확인 후 accessToken 재발급)
        await axios.post(`${API_URL}/auth/reissue`, {}, { withCredentials: true })

        // 원래 요청 다시 시도
        if (error.config) {
          return PaaSsibleRecruit(error.config)
        }
      } catch (refreshError) {
        // refresh도 실패 → 로그아웃 처리
        console.error('Token refresh failed', refreshError)
        await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true })
        // 로그인 페이지 이동
      }
    }
    return Promise.reject(error)
  },
)

export default PaaSsibleRecruit
