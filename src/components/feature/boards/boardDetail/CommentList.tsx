import type { RecruitComment } from '@/hooks/boards/useFetchRecruitComments'

import CommentItem from './CommentItem'

interface Props {
  comments: RecruitComment[]
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  replyParentId: number | null
  replyValue: string
  onReplyToggle: (id: number) => void
  onReplyChange: (value: string) => void
  onReplyCancel: () => void
  onReplySubmit: () => Promise<void>
  activeEditId: number | null
  editDrafts: Record<number, string>
  onEditToggle: (c: RecruitComment) => void
  onEditChange: (id: number, value: string) => void
  onEditCancel: (id: number) => void
  onEditSubmit: (c: RecruitComment) => Promise<void>
  onDeleteClick: (c: RecruitComment) => void
  isOwnComment: (id: number | string) => boolean
  isUpdating?: boolean
  isSubmitting?: boolean
}

export default function CommentList({ comments, isLoading, error, onRetry, ...handlers }: Props) {
  if (isLoading) {
    return (
      <div className="text-b4-medium px-6 py-10 text-center text-gray-600">
        댓글을 불러오는 중입니다.
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-b4-medium mt-8 rounded-md border border-red-200 bg-red-50 px-6 py-4 text-red-600">
        {error}
        {onRetry && (
          <button type="button" className="text-b4-bold ml-4 underline" onClick={onRetry}>
            다시 시도
          </button>
        )}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-b4-medium px-6 py-20 text-center text-gray-600">
        아직 등록된 댓글이 없습니다.
      </div>
    )
  }

  return (
    <div className="bg-gray-0 mt-[41px] rounded-md border border-[#E2E8F0]">
      {comments.map((comment, idx) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          {...handlers}
          isLast={idx === comments.length - 1}
        />
      ))}
    </div>
  )
}
