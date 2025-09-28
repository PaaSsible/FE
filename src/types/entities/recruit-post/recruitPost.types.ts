import type z from 'zod'

import type {
  stackSchema,
  positionSchema,
  commentSchema,
  applicationStatusArray,
  applicationSchema,
  recruitPostSchema,
} from './recruitPost.schemas'

export type Stack = z.infer<typeof stackSchema>
export type Position = z.infer<typeof positionSchema>
export type Comment = z.infer<typeof commentSchema>
export type ApplicationStatus = (typeof applicationStatusArray)[number]
export type Application = z.infer<typeof applicationSchema>
export type RecruitPost = z.infer<typeof recruitPostSchema>
