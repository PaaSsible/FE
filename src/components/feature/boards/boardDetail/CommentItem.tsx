import { MessageCircle, Pencil, Trash2 } from 'lucide-react'

import Avatar from '@/components/atoms/Avatar'
import type { RecruitComment } from '@/hooks/boards/useFetchRecruitComments'
import { formatRelativeTime } from '@/utils/relativeTime'

import CommentTextareaPanel from './CommentTextareaPanel'
import ReplyItem from './ReplyItem'

interface Props {
  comment: RecruitComment
  isLast: boolean
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

export default function CommentItem({
  comment,
  isLast,
  replyParentId,
  replyValue,
  onReplyToggle,
  onReplyChange,
  onReplyCancel,
  onReplySubmit,
  activeEditId,
  editDrafts,
  onEditToggle,
  onEditChange,
  onEditCancel,
  onEditSubmit,
  onDeleteClick,
  isOwnComment,
  isUpdating,
  isSubmitting,
}: Props) {
  const isEditing = activeEditId === comment.id
  const editValue = editDrafts[comment.id] ?? comment.content ?? ''
  const displayContent = comment.deleted ? '삭제된 댓글입니다.' : (comment.content ?? '')
  const writerLabel = comment.writerName ? String(comment.writerName) : '작성자'
  const createdAtLabel = formatRelativeTime(comment.createdAt)

  return (
    <div>
      <div className="flex px-[34px] py-[45px]">
        <Avatar name={writerLabel} className="mr-[11px]" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="text-b4-bold text-gray-900">{writerLabel}</div>
            <div className="flex items-center gap-[30px] text-gray-500">
              <span className="text-b4-regular">{createdAtLabel}</span>
              <div className="flex gap-[20px]">
                <button
                  type="button"
                  className="hover:text-gray-800"
                  onClick={() => onReplyToggle(comment.id)}
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
                {isOwnComment(comment.writerId) && !comment.deleted && (
                  <>
                    <button
                      type="button"
                      className="hover:text-gray-800"
                      onClick={() => onEditToggle(comment)}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      className="hover:text-gray-800"
                      onClick={() => onDeleteClick(comment)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <CommentTextareaPanel
              value={editValue}
              placeholder="댓글을 수정해 주세요."
              onChange={(v) => onEditChange(comment.id, v)}
              onCancel={() => onEditCancel(comment.id)}
              onSubmit={() => void onEditSubmit(comment)}
              variant="nested"
              className="mt-4"
              isSubmitting={isUpdating}
            />
          ) : (
            <p className="text-b4-medium text-gray-850 mt-3 leading-relaxed">{displayContent}</p>
          )}

          {comment.children?.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              parentId={comment.id}
              {...{
                activeEditId,
                editDrafts,
                onEditToggle,
                onEditChange,
                onEditCancel,
                onEditSubmit,
                onDeleteClick,
                isOwnComment,
                isUpdating,
              }}
            />
          ))}

          {replyParentId === comment.id && (
            <div className="relative mt-6 flex items-start gap-[11px] pl-[42px]">
              {/* ㄴ 모양 */}
              <div className="absolute top-[-10px] left-[5px] h-[30px] w-[20px] rounded-bl-sm border-b border-l border-gray-300" />

              {/* 아바타 및 이름 */}
              <Avatar name={comment.writerName} className="flex-shrink-0" />
              <div className="flex-1">
                <div className="text-b4-bold mb-[9px] text-gray-900">{comment.writerName}</div>
                <CommentTextareaPanel
                  value={replyValue}
                  placeholder="답글을 입력해 주세요."
                  onChange={onReplyChange}
                  onCancel={onReplyCancel}
                  onSubmit={() => void onReplySubmit()}
                  variant="nested"
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {!isLast && <div className="mx-6 h-px bg-gray-200" />}
    </div>
  )
}
