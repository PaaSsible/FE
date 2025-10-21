import axios, { AxiosError, AxiosHeaders, type AxiosInstance } from 'axios'

import { postReissueSchema } from '@/types/apis/user/user.api.schemas'
import type { PostReissue } from '@/types/apis/user/user.api.types'
import { clearAuthSession, getAccessToken, setAuthSession } from '@/utils/authToken'

const API_URL = import.meta.env.VITE_API_RECRUIT_URL
const USER_API_URL = import.meta.env.VITE_API_USER_URL

const PaaSsibleRecruit: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
})
PaaSsibleRecruit.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken()
    if (accessToken) {
      const headers =
        config.headers instanceof AxiosHeaders
          ? config.headers
          : new AxiosHeaders(config.headers ?? {})
      headers.set('Authorization', `Bearer ${accessToken}`)
      config.headers = headers
    }
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
        const { data } = await axios.post<PostReissue['Response']>(
          `${USER_API_URL}/users/auth/reissue`,
          {},
          { withCredentials: true },
        )
        const parsed = postReissueSchema.response.parse(data)

        if (!parsed.success) {
          throw new Error(parsed.message ?? 'Token reissue failed')
        }

        setAuthSession(parsed.data)

        // 원래 요청 다시 시도
        if (error.config) {
          const headers =
            error.config.headers instanceof AxiosHeaders
              ? error.config.headers
              : new AxiosHeaders(error.config.headers ?? {})
          headers.set('Authorization', `Bearer ${parsed.data.accessToken}`)
          error.config.headers = headers
          return PaaSsibleRecruit(error.config)
        }
      } catch (refreshError) {
        // refresh도 실패 → 로그아웃 처리
        console.error('Token refresh failed', refreshError)
        clearAuthSession()
        await axios
          .post(`${USER_API_URL}/users/auth/logout`, {}, { withCredentials: true })
          .catch(() => {})
        if (typeof window !== 'undefined') {
          window.location.replace('/start')
        }
        // 로그인 페이지 이동
      }
    }
    return Promise.reject(error)
  },
)

export default PaaSsibleRecruit
