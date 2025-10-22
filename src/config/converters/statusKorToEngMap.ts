import type { BoardStatus } from '@/types/entities/board/board.entitites.types'

import type { StatusTab } from '../constants/statusKor'

export const statusKorToEngMap: Record<StatusTab, BoardStatus | undefined> = {
  진행중: 'ONGOING',
  완료: 'COMPLETED',
  전체: undefined,
}
