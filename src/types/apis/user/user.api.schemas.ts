import z from 'zod'

const degreeTypeSchema = z.enum([
  'HIGH_SCHOOL',
  'COLLEGE',
  'UNIVERSITY',
  'GRADUATE_MASTER',
  'GRADUATE_DOCTOR',
])

const graduationStatusSchema = z.enum([
  'ENROLLED',
  'LEAVE_OF_ABSENCE',
  'GRADUATED',
  'EXPECTED',
  'COMPLETED',
  'DROPPED_OUT',
])

const userProfileSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  email: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional(),
  positionName: z.string().nullable().optional(),
  stackNames: z.array(z.string()).nullable().optional(),
  degreeType: degreeTypeSchema.nullable().optional(),
  university: z.string().nullable().optional(),
  major: z.string().nullable().optional(),
  graduationStatus: graduationStatusSchema.nullable().optional(),
  introductionTitle: z.string().nullable().optional(),
  introductionContent: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
})

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

export const getUserProfileSchema = {
  path: z.object({
    userId: z.number().int().positive(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: userProfileSchema,
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const postUserPortfolioSchema = {
  body: z.object({
    positionId: z.number().int().positive(),
    title: z.string().min(1, '제목은 필수 항목입니다.'),
    summary: z.string().nullable().optional(),
    description: z.string().min(1, '본문은 필수 항목입니다.'),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.unknown().nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const postUserUploadSchema = {
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z
      .object({
        url: z.string(),
      })
      .passthrough(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

const userPortfolioItemSchema = z.object({
  id: z.number(),
  userId: z.number(),
  positionName: z.string(),
  title: z.string(),
  summary: z.string().nullable(),
  mainCategory: z.string().nullable(),
  subCategory: z.string().nullable(),
  contribution: z.number().nullable(),
  generatedByAi: z.boolean().optional(),
  createdAt: z.string(),
})

export const getUserPortfoliosSchema = {
  path: z.object({
    userId: z.number().int().positive(),
  }),
  query: z
    .object({
      page: z.number().int().min(0).optional(),
      size: z.number().int().min(1).max(50).optional(),
    })
    .optional(),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.object({
      portfolios: z.array(userPortfolioItemSchema),
      currentPage: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      totalElements: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrevious: z.boolean(),
    }),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

const userPortfolioDetailSchema = userPortfolioItemSchema.extend({
  positionId: z.number().int().positive().optional(),
  description: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export const getUserPortfolioDetailSchema = {
  path: z.object({
    portfolioId: z.number().int().positive(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: userPortfolioDetailSchema,
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const putUserPortfolioSchema = {
  path: z.object({
    portfolioId: z.number().int().positive(),
  }),
  body: postUserPortfolioSchema.body,
  response: postUserPortfolioSchema.response,
}

export const deleteUserPortfolioSchema = {
  path: z.object({
    portfolioId: z.number().int().positive(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.unknown().nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}
