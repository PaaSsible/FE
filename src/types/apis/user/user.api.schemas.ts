import z from 'zod'

export const postLoginSchema = {
  body: z.object({
    code: z.string(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.object({
      accessToken: z.string(),
      expiresAt: z.number(),
    }),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const postLogoutSchema = {
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.null(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const postReissueSchema = {
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.object({
      accessToken: z.string(),
      expiresAt: z.number(),
    }),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const putWithdrawalSchema = {}

export const patchUserTermsSchema = {
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.null(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}
