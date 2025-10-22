import { useMemo } from 'react'

import Avatar from '@/components/atoms/Avatar'
import Modal from '@/components/common/Modal'
import useBoardsDetailComments from '@/hooks/boards/useBoardsDetailComments'
import type { RecruitComment } from '@/hooks/boards/useFetchRecruitComments'

import CommentInput from './CommentInput'
import CommentList from './CommentList'

interface Props {
  comments: RecruitComment[]
  totalCount?: number | null
  currentUserId?: string | number | null
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  onSubmitComment: (params: { content: string; parentId?: number }) => Promise<boolean>
  onUpdateComment: (params: {
    commentId: number
    content: string
    parentId?: number | null
  }) => Promise<boolean>
  onDeleteComment: (params: { commentId: number; parentId?: number | null }) => Promise<boolean>
  isSubmitting?: boolean
  isUpdating?: boolean
  isDeleting?: boolean
}

export default function BoardsDetailComments({
  comments,
  totalCount,
  currentUserId,
  isLoading = false,
  error = null,
  onRetry,
  onSubmitComment,
  onUpdateComment,
  onDeleteComment,
  isSubmitting = false,
  isUpdating = false,
  isDeleting = false,
}: Props) {
  const {
    commentValue,
    handleCommentChange,
    handleCommentSubmit,
    replyParentId,
    replyValue,
    handleReplyToggle,
    handleReplyChange,
    handleReplyCancel,
    handleReplySubmit,
    activeEditId,
    editDrafts,
    handleEditToggle,
    handleEditChange,
    handleEditCancel,
    handleEditSubmit,
    isUpdating: isUpdatingState,
    isDeleting: isDeletingState,
    deleteTarget,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    isOwnComment,
  } = useBoardsDetailComments({
    currentUserId,
    onSubmitComment,
    onUpdateComment,
    onDeleteComment,
    isSubmitting,
    isUpdating,
    isDeleting,
  })

  // 댓글 총합 (댓글 + 대댓글)
  const totalComments = useMemo(() => {
    if (typeof totalCount === 'number') return totalCount
    const countReplies = (c: RecruitComment) => 1 + (c.children?.length ?? 0)
    return comments.reduce((acc, c) => acc + countReplies(c), 0)
  }, [comments, totalCount])

  const currentUserName = '이윤지'
  const isDeleteReply = deleteTarget?.parentId !== undefined && deleteTarget?.parentId !== null
  const deleteModalTitle = isDeleteReply ? '답글을 삭제하시겠어요?' : '댓글을 삭제하시겠어요?'
  const deleteModalDescription = isDeleteReply
    ? '삭제한 답글은 복구할 수 없습니다.'
    : '삭제한 댓글은 복구할 수 없습니다.'

  return (
    <section className="mt-[88px]">
      {/* 헤더 */}
      <h3 className="text-s2-bold flex items-baseline gap-4">
        댓글 <span className="text-b1-medium text-gray-600">{totalComments}</span>
      </h3>

      {/* 사용자 정보 */}
      <div className="mt-[47px] flex items-center gap-[11px]">
        <Avatar name={currentUserName} />
        <div className="text-b4-bold text-gray-900">{currentUserName}</div>
      </div>

      {/* 댓글 입력 */}
      <CommentInput
        value={commentValue}
        onChange={handleCommentChange}
        onSubmit={handleCommentSubmit}
        isSubmitting={isSubmitting}
      />

      {/* 댓글 리스트 */}
      <CommentList
        comments={comments}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        replyParentId={replyParentId}
        replyValue={replyValue}
        onReplyToggle={handleReplyToggle}
        onReplyChange={handleReplyChange}
        onReplyCancel={handleReplyCancel}
        onReplySubmit={handleReplySubmit}
        activeEditId={activeEditId}
        editDrafts={editDrafts}
        onEditToggle={handleEditToggle}
        onEditChange={handleEditChange}
        onEditCancel={handleEditCancel}
        onEditSubmit={handleEditSubmit}
        onDeleteClick={handleDeleteClick}
        isOwnComment={isOwnComment}
        isUpdating={isUpdatingState}
        isSubmitting={isSubmitting}
      />

      {deleteTarget && (
        <Modal
          isOpen
          title={deleteModalTitle}
          description={deleteModalDescription}
          cancelLabel="삭제하기"
          confirmLabel="취소"
          onCancel={() => void handleDeleteConfirm()}
          onConfirm={handleDeleteCancel}
          cancelDisabled={isDeletingState}
          confirmDisabled={isDeletingState}
        />
      )}
    </section>
  )
}
