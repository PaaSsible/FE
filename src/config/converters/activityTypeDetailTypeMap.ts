import type { ActivityType, DetailType } from '@/types/entities/board/board.entitites.types'

export const activityTypeToDetailTypeMap: Record<ActivityType, DetailType[]> = {
  CONTEST: [
    'CONTEST_PLANNING',
    'CONTEST_PLANNING_DESIGN',
    'CONTEST_DESIGN',
    'CONTEST_DEV',
    'CONTEST_MIXED',
    'CONTEST_ETC',
  ],
  STUDY: ['STUDY_PLANNING', 'STUDY_DESIGN', 'STUDY_FE', 'STUDY_BE', 'STUDY_ETC'],
  SIDE_PROJECT: [],
  ETC: [],
}
