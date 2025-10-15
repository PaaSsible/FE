import z from 'zod'

import { contributionScoreSchema } from '@/types/components/contributionScore/contributionScore.schema'
import { boardSchema } from '@/types/entities/board/board.entities.schemas'

/**
 * @name 기여도조회
 * @path `/boards/{boardId}/members/scores`
 */
export const getContributionScoresSchema = {
  path: z.object({ boardId: boardSchema.shape.boardId }),
  response: z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(contributionScoreSchema),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}
