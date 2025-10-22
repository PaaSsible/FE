import type { BoardStatus } from '@/types/entities/board/board.entitites.types'

export const statusEngToKorMap: Record<BoardStatus, string> = {
  ONGOING: '진행중',
  COMPLETED: '완료',
}
