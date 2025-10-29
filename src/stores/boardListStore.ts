import { create } from 'zustand'

import { getBoardList } from '@/apis/board.api'
import type { GetBoardList } from '@/types/apis/board/board.api.types'

export type BoardListSummary = Pick<GetBoardList['Response']['data'][number], 'boardId' | 'name'>

interface BoardListState {
  boards: BoardListSummary[]
  isLoading: boolean
  error: string | null
  hasFetched: boolean
  fetchBoards: (options?: { force?: boolean }) => Promise<void>
}

export const useBoardListStore = create<BoardListState>((set, get) => ({
  boards: [],
  isLoading: false,
  error: null,
  hasFetched: false,
  fetchBoards: async (options) => {
    const { force = false } = options ?? {}

    if (get().isLoading) {
      return
    }

    if (!force && get().hasFetched) {
      return
    }

    set({ isLoading: true, error: null })

    try {
      const response = await getBoardList({})

      if (!response.success) {
        throw new Error(response.message ?? '보드 목록을 불러오지 못했습니다.')
      }

      const summaries = response.data.map<BoardListSummary>((board) => ({
        boardId: board.boardId,
        name: board.name,
      }))

      set({
        boards: summaries,
        hasFetched: true,
      })
    } catch (error) {
      console.error('Failed to load board list', error)

      set({
        boards: [],
        error:
          error instanceof Error
            ? error.message
            : '보드 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
        hasFetched: true,
      })
    } finally {
      set({ isLoading: false })
    }
  },
}))
