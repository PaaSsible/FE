import PaaSsible from '@/config/interceptor'
import { getContributionScoresSchema } from '@/types/apis/board/contribution.api.schemas'
import type { GetContributionScores } from '@/types/apis/board/contribution.api.types'

/**
 * @name 기여도조회
 * @param path
 */
export const getContributionScores = async (
  path: GetContributionScores['path'],
): Promise<GetContributionScores['response']> => {
  const parsedPath = getContributionScoresSchema.path.parse(path)
  const res = await PaaSsible.get(`/boards/${parsedPath.boardId}/members/scores`)
  return getContributionScoresSchema.response.parse(res.data)
}
