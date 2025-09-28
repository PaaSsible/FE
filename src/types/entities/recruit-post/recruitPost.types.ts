import type z from 'zod'

import type {
  stackSchema,
  positionSchema,
  applicationStatusArray,
  applicationSchema,
  recruitPostSchema,
  projectDurationSchema,
  applicantSchema,
  recruitCommentSchema,
} from './recruitPost.schemas'

export type Stack = z.infer<typeof stackSchema>
export type Position = z.infer<typeof positionSchema>
export type ProjectDuration = z.infer<typeof projectDurationSchema>
export type Comment = z.infer<typeof recruitCommentSchema>
export type ApplicationStatus = (typeof applicationStatusArray)[number]
export type Application = z.infer<typeof applicationSchema>
export type Applicant = z.infer<typeof applicantSchema>
export type RecruitPost = z.infer<typeof recruitPostSchema>
