import z from 'zod'

export const interestSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const portfolioSchema = z.object({
  id: z.number(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  file: z.string().nullable(),
})

export const userSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  major: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
})

export const notificationTypeArray = ['RECRUIT', 'MEET', 'CHAT'] as const
export const notificationSchema = z.object({
  id: z.number(),
  userId: z.number(),
  type: z.enum(notificationTypeArray),
  title: z.string(),
  content: z.string(),
  createdAt: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
})
