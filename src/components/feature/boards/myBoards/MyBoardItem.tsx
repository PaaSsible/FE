import { Eye, File } from 'lucide-react'
import { useState } from 'react'

import { Tag } from '@/components/atoms/Tag'
import Modal from '@/components/common/Modal'

import BoardActionButtons from './BoardActionButtons'

interface MyBoardItemProps {
  postId: number
  title: string
  createdAt: string
  deadline: string
  position: string
  tags: string[]
  views: number
  applicants: number
  onDelete: (postId: number) => void
}

export default function MyBoardItem({
  postId,
  title,
  createdAt,
  deadline,
  position,
  tags,
  views,
  applicants,
  onDelete,
}: MyBoardItemProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false)
    onDelete(postId)
  }

  return (
    <>
      <div className="flex w-full items-center justify-between bg-gray-100 px-[25px] py-4">
        <div className="flex flex-col gap-[19px]">
          <div className="flex flex-col gap-[7px]">
            <h3 className="text-b5-bold text-gray-850">{title}</h3>
            <p className="text-l1-medium flex gap-[7px] text-gray-600">
              {createdAt} <span className="text-gray-400">·</span> 모집 마감일: {deadline}{' '}
              <span className="text-gray-400">·</span> 모집 포지션: {position}
            </p>
          </div>
          <div className="flex flex-wrap gap-[5px]">
            {tags.map((tag, i) => (
              <Tag key={`${tag}-${i}`} label={tag} size="sm" />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end justify-between gap-[31px]">
          <div className="text-l1-medium flex items-center gap-[17px] text-gray-600">
            <div className="flex gap-[10px]" aria-label={`조회수 ${views}`}>
              <Eye className="h-6 w-6" /> {views}
            </div>
            <div className="flex gap-[10px]" aria-label={`지원자수 ${applicants}`}>
              <File className="h-6 w-6" /> {applicants}
            </div>
          </div>

          <BoardActionButtons postId={postId} onDeleteClick={() => setIsDeleteModalOpen(true)} />
        </div>
      </div>

      {/* 삭제 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="모집글을 삭제하시겠어요?"
        description={
          <>
            삭제한 모집글은 복구할 수 없습니다.
            <br />
            정말 삭제하시겠습니까?
          </>
        }
        cancelLabel="취소"
        confirmLabel="삭제하기"
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
