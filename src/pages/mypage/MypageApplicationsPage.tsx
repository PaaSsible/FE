import { X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

import Modal from '@/components/common/Modal'
import ApplicationItem from '@/components/feature/mypage/ApplicationItem'
import { MypageHeader } from '@/components/feature/mypage/MypageHeader'
import useCancelRecruitApplication from '@/hooks/mypage/useCancelRecruitApplication'
import type { MyRecruitApplication } from '@/hooks/mypage/useMyRecruitApplications'
import useMyRecruitApplications from '@/hooks/mypage/useMyRecruitApplications'
import useRecruitApplicationRejectReason from '@/hooks/mypage/useRecruitApplicationRejectReason'

export default function MypageApplicationsPage() {
  const { applications, isLoading, isError, error, refetch } = useMyRecruitApplications()
  const [selectedApplication, setSelectedApplication] = useState<MyRecruitApplication | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [selectedRejectApplication, setSelectedRejectApplication] =
    useState<MyRecruitApplication | null>(null)
  const [isRejectViewOpen, setRejectViewOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const { cancelApplication, isCancelling } = useCancelRecruitApplication({
    onSuccess: () => {
      setIsCancelModalOpen(false)
      setSelectedApplication(null)
      toast.success('지원을 취소했습니다.')
      refetch()
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })
  const { fetchRejectReason, isLoading: isRejectReasonLoading } = useRecruitApplicationRejectReason(
    {
      onError: (err) => {
        toast.error(err.message)
      },
    },
  )

  const handleOpenCancelModal = (application: MyRecruitApplication) => {
    setSelectedApplication(application)
    setIsCancelModalOpen(true)
  }

  const handleCloseCancelModal = () => {
    if (isCancelling) {
      return
    }

    setIsCancelModalOpen(false)
    setSelectedApplication(null)
  }

  const handleConfirmCancel = async () => {
    if (!selectedApplication) {
      return
    }

    await cancelApplication(selectedApplication.applicationId)
  }

  const handleOpenRejectReason = async (application: MyRecruitApplication) => {
    setSelectedRejectApplication(application)
    setRejectReason('')
    setRejectViewOpen(true)

    const reason = await fetchRejectReason(application.applicationId)

    if (reason !== null) {
      setRejectReason(reason)
    }
  }

  const handleCloseRejectReason = () => {
    setRejectViewOpen(false)
    setSelectedRejectApplication(null)
    setRejectReason('')
  }

  return (
    <div className="bg-gray-50 px-[100px]">
      <MypageHeader title="지원 내역" count={applications.length} />

      <div className="mt-8 flex flex-col gap-5">
        {isLoading && (
          <div className="flex h-[200px] items-center justify-center rounded-xl bg-white text-gray-600 shadow-[0_0_20px_0_#0000001A]">
            지원 내역을 불러오는 중입니다...
          </div>
        )}

        {!isLoading && isError && (
          <div className="flex h-[200px] items-center justify-center rounded-xl bg-white text-center text-red-500 shadow-[0_0_20px_0_#0000001A]">
            {error?.message ?? '지원 내역을 불러오지 못했습니다.'}
          </div>
        )}

        {!isLoading && !isError && applications.length === 0 && (
          <div className="flex min-h-[calc(100vh-300px)] flex-col items-center justify-center gap-[29px] text-center">
            <h2 className="text-s1-bold text-gray-1000">지원 내역이 없습니다.</h2>
            <p className="text-b2-medium whitespace-pre-line text-gray-500">
              관심 있는 모집글에 지원해 보세요!
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          applications.map((application) => (
            <ApplicationItem
              key={application.applicationId}
              application={application}
              onCancelClick={handleOpenCancelModal}
              onRejectReasonClick={(target) => {
                void handleOpenRejectReason(target)
              }}
            />
          ))}
      </div>

      <Modal
        isOpen={isCancelModalOpen}
        title="지원을 취소하시겠어요?"
        description={
          <p>
            현재 참여를 신청한 프로젝트의 지원이 취소됩니다.
            <br />
            취소 후에는 다시 지원해야 참여가 가능합니다.
          </p>
        }
        cancelLabel="아니요"
        confirmLabel="지원 취소하기"
        onCancel={handleCloseCancelModal}
        onConfirm={() => {
          void handleConfirmCancel()
        }}
        cancelDisabled={isCancelling}
        confirmDisabled={isCancelling}
      />
      {isRejectViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-0 relative w-[484px] rounded-2xl px-8 pt-8 pb-6 text-start">
            <button
              type="button"
              aria-label="닫기"
              onClick={handleCloseRejectReason}
              className="absolute top-5 right-5 rounded-md p-1 text-gray-500 hover:bg-gray-100"
            >
              <X size={24} />
            </button>

            <h2 className="text-s1-bold text-gray-900">거절 사유 확인</h2>

            <div className="text-b5-medium mt-4 text-gray-800">
              {selectedRejectApplication && (
                <p className="text-b6-medium mb-2 text-gray-600">
                  지원한 모집글: {selectedRejectApplication.title}
                </p>
              )}
              <p className="mb-4">
                아쉽게도 이번 팀프로젝트에서는 함께하지 못하게 되었어요.
                <br />
                아래에서 거절 사유를 확인하실 수 있습니다.
              </p>

              <div className="h-[118px] overflow-y-auto rounded-lg bg-gray-200 px-5 py-[14px]">
                {isRejectReasonLoading ? (
                  <span className="text-b5-medium text-gray-500">
                    거절 사유를 불러오는 중입니다...
                  </span>
                ) : rejectReason.trim().length > 0 ? (
                  <p className="whitespace-pre-line text-gray-900">{rejectReason}</p>
                ) : (
                  <span className="text-b5-medium text-gray-500">
                    거절 사유가 제공되지 않았습니다.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
