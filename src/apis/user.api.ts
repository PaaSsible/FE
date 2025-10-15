import type { AxiosResponse } from 'axios'

import PaaSsibleUser from '@/config/interceptors/user.interceptor'
import * as userAPISchemas from '@/types/apis/user/user.api.schemas'
import type * as UserAPITypes from '@/types/apis/user/user.api.types'

export const postLogin = async (
  body: UserAPITypes.PostLogin['Body'],
): Promise<UserAPITypes.PostLogin['Response']> => {
  const parsedBody = userAPISchemas.postLoginSchema.body.parse(body)
  const res = await PaaSsibleUser.post('/users/auth/token', parsedBody)
  return userAPISchemas.postLoginSchema.response.parse(res.data)
}

export const postLogout = async (): Promise<UserAPITypes.PostLogout['Response']> => {
  const res = await PaaSsibleUser.post('/users/auth/logout')
  return userAPISchemas.postLogoutSchema.response.parse(res.data)
}

export const postReissue = async (): Promise<UserAPITypes.PostReissue['Response']> => {
  const res = await PaaSsibleUser.post('/users/auth/reissue')
  return userAPISchemas.postReissueSchema.response.parse(res.data)
}

export const putWithdrawal = async (): Promise<AxiosResponse<any, any>> => {
  return await PaaSsibleUser.put('/users/withdrawal')
}

export const patchUserTerms = async (): Promise<UserAPITypes.PatchUserTerms['Response']> => {
  const res = await PaaSsibleUser.patch('/users/terms')
  return userAPISchemas.patchUserTermsSchema.response.parse(res)
}
