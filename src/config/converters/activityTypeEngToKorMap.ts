import type { ActivityType } from '@/types/entities/board/board.entitites.types'

export const activityTypeEngToKorMap: Record<ActivityType, string> = {
  CONTEST: '공모전/대회',
  SIDE_PROJECT: '사이드 프로젝트',
  STUDY: '스터디',
  ETC: '기타',
}
