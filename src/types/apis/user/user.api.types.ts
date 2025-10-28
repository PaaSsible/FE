import z from 'zod'

import type {
  deleteUserPortfolioSchema,
  getUserPortfolioDetailSchema,
  getUserPortfoliosSchema,
  patchUserTermsSchema,
  postLoginSchema,
  postLogoutSchema,
  postReissueSchema,
  postUserPortfolioSchema,
  postUserUploadSchema,
  putUserPortfolioSchema,
} from './user.api.schemas'

export type PostLogin = {
  Body: z.infer<typeof postLoginSchema.body>
  Response: z.infer<typeof postLoginSchema.response>
}

export type PostLogout = {
  Response: z.infer<typeof postLogoutSchema.response>
}

export type PostReissue = {
  Response: z.infer<typeof postReissueSchema.response>
}

export type PatchUserTerms = {
  Response: z.infer<typeof patchUserTermsSchema.response>
}

export type PostUserPortfolio = {
  Body: z.infer<typeof postUserPortfolioSchema.body>
  Response: z.infer<typeof postUserPortfolioSchema.response>
}

export type PostUserUpload = {
  Response: z.infer<typeof postUserUploadSchema.response>
}

export type GetUserPortfolios = {
  Path: z.infer<typeof getUserPortfoliosSchema.path>
  Query: z.infer<typeof getUserPortfoliosSchema.query>
  Response: z.infer<typeof getUserPortfoliosSchema.response>
}

export type GetUserPortfolioDetail = {
  Path: z.infer<typeof getUserPortfolioDetailSchema.path>
  Response: z.infer<typeof getUserPortfolioDetailSchema.response>
}

export type PutUserPortfolio = {
  Path: z.infer<typeof putUserPortfolioSchema.path>
  Body: z.infer<typeof putUserPortfolioSchema.body>
  Response: z.infer<typeof putUserPortfolioSchema.response>
}

export type DeleteUserPortfolio = {
  Path: z.infer<typeof deleteUserPortfolioSchema.path>
  Response: z.infer<typeof deleteUserPortfolioSchema.response>
}
