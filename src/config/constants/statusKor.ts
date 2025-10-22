export const statusTab = ['전체', '진행중', '완료'] as const
export type StatusTab = (typeof statusTab)[number]
