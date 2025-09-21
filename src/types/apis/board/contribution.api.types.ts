import z from 'zod'

import type { getContributionScoresSchema } from './contribution.api.schemas'

export type GetContributionScoresSchema = {
  path: z.infer<typeof getContributionScoresSchema.path>
  response: z.infer<typeof getContributionScoresSchema.response>
}
