import z from 'zod'

export const interestSchema = z.object({
  id: z.bigint(),
  name: z.string(),
})

export const portfolioSchema = z.object({
  id: z.bigint(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  file: z.string().nullable(),
})

export const userSchema = z.object({
  id: z.bigint(),
  nickname: z.string(),
  major: z.string().nullable(),
  profileImageUrl: z.url().nullable(),
})
