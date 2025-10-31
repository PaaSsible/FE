import type { TaskStatus } from '@/types/entities/board/board.entitites.types'

export const taskStatusEngToKorMap: Record<TaskStatus, string> = {
  COMPLETED: '완료',
  ONGOING: '진행 중',
  PENDING: '진행 예정',
}
