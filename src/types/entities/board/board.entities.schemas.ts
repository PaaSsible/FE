import z from 'zod'

import { userSchema } from '../user/user.schemas'

export const boardStatusArray = ['ONGOING', 'COMPLETED'] as const
export const activityTypeArray = ['CONTEST', 'SIDE_PROJECT', 'STUDY', 'ETC'] as const
export const detailTypeArray = [
  // CONTEST만 해당
  'CONTEST_PLANNING',
  'CONTEST_PLANNING_DESIGN',
  'CONTEST_DESIGN',
  'CONTEST_DEV',
  'CONTEST_MIXED',
  'CONTEST_ETC',
  // STUDY만 해당
  'STUDY_PLANNING',
  'STUDY_DESIGN',
  'STUDY_FE',
  'STUDY_BE',
  'STUDY_ETC',
]
export const boardSchema = z.object({
  id: z.number(),
  name: z.string(),
  activityType: z.string().nullable(),
  detailType: z.string().nullable(),
  status: z.enum(boardStatusArray),
  owner: z.string(),
})

export const boardMemberSchema = z.object({
  userId: userSchema.shape.id,
  userName: userSchema.shape.nickname,
  profileImageUrl: userSchema.shape.profileImageUrl,
  role: z.string(),
})

export const linkSchema = z.object({ id: z.number(), title: z.string(), url: z.url() })

export const taskStatusArray = ['PENDING', 'ONGOING', 'COMPLETED'] as const
export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  dueDate: z.preprocess(
    (val) => (val instanceof Date ? val : val ? new Date(val as string) : null),
    z.date().nullable(),
  ),
  status: z.enum(taskStatusArray),
})
export const meetingSchema = z.object({ id: z.number(), title: z.string(), content: z.string() })
