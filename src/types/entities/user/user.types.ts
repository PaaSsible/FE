import type z from 'zod'

import type { interestSchema, portfolioSchema, userSchema } from './user.schemas'

export type Interest = z.infer<typeof interestSchema>
export type Portfolio = z.infer<typeof portfolioSchema>
export type User = z.infer<typeof userSchema>
