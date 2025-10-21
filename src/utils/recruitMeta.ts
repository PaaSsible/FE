import { RECRUIT_CATEGORIES, RECRUIT_PERIODS } from '@/constants/recruitFilters'
import { positionsArray, stacksArray } from '@/types/entities/recruit-post/recruitPost.schemas'

const POSITION_LABEL_BY_ID = positionsArray.reduce<Record<number, string>>((acc, label, index) => {
  acc[index + 1] = label.trim()
  return acc
}, {})

const STACK_LABEL_BY_ID = stacksArray.reduce<Record<number, string>>((acc, label, index) => {
  acc[index + 1] = label.trim()
  return acc
}, {})

export const formatPositions = (ids: number[]): string => {
  const labels = ids
    .map((id) => POSITION_LABEL_BY_ID[id])
    .filter((label): label is string => Boolean(label))
  return labels.join(', ')
}

export const formatStacks = (ids: number[]): string[] => {
  return ids.map((id) => STACK_LABEL_BY_ID[id]).filter((label): label is string => Boolean(label))
}

export const positionIdToLabel = (id: number): string | null => {
  return POSITION_LABEL_BY_ID[id] ?? null
}

export const stackIdToLabel = (id: number): string | null => {
  return STACK_LABEL_BY_ID[id] ?? null
}

const MAIN_CATEGORY_LABEL_BY_CODE = RECRUIT_CATEGORIES.reduce<Record<string, string>>(
  (acc, category) => {
    acc[category.mainCategory] = category.label
    return acc
  },
  {} as Record<string, string>,
)

const DETAIL_TYPE_LABEL_BY_CODE = RECRUIT_CATEGORIES.reduce<Record<string, string>>(
  (acc, category) => {
    category.chips.forEach((chip) => {
      if (chip.subCategory) {
        acc[chip.subCategory] = chip.label
      }
    })
    return acc
  },
  {} as Record<string, string>,
)

const PROJECT_DURATION_LABEL_BY_CODE = RECRUIT_PERIODS.reduce<Record<string, string>>(
  (acc, period) => {
    acc[period.code] = period.label
    return acc
  },
  {} as Record<string, string>,
)

export const mainCategoryToLabel = (code?: string | null): string => {
  if (!code) {
    return '분류 없음'
  }

  const codeKey = String(code)
  const label = MAIN_CATEGORY_LABEL_BY_CODE[codeKey]
  return label ?? codeKey
}

export const detailTypeToLabel = (code?: string | null): string => {
  if (!code) {
    return '세부 분류 없음'
  }

  const codeKey = String(code)
  const label = DETAIL_TYPE_LABEL_BY_CODE[codeKey]
  return label ?? codeKey
}

export const projectDurationToLabel = (code?: string | null): string => {
  if (!code) {
    return '기간 미정'
  }

  const codeKey = String(code)
  const label = PROJECT_DURATION_LABEL_BY_CODE[codeKey]
  return label ?? codeKey
}
