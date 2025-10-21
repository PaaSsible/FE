import { Pencil, Trash2 } from 'lucide-react'

import Avatar from '@/components/atoms/Avatar'
import type { RecruitComment } from '@/hooks/useFetchRecruitComments'
import { formatRelativeTime } from '@/utils/relativeTime'

import CommentTextareaPanel from './CommentTextareaPanel'

interface Props {
  reply: RecruitComment
  parentId: number
  activeEditId: number | null
  editDrafts: Record<number, string>
  onEditToggle: (c: RecruitComment) => void
  onEditChange: (id: number, value: string) => void
  onEditCancel: (id: number) => void
  onEditSubmit: (c: RecruitComment) => Promise<void>
  onDeleteClick: (c: RecruitComment) => void
  isOwnComment: (id: number | string) => boolean
  isUpdating?: boolean
}

export default function ReplyItem({
  reply,
  parentId,
  activeEditId,
  editDrafts,
  onEditToggle,
  onEditChange,
  onEditCancel,
  onEditSubmit,
  onDeleteClick,
  isOwnComment,
  isUpdating,
}: Props) {
  const isEditing = activeEditId === reply.id
  const editValue = editDrafts[reply.id] ?? reply.content ?? ''
  const displayContent = reply.deleted ? '삭제된 댓글입니다.' : (reply.content ?? '')
  const writerLabel = reply.writerId ? String(reply.writerId) : '작성자'
  const createdAtLabel = formatRelativeTime(reply.createdAt)
  const canManage = isOwnComment(reply.writerId) && !reply.deleted

  const normalizedReply = { ...reply, parentId }

  return (
    <div className="mt-4 flex pl-8">
      <Avatar name={writerLabel} className="mr-3" />
      <div className="flex-1">
        <div className="flex items-start justify-between leading-8">
          <div className="text-b4-bold text-gray-900">{writerLabel}</div>
          <div className="flex items-center gap-3 text-gray-500">
            <span className="text-l3-medium">{createdAtLabel}</span>
            {canManage && (
              <>
                <button
                  type="button"
                  onClick={() => onEditToggle(normalizedReply)}
                  className="hover:text-gray-800"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteClick(normalizedReply)}
                  className="hover:text-gray-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <CommentTextareaPanel
            value={editValue}
            placeholder="답글을 수정해 주세요."
            onChange={(v) => onEditChange(reply.id, v)}
            onCancel={() => onEditCancel(reply.id)}
            onSubmit={() => void onEditSubmit(normalizedReply)}
            variant="nested"
            className="mt-2"
            isSubmitting={isUpdating}
          />
        ) : (
          <p className="text-b4-medium text-gray-850 mt-3">{displayContent}</p>
        )}
      </div>
    </div>
  )
}
