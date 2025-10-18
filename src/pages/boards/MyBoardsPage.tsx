import Modal from '@/components/common/Modal'
import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
import MyBoardList from '@/components/feature/boards/myBoards/MyBoardList'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function MyBoardsPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleBackClick = () => {
    window.history.back()
  }

  const handleConfirm = () => {
    setIsDeleteModalOpen(false)
    toast.success('모집글이 삭제되었습니다.')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] py-[44px] text-start">
      {/* 상단 헤더 */}
      <BoardsPageHeader title="내 모집글 관리" onBackClick={handleBackClick} />

      <div className="mt-10">
        <MyBoardList onDeleteBoard={() => setIsDeleteModalOpen(true)} />
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        title="모집글을 삭제하시겠어요?"
        description={
          <div className="mb-6">
            삭제한 모집글은 복구할 수 없습니다.
            <br />
            정말 삭제하시겠습니까?
          </div>
        }
        cancelLabel="삭제하기"
        confirmLabel="취소"
        onCancel={handleConfirm}
        onConfirm={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}
