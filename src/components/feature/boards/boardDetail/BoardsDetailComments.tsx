import { MessageCircle, Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import Avatar from '@/components/atoms/Avatar'
import Modal from '@/components/common/Modal'

import CommentTextareaPanel from './CommentTextareaPanel'

interface CommentBase {
  id: number
  author: string
  content: string
  createdAt: string
}

interface Comment extends CommentBase {
  replies?: CommentBase[]
}

interface Props {
  comments: Comment[]
}

export default function BoardsDetailComments({ comments }: Props) {
  const [commentValue, setCommentValue] = useState('')
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null)
  const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({})
  const [activeEditId, setActiveEditId] = useState<number | null>(null)
  const [editDrafts, setEditDrafts] = useState<Record<number, string>>({})
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null)

  const totalComments = useMemo(
    () => comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length ?? 0), 0),
    [comments],
  )

  const currentUserName = '이윤지'

  const handleReplyToggle = (commentId: number) => {
    setActiveEditId(null)
    setActiveReplyId((prev) => (prev === commentId ? null : commentId))
  }

  const handleEditToggle = (comment: Comment) => {
    setActiveReplyId(null)
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
  }

  const handleReplyChange = (commentId: number, value: string) => {
    setReplyDrafts((prev) => ({ ...prev, [commentId]: value }))
  }

  const handleReplyCancel = (commentId: number) => {
    setReplyDrafts((prev) => {
      const { [commentId]: _, ...rest } = prev
      return rest
    })
    setActiveReplyId(null)
  }

  const handleEditChange = (commentId: number, value: string) => {
    setEditDrafts((prev) => ({ ...prev, [commentId]: value }))
  }

  const handleEditCancel = (commentId: number) => {
    setEditDrafts((prev) => {
      const { [commentId]: _, ...rest } = prev
      return rest
    })
    setActiveEditId(null)
  }

  const handleDeleteClick = (comment: Comment) => {
    setDeleteTarget(comment)
  }

  const handleDeleteCancel = () => {
    setDeleteTarget(null)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    toast.success('댓글이 삭제되었습니다.')
    setDeleteTarget(null)
  }

  return (
    <section className="mt-12">
      <h3 className="text-s2-bold flex items-baseline gap-2">
        댓글 <span className="text-s2-bold text-gray-600">{totalComments}</span>
      </h3>

      <div className="mt-8 flex items-center gap-2">
        <Avatar name={currentUserName} />
        <div className="text-b4-bold text-gray-900">{currentUserName}</div>
      </div>

      <CommentTextareaPanel
        value={commentValue}
        placeholder="댓글을 입력해 주세요."
        onChange={setCommentValue}
        onCancel={() => setCommentValue('')}
        onSubmit={() => {}}
        variant="primary"
        className="mt-4 mb-10"
      />

      <div className="h-[1.5px] bg-gray-200" />

      <div className="bg-gray-0 mt-10 rounded-md border border-[#E2E8F0]">
        {comments.map((comment, commentIdx) => {
          const isEditing = activeEditId === comment.id
          const editValue = editDrafts[comment.id] ?? comment.content

          return (
            <div key={comment.id}>
              <div className="flex gap-4 px-6 py-8">
                <Avatar name={comment.author} />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="text-b4-bold text-gray-900">{comment.author}</div>
                    <div className="flex items-center gap-4 text-gray-500">
                      <span className="text-l3-medium">{comment.createdAt}</span>
                      <button
                        type="button"
                        className="hover:text-gray-800"
                        onClick={() => handleReplyToggle(comment.id)}
                      >
                        <MessageCircle className="h-5 w-5" />
                      </button>
                      {comment.author === currentUserName && (
                        <>
                          <button
                            type="button"
                            className="hover:text-gray-800"
                            onClick={() => handleEditToggle(comment)}
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className="hover:text-gray-800"
                            onClick={() => handleDeleteClick(comment)}
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
                      placeholder="댓글을 수정해 주세요."
                      onChange={(value) => handleEditChange(comment.id, value)}
                      onCancel={() => handleEditCancel(comment.id)}
                      onSubmit={() => {}}
                      variant="nested"
                      className="mt-4"
                    />
                  ) : (
                    <p className="text-b4-medium text-gray-850 mt-3 leading-relaxed">
                      {comment.content}
                    </p>
                  )}

                  {comment.replies?.map((reply) => (
                    <div key={reply.id} className="mt-4 flex">
                      <div className="flex justify-center">
                        <div className="relative pt-1">
                          <div className="absolute top-2 left-0 h-[24px] w-[15px] border-b-[1.5px] border-l-[1.5px] border-gray-300" />
                        </div>
                      </div>
                      <div className="mt-3 flex-1">
                        <div className="flex gap-3 pl-8">
                          <Avatar name={reply.author} className="mt-[2px]" />
                          <div className="flex-1">
                            <div className="flex justify-between leading-8">
                              <div className="text-b4-bold text-gray-900">{reply.author}</div>
                              <div className="flex items-center gap-4 text-gray-500">
                                <span className="text-l3-medium">{reply.createdAt}</span>
                                {reply.author === currentUserName ? (
                                  <>
                                    <button
                                      type="button"
                                      className="hover:text-gray-800"
                                      onClick={() => handleEditToggle(reply as Comment)}
                                    >
                                      <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                      type="button"
                                      className="hover:text-gray-800"
                                      onClick={() => handleDeleteClick(reply as Comment)}
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </>
                                ) : null}
                              </div>
                            </div>
                            <p className="text-b4-medium text-gray-850 mt-3">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {activeReplyId === comment.id && (
                    <div className="mt-4 flex flex-col gap-4">
                      <div className="flex gap-8">
                        <div className="relative pt-1">
                          <div className="absolute top-2 left-0 h-[24px] w-[15px] border-b-[1.5px] border-l-[1.5px] border-gray-300" />
                        </div>
                        <div className="mt-3 flex items-center gap-3">
                          <Avatar name={currentUserName} />
                          <div className="text-b4-bold text-gray-900">{currentUserName}</div>
                        </div>
                      </div>
                      <div className="pl-8">
                        <CommentTextareaPanel
                          value={replyDrafts[comment.id] ?? ''}
                          placeholder="답글을 입력해 주세요."
                          onChange={(value) => handleReplyChange(comment.id, value)}
                          onCancel={() => handleReplyCancel(comment.id)}
                          onSubmit={() => {}}
                          variant="nested"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {commentIdx !== comments.length - 1 && <div className="mx-6 h-px bg-gray-200" />}
            </div>
          )
        })}
      </div>

      <Modal
        isOpen={deleteTarget !== null}
        title="댓글을 삭제하시겠어요?"
        description="삭제한 댓글은 복구할 수 없습니다."
        cancelLabel="삭제하기"
        confirmLabel="취소"
        onCancel={handleDeleteConfirm}
        onConfirm={handleDeleteCancel}
      />
      {/* <Modal
        isOpen={deleteTarget !== null}
        title="답글을 삭제하시겠어요?"
        description="삭제한 답글은 복구할 수 없습니다."
        cancelLabel="삭제하기"
        confirmLabel="취소"
        onCancel={handleDeleteConfirm}
        onConfirm={handleDeleteCancel}
      /> */}
    </section>
  )
}
