import { useState, type JSX } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/atoms/Button'
import Modal from '@/components/common/Modal'
import PostEditorSection from '@/components/feature/boards/boardNew/PostEditorSection'
import RecruitInfoSection from '@/components/feature/boards/boardNew/RecruitInfoSection'
import useCreateRecruit from '@/hooks/useCreateRecruit'
import { useBoardFormStore } from '@/stores/boardFormStore'

export default function BoardNewPage(): JSX.Element {
  const navigate = useNavigate()
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isRecruitInfoValid, setIsRecruitInfoValid] = useState(false)
  const [errors, setErrors] = useState({
    title: false,
    content: false,
    recruitInfo: false,
  })

  const {
    mainCategory,
    subCategory,
    title,
    content,
    deadline,
    projectDuration,
    recruitment,
    reset,
  } = useBoardFormStore()
  const { createRecruit, isSubmitting } = useCreateRecruit()

  const handleRegisterClick = () => {
    const plainContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()
    const newErrors = {
      title: !title.trim(),
      content: plainContent.length === 0,
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

  const handleConfirmRegister = async () => {
    if (!deadline || !projectDuration) {
      setIsRegisterModalOpen(false)
      return
    }

    try {
      const response = await createRecruit({
        mainCategory,
        subCategory,
        title,
        content,
        deadline,
        projectDuration,
        recruitment,
      })
      const postId = response.data.postId

      toast.success('모집글이 등록되었습니다.')
      reset()
      setIsRegisterModalOpen(false)
      if (typeof postId === 'number') {
        void navigate(`/boards/${postId}`)
      } else {
        void navigate('/boards')
      }
    } catch (error) {
      console.error('Failed to register recruit post', error)
      toast.error(error instanceof Error ? error.message : '모집글 등록에 실패했습니다.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto px-[144px] py-[44px] text-start">
      <RecruitInfoSection
        showErrors={errors.recruitInfo}
        onValidityChange={setIsRecruitInfoValid}
      />
      <PostEditorSection showTitleError={errors.title} showContentError={errors.content} />

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
          <p>
            작성 중인 내용은 저장되지 않습니다.
            <br />
            그래도 나가시겠어요?
          </p>
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
          <p>
            입력한 내용으로 모집글이 게시됩니다.
            <br />
            등록 후에 모집 기본 정보는 수정이 불가능합니다.
          </p>
        }
        cancelLabel="마저 작성하기"
        confirmLabel="등록하기"
        onCancel={() => setIsRegisterModalOpen(false)}
        onConfirm={() => {
          void handleConfirmRegister()
        }}
        confirmDisabled={isSubmitting}
        cancelDisabled={isSubmitting}
      />
    </div>
  )
}
