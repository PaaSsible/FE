import z from 'zod'

import { userSchema } from '@/types/entities/user/user.schemas'

export const contributionScoreSchema = z.object({
  id: userSchema.shape.id,
  memberName: userSchema.shape.nickname,
  part: z.string(),
  taskCompletion: z.number(),
  attendanceRate: z.number(),
  communicationFrequency: z.object({
    value: z.number(),
    total: z.number(),
  }),
  contribution: z.number(),
})
