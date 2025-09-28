import z from 'zod'

import type {
  deleteRecruitCommentSchema,
  deleteRecruitSchema,
  getMyRecruitSchema,
  getPositionsSchema,
  getRecruitApplicantsSchema,
  getRecruitCommentsSchema,
  getRecruitsSchema,
  getStacksSchema,
  postRecruitApplicantAcceptSchema,
  postRecruitCommentSchema,
  postRecruitSchema,
  putRecruitCommentSchema,
  putRecruitSchema,
  sortArray,
} from './recruit.api.schemas'

export type GetPositions = {
  Response: z.infer<typeof getPositionsSchema>
}

export type GetStacks = {
  Response: z.infer<typeof getStacksSchema>
}

export type PostRecruit = {
  Body: z.infer<typeof postRecruitSchema.body>
  Response: z.infer<typeof postRecruitSchema.response>
}

export type RecruitSort = (typeof sortArray)[number]

export type GetRecruits = {
  Query: z.infer<typeof getRecruitsSchema.query>
  Response: z.infer<typeof getRecruitsSchema.response>
}

export type PutRecruit = {
  Path: z.infer<typeof putRecruitSchema.path>
  Body: z.infer<typeof putRecruitSchema.body>
  Response: z.infer<typeof putRecruitSchema.response>
}

export type GetRecruitDetail = {
  Path: z.infer<typeof getRecruitsSchema.query>
  Response: z.infer<typeof getRecruitsSchema.response>
}

export type DeleteRecruit = {
  Path: z.infer<typeof deleteRecruitSchema.path>
  Response: z.infer<typeof deleteRecruitSchema.response>
}

export type GetRecruitApplicants = {
  Path: z.infer<typeof getRecruitApplicantsSchema.path>
  Response: z.infer<typeof getRecruitApplicantsSchema.response>
}

export type PostRecruitApplicantAccept = {
  Path: z.infer<typeof postRecruitApplicantAcceptSchema.path>
  Body: z.infer<typeof postRecruitApplicantAcceptSchema.body>
}

export type GetMyRecruit = {
  Query: z.infer<typeof getMyRecruitSchema.query>
  Response: z.infer<typeof getMyRecruitSchema.response>
}

export type PostRecruitComment = {
  Path: z.infer<typeof postRecruitCommentSchema.path>
  Body: z.infer<typeof postRecruitCommentSchema.body>
}

export type GetRecruitComments = {
  Path: z.infer<typeof getRecruitCommentsSchema.path>
  Response: z.infer<typeof getRecruitCommentsSchema.response>
}

export type PutRecruitComment = {
  Path: z.infer<typeof putRecruitCommentSchema.path>
  Body: z.infer<typeof putRecruitCommentSchema.body>
}

export type deleteRecruitComment = {
  Path: z.infer<typeof deleteRecruitCommentSchema.path>
  Response: z.infer<typeof deleteRecruitCommentSchema.response>
}
