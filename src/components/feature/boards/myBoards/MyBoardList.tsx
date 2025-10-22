import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { getMyRecruit, deleteRecruit } from '@/apis/recruit.api'
import type { GetMyRecruit } from '@/types/apis/recruit/recruit.api.types'
import { positionIdToLabel, stackIdToLabel } from '@/utils/recruitMeta'
import { formatRelativeTime } from '@/utils/relativeTime'

import MyBoardItem from './MyBoardItem'

type MyRecruitPost = GetMyRecruit['Response']['data']['posts'][number]

export default function MyBoardList() {
  const [boards, setBoards] = useState<MyRecruitPost[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [_, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBoards = async () => {
    try {
      setLoading(true)
      const res = await getMyRecruit({ page: 0, size: 10 })
      if (res.success) {
        setBoards(res.data.posts)
        setTotalCount(res.data.pageInfo.totalElements)
      } else {
        setError(res.message ?? '데이터를 불러오지 못했습니다.')
      }
    } catch {
      setError('서버 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchBoards()
  }, [])

  const handleDelete = async (postId: number) => {
    try {
      const res = await deleteRecruit({ postId })
      if (res.success) {
        toast.success('모집글이 삭제되었습니다.')
        await fetchBoards()
      } else {
        toast.error('삭제에 실패했습니다.')
      }
    } catch {
      toast.error('서버 오류가 발생했습니다.')
    }
  }

  if (error) return <p className="text-red-500">에러가 발생했습니다: {error}</p>
  if (!boards.length)
    return (
      <section className="flex h-[60vh] items-center justify-center">
        <p className="text-s1-bold text-gray-1000">작성한 모집글이 없습니다.</p>
      </section>
    )

  return (
    <section>
      <p className="mb-4 font-medium text-gray-500">내 모집글 {totalCount}건</p>

      <div className="flex flex-col gap-4">
        {boards.map((board) => {
          const createdAtLabel = formatRelativeTime(board.createdAt)
          const positionLabel =
            board.recruits.length > 0
              ? (positionIdToLabel(board.recruits[0].position) ?? '미지정')
              : '미지정'

          const stackLabels =
            board.recruits.length > 0
              ? board.recruits[0].stacks.map((stackId) => stackIdToLabel(stackId) ?? '')
              : []

          return (
            <MyBoardItem
              key={board.postId}
              postId={board.postId}
              title={board.title}
              createdAt={createdAtLabel}
              deadline={board.deadline}
              position={positionLabel}
              tags={stackLabels}
              views={board.viewCount}
              applicants={board.applicationCount}
              onDelete={() => void handleDelete(board.postId)}
            />
          )
        })}
      </div>
    </section>
  )
}
