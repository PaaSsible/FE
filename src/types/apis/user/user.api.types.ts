import z from 'zod'

import type {
  patchUserTermsSchema,
  postLoginSchema,
  postLogoutSchema,
  postReissueSchema,
  postUserPortfolioSchema,
  postUserUploadSchema,
  getUserPortfoliosSchema,
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
