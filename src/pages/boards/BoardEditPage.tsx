import { useState, type JSX } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/atoms/Button'
import Modal from '@/components/common/Modal'
import EditEditorSection from '@/components/feature/boards/boardEdit/EditEditorSection'

export default function BoardEditPage(): JSX.Element {
  const navigate = useNavigate()
  const [error] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)

  const handleEditClick = () => {}

  const handleConfirmRegister = () => {}

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto px-[144px] py-[44px] text-start">
      <EditEditorSection showErrors={error} />

      <div className="mt-10 flex gap-3 self-end">
        <Button variant="secondary" onClick={() => setIsCancelModalOpen(true)}>
          작성 취소
        </Button>
        <Button onClick={handleEditClick}>수정하기</Button>
      </div>

      <Modal
        isOpen={isCancelModalOpen}
        title="수정을 취소하시겠어요?"
        description={
          <div className="mb-6">
            변경된 내용은 저장되지 않습니다.
            <br />
            그래도 나가시겠어요?
          </div>
        }
        cancelLabel="작성 취소하기"
        confirmLabel="계속 작성하기"
        onCancel={() => void navigate('/boards')}
        onConfirm={() => setIsCancelModalOpen(false)}
      />
      <Modal
        isOpen={isRegisterModalOpen}
        title="수정된 내용으로 모집글을 등록하시겠어요?"
        description={
          <div className="mb-6">
            변경 사항이 즉시 적용되며, 이전 내용은 복구할 수 없습니다.
            <br />
            계속 진행하시겠습니까?
          </div>
        }
        cancelLabel="취소"
        confirmLabel="등록하기"
        onCancel={() => setIsRegisterModalOpen(false)}
        onConfirm={handleConfirmRegister}
      />
    </div>
  )
}
