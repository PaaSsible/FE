import { useState } from 'react'
// import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

import Button from '@/components/atoms/Button'
import Modal from '@/components/common/Modal'
import PostEditorSection from '@/components/feature/boards/boardNew/PostEditorSection'
import RecruitInfoSection from '@/components/feature/boards/boardNew/RecruitInfoSection'
import { useBoardFormStore } from '@/stores/boardFormStore'

export default function BoardNewPage() {
  const navigate = useNavigate()
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isRecruitInfoValid, setIsRecruitInfoValid] = useState(false)
  const [errors, setErrors] = useState({
    title: false,
    recruitInfo: false,
  })

  const { mainCategory, subCategory, title, content, deadline, projectDuration, recruitment } =
    useBoardFormStore()

  const handleRegisterClick = () => {
    const newErrors = {
      title: !title.trim(),
      recruitInfo: !isRecruitInfoValid,
    }

    setErrors(newErrors)

    const isAllValid = Object.values(newErrors).every((v) => !v)
    if (isAllValid) {
      setIsRegisterModalOpen(true)
    } else {
      console.warn('입력되지 않은 필드가 있습니다.')
    }
  }

  const handleConfirmRegister = () => {
    const payload = {
      mainCategory,
      subCategory,
      title,
      content,
      deadline: deadline ? deadline.toISOString().split('T')[0] : null, // yyyy-MM-dd 형식
      projectDuration,
      recruitment: recruitment.map((r) => ({
        position: r.position,
        stacks: r.stacks,
      })),
    }

    console.log('모집글 등록 payload:', payload)

    setIsRegisterModalOpen(false)

    // toast.success('모집글이 등록되었습니다.')
  }

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto px-[144px] py-[44px] text-start">
      <RecruitInfoSection
        showErrors={errors.recruitInfo}
        onValidityChange={setIsRecruitInfoValid}
      />
      <PostEditorSection showErrors={errors.title} />

      <div className="mt-10 flex gap-3 self-end">
        <Button variant="secondary" onClick={() => setIsCancelModalOpen(true)}>
          작성 취소
        </Button>
        <Button onClick={handleRegisterClick}>등록하기</Button>
      </div>

      <Modal
        isOpen={isCancelModalOpen}
        title="작성 내용을 취소하시겠어요?"
        description={
          <div className="mb-6">
            작성 중인 내용은 저장되지 않습니다.
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
        title="모집글을 등록하시겠어요?"
        description={
          <div className="mb-6">
            입력한 내용으로 모집글이 게시됩니다.
            <br />
            등록 후에 모집 기본 정보는 수정이 불가능합니다.
          </div>
        }
        cancelLabel="마저 작성하기"
        confirmLabel="등록하기"
        onCancel={() => setIsRegisterModalOpen(false)}
        onConfirm={handleConfirmRegister}
      />
    </div>
  )
}
