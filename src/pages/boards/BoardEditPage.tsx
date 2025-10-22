import { useEffect, useMemo, useState, type JSX } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

import Button from '@/components/atoms/Button'
import Modal from '@/components/common/Modal'
import EditEditorSection from '@/components/feature/boards/boardEdit/EditEditorSection'
import useRecruitDetail from '@/hooks/boards/useRecruitDetail'
import useUpdateRecruit from '@/hooks/boards/useUpdateRecruit'
import { useBoardFormStore } from '@/stores/boardFormStore'
import { positionsArray, stacksArray } from '@/types/entities/recruit-post/recruitPost.schemas'

export default function BoardEditPage(): JSX.Element {
  const normalizeDeadline = (value: string | null | undefined): string | null => {
    if (!value) return null
    const trimmed = value.trim()
    if (!trimmed) return null
    if (trimmed.includes('T')) {
      const [datePart] = trimmed.split('T')
      return datePart ?? null
    }
    return trimmed
  }

  const getPositionIdFromValue = (value: unknown): number | null => {
    if (typeof value === 'number' && Number.isInteger(value)) {
      return value
    }

    const numeric = Number(value)
    if (!Number.isNaN(numeric) && Number.isInteger(numeric)) {
      return numeric
    }

    if (typeof value === 'string') {
      const index = positionsArray.findIndex((label) => label === value)
      if (index !== -1) {
        return index + 1
      }
    }

    return null
  }

  const getStackIdsFromValue = (value: unknown): number[] => {
    if (!Array.isArray(value)) {
      return []
    }

    return value
      .map((stack) => {
        if (typeof stack === 'number' && Number.isInteger(stack)) {
          return stack
        }

        const numeric = Number(stack)
        if (!Number.isNaN(numeric) && Number.isInteger(numeric)) {
          return numeric
        }

        if (typeof stack === 'string') {
          const index = stacksArray.findIndex((label) => label === stack)
          if (index !== -1) {
            return index + 1
          }
        }

        return null
      })
      .filter((stackId): stackId is number => stackId !== null)
  }

  const normalizeRecruits = (recruits: unknown): Array<{ position: number; stacks: number[] }> => {
    if (!Array.isArray(recruits)) {
      return []
    }

    return recruits
      .map((recruit) => {
        if (
          typeof recruit !== 'object' ||
          recruit === null ||
          !('position' in recruit) ||
          !('stacks' in recruit)
        ) {
          return null
        }

        const rawPosition = (recruit as { position: unknown }).position
        const positionId = getPositionIdFromValue(rawPosition)
        if (positionId === null) {
          return null
        }

        const rawStacks = (recruit as { stacks: unknown }).stacks
        const stackIds = getStackIdsFromValue(rawStacks)

        return {
          position: positionId,
          stacks: stackIds,
        }
      })
      .filter((recruit): recruit is { position: number; stacks: number[] } => recruit !== null)
  }

  const navigate = useNavigate()
  const { postId: postIdParam } = useParams<{ postId: string }>()
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [errors, setErrors] = useState({
    title: false,
    content: false,
  })

  const numericPostId = useMemo(() => {
    if (!postIdParam) return null

    const parsed = Number(postIdParam)
    return Number.isNaN(parsed) ? null : parsed
  }, [postIdParam])

  const title = useBoardFormStore((state) => state.title)
  const content = useBoardFormStore((state) => state.content)
  const reset = useBoardFormStore((state) => state.reset)
  const setTitle = useBoardFormStore((state) => state.setTitle)
  const setContent = useBoardFormStore((state) => state.setContent)

  const { data: recruitDetail, isLoading, error } = useRecruitDetail(numericPostId)
  const { updateRecruit, isSubmitting } = useUpdateRecruit()

  useEffect(() => {
    reset()
    return () => {
      reset()
    }
  }, [reset])

  useEffect(() => {
    if (!recruitDetail) {
      return
    }

    setTitle(recruitDetail.title ?? '')
    setContent(recruitDetail.content ?? '')
  }, [recruitDetail, setContent, setTitle])

  const handleSubmitClick = () => {
    const plainContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()

    const newErrors = {
      title: !title.trim(),
      content: plainContent.length === 0,
    }

    setErrors(newErrors)

    const isValid = Object.values(newErrors).every((value) => !value)
    if (!isValid) {
      toast.error('제목과 본문을 모두 입력해 주세요.')
      return
    }

    setIsSubmitModalOpen(true)
  }

  const handleConfirmUpdate = async () => {
    if (!numericPostId || !recruitDetail) {
      toast.error('유효하지 않은 모집글입니다.')
      setIsSubmitModalOpen(false)
      return
    }

    const { mainCategory, subCategory, deadline, projectDuration, recruits } = recruitDetail
    const deadlineForUpdate = normalizeDeadline(deadline)
    const recruitsForUpdate = normalizeRecruits(recruits)

    if (!mainCategory || !subCategory || !deadlineForUpdate || !projectDuration) {
      toast.error('모집글 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')
      setIsSubmitModalOpen(false)
      return
    }

    try {
      await updateRecruit({
        postId: numericPostId,
        mainCategory,
        subCategory,
        title,
        content,
        deadline: deadlineForUpdate,
        projectDuration,
        recruits: recruitsForUpdate,
      })
      toast.success('모집글이 수정되었습니다.')
      setIsSubmitModalOpen(false)
      reset()
      void navigate(`/boards/${numericPostId}`)
    } catch (updateError) {
      console.error('Failed to update recruit post', updateError)
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : '모집글 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      )
      setIsSubmitModalOpen(false)
    }
  }

  const handleCancelConfirm = () => {
    setIsCancelModalOpen(false)
    if (numericPostId) {
      void navigate(`/boards/${numericPostId}`)
    } else {
      void navigate('/boards')
    }
  }

  const canRenderEditor = !isLoading && !error && recruitDetail !== null

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto px-[144px] py-[44px] text-start">
      {isLoading && (
        <div className="text-b4-medium mt-20 text-center text-gray-600">
          모집글을 불러오는 중입니다.
        </div>
      )}

      {!isLoading && error && (
        <div className="text-b4-medium mt-20 rounded-md bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && recruitDetail === null && (
        <div className="text-b4-medium mt-20 text-center text-gray-600">
          수정할 모집글을 찾지 못했습니다.
        </div>
      )}

      {canRenderEditor && (
        <>
          <EditEditorSection showTitleError={errors.title} showContentError={errors.content} />

          <div className="mt-10 flex gap-3 self-end">
            <Button variant="secondary" onClick={() => setIsCancelModalOpen(true)}>
              작성 취소
            </Button>
            <Button onClick={handleSubmitClick}>수정하기</Button>
          </div>
        </>
      )}

      <Modal
        isOpen={isCancelModalOpen}
        title="수정을 취소하시겠어요?"
        description={
          <div>
            변경된 내용은 저장되지 않습니다.
            <br />
            그래도 나가시겠어요?
          </div>
        }
        cancelLabel="작성 취소하기"
        confirmLabel="계속 작성하기"
        onCancel={handleCancelConfirm}
        onConfirm={() => setIsCancelModalOpen(false)}
      />
      <Modal
        isOpen={isSubmitModalOpen}
        title="수정된 내용으로 모집글을 등록하시겠어요?"
        description={
          <div>
            변경 사항이 즉시 적용되며, 이전 내용은 복구할 수 없습니다.
            <br />
            계속 진행하시겠습니까?
          </div>
        }
        cancelLabel="취소"
        confirmLabel="등록하기"
        onCancel={() => setIsSubmitModalOpen(false)}
        onConfirm={() => {
          void handleConfirmUpdate()
        }}
        confirmDisabled={isSubmitting}
        cancelDisabled={isSubmitting}
      />
    </div>
  )
}
