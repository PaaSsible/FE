import { useCallback, useState } from 'react'

import type { RecruitComment } from '@/hooks/boards/useFetchRecruitComments'

type SubmitParams = {
  content: string
  parentId?: number
}

type UpdateParams = {
  commentId: number
  content: string
  parentId?: number | null
}

type UseBoardsDetailCommentsParams = {
  currentUserId?: string | number | null
  onSubmitComment: (params: SubmitParams) => Promise<boolean>
  onUpdateComment: (params: UpdateParams) => Promise<boolean>
  onDeleteComment: (params: { commentId: number; parentId?: number | null }) => Promise<boolean>
  isSubmitting: boolean
  isUpdating: boolean
  isDeleting: boolean
}

type CommentTarget = Pick<
  RecruitComment,
  'id' | 'content' | 'deleted' | 'writerId' | 'writerName' | 'parentId'
>

type UseBoardsDetailCommentsResult = {
  commentValue: string
  handleCommentChange: (value: string) => void
  handleCommentSubmit: () => Promise<void>
  replyParentId: number | null
  replyValue: string
  handleReplyToggle: (commentId: number) => void
  handleReplyChange: (value: string) => void
  handleReplyCancel: () => void
  handleReplySubmit: () => Promise<void>
  activeEditId: number | null
  editDrafts: Record<number, string>
  handleEditToggle: (comment: CommentTarget) => void
  handleEditChange: (commentId: number, value: string) => void
  handleEditCancel: (commentId: number) => void
  handleEditSubmit: (comment: CommentTarget) => Promise<void>
  isUpdating: boolean
  isDeleting: boolean
  deleteTarget: CommentTarget | null
  handleDeleteClick: (comment: CommentTarget) => void
  handleDeleteCancel: () => void
  handleDeleteConfirm: () => Promise<void>
  isOwnComment: (writerId: number | string) => boolean
}

export default function useBoardsDetailComments({
  currentUserId,
  onSubmitComment,
  onUpdateComment,
  onDeleteComment,
  isSubmitting,
  isUpdating,
  isDeleting,
}: UseBoardsDetailCommentsParams): UseBoardsDetailCommentsResult {
  const [commentValue, setCommentValue] = useState('')
  const [replyParentId, setReplyParentId] = useState<number | null>(null)
  const [replyValue, setReplyValue] = useState('')
  const [activeEditId, setActiveEditId] = useState<number | null>(null)
  const [editDrafts, setEditDrafts] = useState<Record<number, string>>({})
  const [deleteTarget, setDeleteTarget] = useState<CommentTarget | null>(null)

  const normalizedUserId =
    currentUserId === undefined || currentUserId === null ? null : String(currentUserId)

  const handleCommentChange = useCallback((value: string) => {
    setCommentValue(value)
  }, [])

  const handleCommentSubmit = useCallback(async () => {
    if (isSubmitting) return

    const trimmed = commentValue.trim()
    if (trimmed.length === 0) {
      return
    }

    const success = await onSubmitComment({ content: trimmed })
    if (success) {
      setCommentValue('')
    }
  }, [commentValue, isSubmitting, onSubmitComment])

  const handleReplyToggle = useCallback((commentId: number) => {
    setActiveEditId(null)
    setReplyValue('')
    setReplyParentId((prev) => (prev === commentId ? null : commentId))
  }, [])

  const handleReplyChange = useCallback((value: string) => {
    setReplyValue(value)
  }, [])

  const handleReplyCancel = useCallback(() => {
    setReplyValue('')
    setReplyParentId(null)
  }, [])

  const handleReplySubmit = useCallback(async () => {
    if (isSubmitting || replyParentId === null) return

    const trimmed = replyValue.trim()
    if (trimmed.length === 0) {
      return
    }

    const success = await onSubmitComment({ content: trimmed, parentId: replyParentId })
    if (success) {
      setReplyValue('')
      setReplyParentId(null)
    }
  }, [isSubmitting, onSubmitComment, replyParentId, replyValue])

  const handleEditToggle = useCallback((comment: CommentTarget) => {
    setReplyParentId(null)
    setActiveEditId((prev) => {
      const next = prev === comment.id ? null : comment.id
      if (next) {
        setEditDrafts((drafts) => ({
          ...drafts,
          [comment.id]: drafts[comment.id] ?? comment.content,
        }))
      }
      return next
    })
  }, [])

  const handleEditChange = useCallback((commentId: number, value: string) => {
    setEditDrafts((prev) => ({ ...prev, [commentId]: value }))
  }, [])

  const handleEditCancel = useCallback((commentId: number) => {
    setEditDrafts((prev) => {
      const rest = { ...prev }
      delete rest[commentId]
      return rest
    })
    setActiveEditId(null)
  }, [])

  const handleEditSubmit = useCallback(
    async (comment: CommentTarget) => {
      if (isUpdating) return

      const draft = editDrafts[comment.id] ?? comment.content
      const trimmed = draft.trim()

      if (trimmed.length === 0) {
        return
      }

      const success = await onUpdateComment({
        commentId: comment.id,
        content: trimmed,
        parentId: comment.parentId ?? null,
      })

      if (success) {
        setEditDrafts((prev) => {
          const rest = { ...prev }
          delete rest[comment.id]
          return rest
        })
        setActiveEditId(null)
      }
    },
    [editDrafts, isUpdating, onUpdateComment],
  )

  const handleDeleteClick = useCallback((comment: CommentTarget) => {
    setDeleteTarget(comment)
  }, [])

  const handleDeleteCancel = useCallback(() => {
    setDeleteTarget(null)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget || isDeleting) return

    const success = await onDeleteComment({
      commentId: deleteTarget.id,
      parentId: deleteTarget.parentId ?? null,
    })

    if (success) {
      setDeleteTarget(null)
    }
  }, [deleteTarget, isDeleting, onDeleteComment])

  const isOwnComment = useCallback(
    (writerId: number | string): boolean => {
      if (normalizedUserId === null) {
        return false
      }

      return String(writerId) === normalizedUserId
    },
    [normalizedUserId],
  )

  return {
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
    isUpdating,
    isDeleting,
    deleteTarget,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    isOwnComment,
  }
}
