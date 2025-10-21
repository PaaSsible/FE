import type { RecruitSort } from '@/types/apis/recruit/recruit.api.types'
import { detailTypeArray } from '@/types/entities/board/board.entities.schemas'
import type { ActivityType } from '@/types/entities/board/board.entitites.types'

type RecruitDetailType = (typeof detailTypeArray)[number]

export const RECRUIT_CATEGORIES = [
  {
    label: '공모전/대회',
    segment: 'contest',
    mainCategory: 'CONTEST',
    chips: [
      { label: '기획 중심', subCategory: 'CONTEST_PLANNING' },
      { label: '기획+디자인', subCategory: 'CONTEST_PLANNING_DESIGN' },
      { label: '디자인 중심', subCategory: 'CONTEST_DESIGN' },
      { label: '개발 중심', subCategory: 'CONTEST_DEV' },
      { label: '융합 프로젝트', subCategory: 'CONTEST_MIXED' },
      { label: '기타', subCategory: 'CONTEST_ETC' },
    ],
  },
  {
    label: '사이드 프로젝트',
    segment: 'side-project',
    mainCategory: 'SIDE_PROJECT',
    chips: [] as const,
  },
  {
    label: '스터디',
    segment: 'study',
    mainCategory: 'STUDY',
    chips: [
      { label: '기획 중심', subCategory: 'STUDY_PLANNING' },
      { label: '기획+디자인', subCategory: 'STUDY_DESIGN' },
      { label: '디자인 중심', subCategory: 'STUDY_DESIGN' },
      { label: '개발 중심', subCategory: 'STUDY_FE' },
      { label: '융합 프로젝트', subCategory: 'STUDY_BE' },
      { label: '기타', subCategory: 'STUDY_ETC' },
    ],
  },
  {
    label: '기타',
    segment: 'etc',
    mainCategory: 'ETC',
    chips: [] as const,
  },
] as const satisfies readonly {
  label: string
  segment: string
  mainCategory: ActivityType
  chips: readonly {
    label: string
    subCategory: RecruitDetailType | null
  }[]
}[]

export type RecruitCategoryConfig = (typeof RECRUIT_CATEGORIES)[number]

export type RecruitCategoryLabel = (typeof RECRUIT_CATEGORIES)[number]['label']

type RecruitChip = (typeof RECRUIT_CATEGORIES)[number]['chips'] extends readonly (infer Chip)[]
  ? Chip
  : never

export type RecruitChipLabel = RecruitChip extends { label: infer Label } ? Label : never

export const RECRUIT_CATEGORY_BY_LABEL: Record<RecruitCategoryLabel, RecruitCategoryConfig> =
  RECRUIT_CATEGORIES.reduce(
    (acc, category) => {
      acc[category.label] = category
      return acc
    },
    {} as Record<RecruitCategoryLabel, RecruitCategoryConfig>,
  )

export const RECRUIT_SORT_LABELS = ['최신순', '마감순', '인기순'] as const
export type RecruitSortLabel = (typeof RECRUIT_SORT_LABELS)[number]

export const RECRUIT_SORT_TO_QUERY: Record<RecruitSortLabel, RecruitSort> = {
  최신순: 'RECENT',
  마감순: 'DEADLINE',
  인기순: 'POPULAR',
}

export const RECRUIT_PERIODS = [
  { label: '기간 미정', code: 'UNDEFINED' },
  { label: '1개월', code: 'ONE' },
  { label: '2개월', code: 'TWO' },
  { label: '3개월', code: 'THREE' },
  { label: '4개월', code: 'FOUR' },
  { label: '5개월', code: 'FIVE' },
  { label: '6개월', code: 'SIX' },
  { label: '장기', code: 'LONG' },
] as const

export type RecruitPeriodLabel = (typeof RECRUIT_PERIODS)[number]['label']
export type RecruitPeriodCode = (typeof RECRUIT_PERIODS)[number]['code']
