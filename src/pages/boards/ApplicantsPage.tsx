'use client'

import clsx from 'clsx'
import { Folder } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import Modal from '@/components/common/Modal'
import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
import ApplicantItem from '@/components/feature/boards/applicants/ApplicantItem'
import useAcceptRecruitApplicant from '@/hooks/boards/useAcceptRecruitApplicant'
import useBoardList from '@/hooks/boards/useBoardList'
import useRecruitApplicants from '@/hooks/boards/useRecruitApplicants'
import useRejectRecruitApplicant from '@/hooks/boards/useRejectRecruitApplicant'
import type { GetRecruitApplicants } from '@/types/apis/recruit/recruit.api.types'

type Applicant = GetRecruitApplicants['Response']['data'][number]

export default function ApplicantsPage() {
  const { postId: postIdParam } = useParams<{ postId: string }>()
  const [selectedAcceptApplicant, setSelectedAcceptApplicant] = useState<Applicant | null>(null)
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null)
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<Applicant | null>(null)
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false)
  const [isRejectReasonOpen, setIsRejectReasonOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const MAX = 500
  const resetRejectFlow = () => {
    setRejectTarget(null)
    setRejectReason('')
    setIsRejectConfirmOpen(false)
    setIsRejectReasonOpen(false)
  }

  const postId = useMemo(() => {
    if (!postIdParam) return null
    const parsed = Number(postIdParam)
    return Number.isNaN(parsed) ? NaN : parsed
  }, [postIdParam])

  const {
    applicants,
    isLoading,
    error: applicantsError,
    refetch: refetchApplicants,
  } = useRecruitApplicants(postId)
  const {
    boards,
    isLoading: isBoardLoading,
    error: boardError,
    refetch: refetchBoards,
  } = useBoardList()
  const { acceptApplicant, isAccepting } = useAcceptRecruitApplicant({
    onSuccess: () => {
      toast.success('지원자를 수락했습니다.')
      setIsAcceptModalOpen(false)
      setSelectedAcceptApplicant(null)
      setSelectedBoardId(null)
      refetchApplicants()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
  const { rejectApplicant, isRejecting } = useRejectRecruitApplicant({
    onSuccess: () => {
      toast.success('지원자를 거절했습니다.')
      resetRejectFlow()
      refetchApplicants()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const handleBackClick = () => {
    window.history.back()
  }

  const handleAcceptClick = (applicant: Applicant) => {
    setSelectedAcceptApplicant(applicant)
    setSelectedBoardId(null)
    setIsAcceptModalOpen(true)
  }

  const handleBoardSelect = (boardId: number) => {
    setSelectedBoardId(boardId)
  }

  const handleRejectClick = (applicant: Applicant) => {
    setRejectTarget(applicant)
    setRejectReason('')
    setIsRejectConfirmOpen(true)
  }

  const handleCancelReject = () => {
    if (isRejecting) {
      return
    }

    resetRejectFlow()
  }

  const handleProceedReject = () => {
    if (!rejectTarget) {
      toast.error('선택된 지원자가 없습니다.')
      resetRejectFlow()
      return
    }

    setIsRejectConfirmOpen(false)
    setIsRejectReasonOpen(true)
  }

  const handleSubmitRejectReason = async () => {
    if (!rejectTarget) {
      toast.error('선택된 지원자가 없습니다.')
      return
    }

    if (!rejectReason.trim()) {
      toast.error('거절 이유를 입력해 주세요.')
      return
    }

    await rejectApplicant(postId, rejectTarget.id, rejectReason.trim())
  }

  const closeAcceptModal = () => {
    if (isAccepting) {
      return
    }

    setIsAcceptModalOpen(false)
    setSelectedAcceptApplicant(null)
    setSelectedBoardId(null)
  }

  const handleConfirmAccept = async () => {
    if (!selectedAcceptApplicant) {
      toast.error('선택된 지원자가 없습니다.')
      return
    }

    if (!selectedBoardId) {
      toast.error('프로젝트 보드를 선택해 주세요.')
      return
    }

    await acceptApplicant(postId, selectedAcceptApplicant.id, selectedBoardId)
  }

  const hasApplicants = applicants.length > 0
  const hasBoards = boards.length > 0

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] py-[44px] text-start">
      <BoardsPageHeader
        title="지원자 확인"
        onBackClick={handleBackClick}
        count={applicants.length}
      />

      <div className="mt-10 flex flex-1 flex-col">
        {isLoading ? (
          <div className="text-b2-medium flex flex-1 items-center justify-center text-gray-500">
            지원자 정보를 불러오는 중입니다...
          </div>
        ) : applicantsError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-s1-bold text-gray-1000">지원자 정보를 가져오지 못했어요.</h2>
            <p className="text-b2-medium text-gray-500">{applicantsError}</p>
          </div>
        ) : hasApplicants ? (
          <div className="flex flex-col gap-5">
            {applicants.map((applicant) => (
              <ApplicantItem
                key={applicant.id}
                applicant={applicant}
                onAcceptClick={handleAcceptClick}
                onRejectClick={handleRejectClick}
                isAccepting={isAccepting && selectedAcceptApplicant?.id === applicant.id}
                isRejecting={isRejecting && rejectTarget?.id === applicant.id}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-7">
            <h2 className="text-s1-bold text-gray-1000">지원자가 없습니다.</h2>
            <p className="text-b2-medium text-gray-500">
              아직 지원자가 없습니다. 새로운 팀원을 기다려 보세요!
            </p>
          </div>
        )}
      </div>
      <Modal
        isOpen={isRejectConfirmOpen}
        title="해당 지원자를 거절하시겠어요?"
        description="거절 시 지원자에게 거절 알림이 발송되며, 다시 되돌릴 수 없습니다."
        cancelLabel="취소"
        confirmLabel="거절하기"
        onCancel={handleCancelReject}
        onConfirm={handleProceedReject}
        cancelDisabled={isRejecting}
        confirmDisabled={isRejecting}
      />
      <Modal
        isOpen={isRejectReasonOpen}
        title="거절 이유를 작성해 주세요."
        description={
          <div className="flex flex-col gap-[17px]">
            <p>지원자에게 전달할 거절 이유를 작성해 주세요.</p>
            <div className="-mb-3">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value.slice(0, MAX))}
                placeholder="거절 이유 입력하기"
                className="text-b4-medium h-[118px] w-full resize-none rounded-xl bg-gray-200 px-5 py-4 text-gray-900 placeholder:text-gray-500 focus:outline-none"
                maxLength={MAX}
              />
            </div>
          </div>
        }
        cancelLabel="취소"
        confirmLabel="보내기"
        onCancel={handleCancelReject}
        onConfirm={() => {
          void handleSubmitRejectReason()
        }}
      />
      <Modal
        isOpen={isAcceptModalOpen}
        title={
          <>
            지원자를 수락할 <br />
            프로젝트 보드를 선택해 주세요.
          </>
        }
        description={
          <div className="flex flex-col">
            <p className="text-b5-medium mb-4 text-gray-800">
              프로젝트 보드를 아직 생성하지 않았다면, <br /> 창을 닫고 프로젝트 대시보드로 이동한 후
              프로젝트 생성을 먼저 진행해 주세요.
            </p>

            <div className="flex max-h-[240px] min-h-[156px] flex-col overflow-y-auto">
              {isBoardLoading ? (
                <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
                  보드 목록을 불러오는 중입니다...
                </div>
              ) : boardError ? (
                <div className="flex flex-col items-center justify-center gap-2 text-center text-sm text-red-500">
                  <span>보드 목록을 불러오지 못했습니다.</span>
                  <button
                    type="button"
                    className="text-xs text-gray-700 underline"
                    onClick={() => refetchBoards()}
                  >
                    다시 불러오기
                  </button>
                </div>
              ) : hasBoards ? (
                boards.map((board) => (
                  <button
                    key={board.boardId}
                    type="button"
                    onClick={() => handleBoardSelect(board.boardId)}
                    className={clsx(
                      'flex items-center gap-3 p-3 text-left transition',
                      selectedBoardId === board.boardId
                        ? 'bg-locallit-red-500 text-gray-0'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-100',
                    )}
                  >
                    <Folder size={20} />
                    <span className="text-[14px] font-medium">{board.name}</span>
                  </button>
                ))
              ) : (
                <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
                  생성된 프로젝트 보드가 없습니다.
                </div>
              )}
            </div>
          </div>
        }
        cancelLabel="취소"
        confirmLabel="수락하기"
        onCancel={closeAcceptModal}
        onConfirm={() => {
          void handleConfirmAccept()
        }}
        cancelDisabled={isAccepting}
        confirmDisabled={isAccepting || !selectedBoardId || !hasBoards}
      />
    </div>
  )
}
