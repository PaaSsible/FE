import z from 'zod'

import { userSchema } from '../user/user.schemas'

export const stackSchema = z.object({ id: z.bigint(), name: z.string() })

export const positionSchema = z.object({ id: z.bigint(), name: z.string() })

export const commentSchema = z.object({
  id: z.bigint(),
  userId: userSchema.shape.id,
  parentId: z.bigint().nullable(),
  content: z.string().nullable(),
})

export const applicationStatusArray = ['ACCEPTED', 'REJECTED'] as const
export const applicationSchema = z.object({
  id: z.bigint(),
  status: z.enum(applicationStatusArray),
  message: z.string().nullable(),
})

export const recruitPostSchema = z.object({
  id: z.bigint(),
  title: z.string(),
  content: z.string().nullable(),
  deadline: z.string().nullable(),
  duration: z.number().nullable(),
  activityType: z.string().nullable(),
  detailType: z.string().nullable(),
})
