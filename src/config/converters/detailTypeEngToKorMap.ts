import type { DetailType } from '@/types/entities/board/board.entitites.types'

export const detailTypeEngToKorMap: Record<DetailType, string> = {
  // CONTEST
  CONTEST_PLANNING: '공모전 기획',
  CONTEST_PLANNING_DESIGN: '공모전 기획/디자인',
  CONTEST_DESIGN: '공모전 디자인',
  CONTEST_DEV: '공모전 개발',
  CONTEST_MIXED: '공모전 혼합',
  CONTEST_ETC: '공모전 기타',
  // STUDY
  STUDY_PLANNING: '스터디 기획',
  STUDY_DESIGN: '스터디 디자인',
  STUDY_FE: '스터디 프론트엔드',
  STUDY_BE: '스터디 백엔드',
  STUDY_ETC: '스터디 기타',
}
