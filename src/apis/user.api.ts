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
  return userAPISchemas.patchUserTermsSchema.response.parse(res.data)
}

export const postUserPortfolio = async (
  body: UserAPITypes.PostUserPortfolio['Body'],
): Promise<UserAPITypes.PostUserPortfolio['Response']> => {
  const parsedBody = userAPISchemas.postUserPortfolioSchema.body.parse(body)
  const res = await PaaSsibleUser.post('/users/portfolios', parsedBody)
  return userAPISchemas.postUserPortfolioSchema.response.parse(res.data)
}

export const postUserUpload = async (
  formData: FormData,
): Promise<UserAPITypes.PostUserUpload['Response']> => {
  const res = await PaaSsibleUser.post('/users/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return userAPISchemas.postUserUploadSchema.response.parse(res.data)
}

export const getUserPortfolios = async ({
  userId,
  page,
  size,
}: {
  userId: number
  page?: number
  size?: number
}): Promise<UserAPITypes.GetUserPortfolios['Response']> => {
  const parsedPath = userAPISchemas.getUserPortfoliosSchema.path.parse({ userId })
  const parsedQuery = userAPISchemas.getUserPortfoliosSchema.query?.parse({ page, size }) ?? {}

  const res = await PaaSsibleUser.get(`/users/${parsedPath.userId}/portfolios`, {
    params: parsedQuery,
  })
  return userAPISchemas.getUserPortfoliosSchema.response.parse(res.data)
}

export const getUserPortfolioDetail = async ({
  portfolioId,
}: {
  portfolioId: number
}): Promise<UserAPITypes.GetUserPortfolioDetail['Response']> => {
  const parsedPath = userAPISchemas.getUserPortfolioDetailSchema.path.parse({ portfolioId })
  const res = await PaaSsibleUser.get(`/users/portfolios/${parsedPath.portfolioId}`)
  return userAPISchemas.getUserPortfolioDetailSchema.response.parse(res.data)
}

export const putUserPortfolio = async (
  { portfolioId }: { portfolioId: number },
  body: UserAPITypes.PutUserPortfolio['Body'],
): Promise<UserAPITypes.PutUserPortfolio['Response']> => {
  const parsedPath = userAPISchemas.putUserPortfolioSchema.path.parse({ portfolioId })
  const parsedBody = userAPISchemas.putUserPortfolioSchema.body.parse(body)
  const res = await PaaSsibleUser.put(`/users/portfolios/${parsedPath.portfolioId}`, parsedBody)
  return userAPISchemas.putUserPortfolioSchema.response.parse(res.data)
}

export const deleteUserPortfolio = async ({
  portfolioId,
}: {
  portfolioId: number
}): Promise<UserAPITypes.DeleteUserPortfolio['Response']> => {
  const parsedPath = userAPISchemas.deleteUserPortfolioSchema.path.parse({ portfolioId })
  const res = await PaaSsibleUser.delete(`/users/portfolios/${parsedPath.portfolioId}`)
  return userAPISchemas.deleteUserPortfolioSchema.response.parse(res.data)
}
