import PaaSsible from '@/config/interceptor'
import * as userAPISchemas from '@/types/apis/user/user.api.schemas'
import type * as UserAPITypes from '@/types/apis/user/user.api.types'

export const postLogin = async (
  body: UserAPITypes.PostLogin['Body'],
): Promise<UserAPITypes.PostLogin['Response']> => {
  const parsedBody = userAPISchemas.postLoginSchema.body.parse(body)
  const res = await PaaSsible.post('/users/auth/token', parsedBody)
  return userAPISchemas.postLoginSchema.response.parse(res.data)
}

export const postLogout = async (): Promise<UserAPITypes.PostLogout['Response']> => {
  const res = await PaaSsible.post('/users/auth/logout')
  return userAPISchemas.postLogoutSchema.response.parse(res.data)
}

export const postReissue = async (): Promise<UserAPITypes.PostReissue['Response']> => {
  const res = await PaaSsible.post('/users/auth/reissue')
  return userAPISchemas.postReissueSchema.response.parse(res.data)
}
