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
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!isEditMode) return

    // TODO: 상세 조회 API 연결 시 교체
    const mockData = {
      title: '포트폴리오 예시 제목',
      positionName: '프론트엔드 개발자',
      summary: '이건 수정 모드에서 불러온 간략한 설명입니다.',
      description: '<p>수정 모드에서 불러온 본문 내용입니다.</p>',
    }

    setTitle(mockData.title)
    setSelectedPosition(mockData.positionName)
    setSummary(mockData.summary)
    setContent(mockData.description)
  }, [isEditMode])

  const handleCancel = () => {
    void navigate('/mypage/portfolio')
  }

  const handleSubmit = async () => {
    if (isSubmitting || isUploading) return

    const trimmedTitle = title.trim()
    const plainContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()

    if (!trimmedTitle) {
      toast.error('제목을 입력해 주세요.')
      return
    }

    if (!selectedPosition) {
      toast.error('포지션을 선택해 주세요.')
      return
    }

    if (!plainContent) {
      toast.error('본문을 작성해 주세요.')
      return
    }

    const positionIndex = positionsArray.findIndex((position) => position === selectedPosition)
    if (positionIndex < 0) {
      toast.error('선택한 포지션 정보를 확인해 주세요.')
      return
    }

    const payload = {
      positionId: positionIndex + 1,
      title: trimmedTitle,
      summary: summary.trim() || null,
      description: content,
    }

    try {
      setIsSubmitting(true)
      const response = await postUserPortfolio(payload)

      if (!response.success) {
        throw new Error(response.message ?? '포트폴리오 등록에 실패했습니다.')
      }

      toast.success(isEditMode ? '포트폴리오가 수정되었습니다.' : '포트폴리오가 등록되었습니다.')
      void navigate('/mypage/portfolio')
    } catch (error) {
      const message = error instanceof Error ? error.message : '처리 중 오류가 발생했습니다.'
      toast.error(message)
      console.error(error)
    } finally {
      setIsSubmitting(false)
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

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] py-[44px] text-start">
      <MypageHeader title={isEditMode ? '포트폴리오 수정' : '포트폴리오 작성'} />

      <section className="flex flex-1 flex-col">
        <div className="flex flex-col gap-8">
          <div className="mt-6 flex flex-col gap-3">
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

          <div className="grid grid-cols-[25%_75%] gap-3">
            <div className="flex flex-col gap-3">
              <span className="text-b2-medium text-gray-900">포지션</span>
              <Dropdown
                placeholder="포지션"
                options={positionsArray}
                onSelect={(value) => setSelectedPosition(value)}
                variant="form"
              />
            </div>

            <div className="flex flex-1 flex-col gap-3">
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

          <div className="mb-10 flex flex-col gap-3">
            <span className="text-b2-medium text-gray-900">본문</span>
            <TextEditor
              ref={editorRef}
              value={content}
              onChange={(value) => setContent(value)}
              onImageUpload={handleImageUpload}
            />
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <Button variant="secondary" onClick={handleCancel}>
            {isEditMode ? '수정 취소' : '작성 취소'}
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={isSubmitting || isUploading}>
            {isEditMode ? '수정 완료' : '등록하기'}
          </Button>
        </div>
      </section>
    </div>
  )
}
