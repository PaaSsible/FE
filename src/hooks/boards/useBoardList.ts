import { useEffect, useMemo } from 'react'

import { useBoardListStore, type BoardListSummary } from '@/stores/boardListStore'

type UseBoardListResult = {
  boards: BoardListSummary[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export default function useBoardList(): UseBoardListResult {
  const boards = useBoardListStore((state) => state.boards)
  const isLoading = useBoardListStore((state) => state.isLoading)
  const error = useBoardListStore((state) => state.error)
  const fetchBoards = useBoardListStore((state) => state.fetchBoards)

  useEffect(() => {
    void fetchBoards()
  }, [fetchBoards])

  return useMemo(
    () => ({
      boards,
      isLoading,
      error,
      refetch: () => {
        void fetchBoards({ force: true })
      },
    }),
    [boards, error, fetchBoards, isLoading],
  )
}
