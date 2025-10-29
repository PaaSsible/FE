'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import type ReactQuill from 'react-quill-new'
import { useLocation, useNavigate } from 'react-router-dom'

import { postUserPortfolio, postUserUpload } from '@/apis/user.api'
import Button from '@/components/atoms/Button'
import Dropdown from '@/components/atoms/Dropdown'
import TextEditor from '@/components/common/TextEditor'
import { MypageHeader } from '@/components/feature/mypage/MypageHeader'
import { useUpdateUserPortfolio } from '@/hooks/mypage/useUpdateUserPortfolio'
import { useUserPortfolioDetail } from '@/hooks/mypage/useUserPortfolioDetail'
import { positionsArray } from '@/types/entities/recruit-post/recruitPost.schemas'

type PortfolioRouteState = {
  editId?: number
}

export default function MypagePortfolioNewPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: PortfolioRouteState }
  const editorRef = useRef<ReactQuill>(null)

  const editId = location.state?.editId ?? null
  const isEditMode = Boolean(editId)

  const [title, setTitle] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null)
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const {
    data: portfolioDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useUserPortfolioDetail({
    portfolioId: editId,
    enabled: isEditMode,
  })

  const { updatePortfolio, isSubmitting: isUpdating } = useUpdateUserPortfolio()

  useEffect(() => {
    if (!isEditMode || !portfolioDetail) return

    setTitle(portfolioDetail.title ?? '')
    setSummary(portfolioDetail.summary ?? '')
    setContent(portfolioDetail.description ?? '')

    const detailPositionId =
      typeof portfolioDetail.positionId === 'number' && portfolioDetail.positionId > 0
        ? portfolioDetail.positionId
        : null
    const positionNameIndex = portfolioDetail.positionName
      ? positionsArray.findIndex((position) => position === portfolioDetail.positionName)
      : -1

    if (detailPositionId && detailPositionId <= positionsArray.length) {
      setSelectedPosition(positionsArray[detailPositionId - 1])
      setSelectedPositionId(detailPositionId)
    } else if (positionNameIndex >= 0) {
      setSelectedPosition(positionsArray[positionNameIndex])
      setSelectedPositionId(positionNameIndex + 1)
    } else {
      setSelectedPosition(portfolioDetail.positionName ?? null)
      setSelectedPositionId(null)
    }
  }, [isEditMode, portfolioDetail])

  useEffect(() => {
    if (!isEditMode || !isDetailError) return

    toast.error('포트폴리오 정보를 불러오지 못했습니다.')
    void navigate('/mypage/portfolio')
  }, [isDetailError, isEditMode, navigate])

  const handleCancel = () => {
    void navigate('/mypage/portfolio')
  }

  const isSubmitDisabled =
    isUploading ||
    isCreating ||
    isUpdating ||
    (isEditMode && isDetailLoading) ||
    !title.trim() ||
    !selectedPositionId ||
    !content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()

  const handleSubmit = async () => {
    if (isSubmitDisabled) return

    const trimmedTitle = title.trim()
    const plainContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()

    if (!trimmedTitle) {
      toast.error('제목을 입력해 주세요.')
      return
    }

    if (!selectedPositionId || selectedPositionId <= 0) {
      toast.error('포지션을 선택해 주세요.')
      return
    }

    if (!plainContent) {
      toast.error('본문을 작성해 주세요.')
      return
    }

    const normalizedSummary = summary.trim()
    const payload = {
      positionId: selectedPositionId,
      title: trimmedTitle,
      summary: normalizedSummary ? normalizedSummary : null,
      description: content,
    }

    try {
      if (isEditMode) {
        if (editId === null) {
          throw new Error('수정할 포트폴리오 정보를 찾지 못했습니다.')
        }

        await updatePortfolio({
          portfolioId: editId,
          ...payload,
        })

        toast.success('포트폴리오가 수정되었습니다.')
      } else {
        setIsCreating(true)
        const response = await postUserPortfolio(payload)

        if (!response.success) {
          throw new Error(response.message ?? '포트폴리오 등록에 실패했습니다.')
        }

        toast.success('포트폴리오가 등록되었습니다.')
      }

      void navigate('/mypage/portfolio')
    } catch (error) {
      const message = error instanceof Error ? error.message : '처리 중 오류가 발생했습니다.'
      toast.error(message)
      console.error(error)
    } finally {
      if (!isEditMode) {
        setIsCreating(false)
      }
    }
  }

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (isUploading) {
        throw new Error('업로드가 진행 중입니다. 잠시 후 다시 시도해 주세요.')
      }

      const formData = new FormData()
      formData.append('file', file)

      try {
        setIsUploading(true)

        const uploadResponse = await postUserUpload(formData)
        if (!uploadResponse.success) {
          throw new Error(uploadResponse.message ?? '파일 업로드에 실패했습니다.')
        }

        const fileUrl =
          typeof uploadResponse.data === 'object' && uploadResponse.data !== null
            ? (uploadResponse.data as { url?: string }).url
            : undefined

        if (!fileUrl) {
          throw new Error('업로드 결과에서 파일 경로를 찾을 수 없습니다.')
        }

        toast.success('이미지가 본문에 삽입되었습니다.')
        return fileUrl
      } catch (error) {
        const message =
          error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.'
        toast.error(message)
        console.error(error)
        throw error
      } finally {
        setIsUploading(false)
      }
    },
    [isUploading],
  )

  if (isEditMode && isDetailLoading && !portfolioDetail) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] text-start">
        <MypageHeader title="포트폴리오 수정" />

        <div className="flex flex-1 items-center justify-center text-gray-500">
          포트폴리오를 불러오는 중입니다...
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] text-start">
      <MypageHeader title={isEditMode ? '포트폴리오 수정' : '포트폴리오 작성'} />

      <section className="flex flex-1 flex-col">
        <div className="flex flex-col gap-[38px]">
          <div className="mt-6 flex flex-col gap-[13px]">
            <label htmlFor="portfolio-title" className="text-b2-medium text-gray-900">
              제목
            </label>
            <input
              id="portfolio-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력해 주세요."
              className="text-b4-medium w-full rounded-lg bg-gray-200 px-5 py-[14px] placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-[25%_75%] gap-[13px]">
            <div className="flex flex-col gap-3">
              <span className="text-b2-medium text-gray-900">포지션</span>
              <Dropdown
                placeholder="포지션"
                options={positionsArray}
                onSelect={(value) => {
                  setSelectedPosition(value)
                  const index = positionsArray.findIndex((position) => position === value)
                  setSelectedPositionId(index >= 0 ? index + 1 : null)
                }}
                value={selectedPosition}
                variant="form"
                disabled={isDetailLoading}
              />
            </div>

            <div className="flex flex-1 flex-col gap-[13px]">
              <label htmlFor="portfolio-summary" className="text-b2-medium text-gray-900">
                간단한 설명
              </label>
              <input
                id="portfolio-summary"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="간략하게 작성해 주세요."
                className="text-b4-medium w-full rounded-lg bg-gray-200 px-5 py-[14px] placeholder:text-gray-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-10 flex flex-col gap-[13px]">
            <span className="text-b2-medium text-gray-900">본문</span>
            <TextEditor
              ref={editorRef}
              value={content}
              onChange={(value) => setContent(value)}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-[9px]">
          <Button variant="secondary" onClick={handleCancel}>
            {isEditMode ? '수정 취소' : '작성 취소'}
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={isSubmitDisabled}>
            {isEditMode ? '수정 완료' : '등록하기'}
          </Button>
        </div>
      </section>
    </div>
  )
}
