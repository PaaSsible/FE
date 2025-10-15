import { http, HttpResponse, type HttpHandler } from 'msw'

import type * as UserTypes from '@/types/apis/user/user.api.types'

import { API_URL } from '.'

export const userHandlers: HttpHandler[] = [
  //로그인(토큰 발급)
  http.post(`${API_URL}/users/auth/token`, async ({ request }) => {
    const body = (await request.clone().json()) as UserTypes.PostLogin['Body']

    const refreshToken = 'refreshTokenExample'

    const data: UserTypes.PostLogin['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        accessToken:
          'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6IlBFTkRJTkciLCJpYXQiOjE3NTgxODU4MzksImV4cCI6MTc1ODE4NzYzOX0.fuSbpYdlfauZ5hChWtu1lKyUnlOMJdRIJ9Df9VFlaGc',
        expiresAt: 1758187640448,
      },
      code: 'OK',
      errors: null,
    }

    return HttpResponse.json(data, {
      headers: { 'set-cookie': `refreshToken=${refreshToken}` },
    })
  }),
  //토큰 재발급
  http.post(`${API_URL}/users/auth/reissue`, ({ cookies }) => {
    if (!cookies.refreshToken) return new HttpResponse(null, { status: 403 })

    const refreshToken = 'refreshTokenExample'

    const data: UserTypes.PostReissue['Response'] = {
      success: true,
      message: '요청이 성공적으로 처리되었습니다.',
      data: {
        accessToken:
          'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6IlBFTkRJTkciLCJpYXQiOjE3NTgxODYwNDcsImV4cCI6MTc1ODE4Nzg0N30.ZJ2Ohc8O2qwdn8oYpJ-3iCTs8Ay839LNAvS_RfYxYkg',
        expiresAt: 1758187847287,
      },
      code: 'OK',
      errors: null,
    }
    return HttpResponse.json(data, {
      headers: { 'set-cookie': `refreshToken=${refreshToken}` },
    })
  }),

  // 로그아웃
  http.post(`${API_URL}/users/auth/logout`, () => {
    const data: UserTypes.PostLogout['Response'] = {
      success: true,
      message: '로그아웃이 완료되었습니다.',
      data: null,
      code: 'LOGOUT',
      errors: null,
    }

    return HttpResponse.json(data)
  }),

  // 회원 탈퇴
  http.put(`${API_URL}/users/withdrawal`, () => {
    return HttpResponse.json(null, { status: 200 })
  }),

  // 약관 동의
  http.patch(`${API_URL}/users/terms`, () => {
    const data: UserTypes.PatchUserTerms['Response'] = {
      success: true,
      message: '약관 동의가 완료되었습니다.',
      data: null,
      code: 'AGREE',
      errors: null,
    }
    return HttpResponse.json(data)
  }),
]
