import z from 'zod'

import type { contributionScoreSchema } from './contributionScore.schema'

export type ContributionScore = z.infer<typeof contributionScoreSchema>
