import { Mic, MicOff, Video, VideoOff, PhoneOff, Airplay, Check } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { deleteMeetParticipant, postTransferHostAndLeave } from '@/apis/meet.api'
import Modal from '@/components/common/Modal'
import { type UseMediaStreamResult } from '@/hooks/meeting/useMediaStream'
import type { MeetingLeaveResponse } from '@/types/apis/meet/meet.api.types'

type TransferCandidate = NonNullable<NonNullable<MeetingLeaveResponse['candidates']>[number]>

interface MeetingControlsBarProps extends UseMediaStreamResult {
  meetId?: number
  projectId?: number
}

export default function MeetingControlsBar({
  isMicOn,
  isCameraOn,
  toggleMic,
  toggleCamera,
  meetId,
  projectId,
}: MeetingControlsBarProps) {
  const navigate = useNavigate()

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedHostId, setSelectedHostId] = useState<number | null>(null)
  const [transferCandidates, setTransferCandidates] = useState<TransferCandidate[]>([])
  const [isLeaving, setIsLeaving] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)

  const navigateAfterLeave = useCallback(
    (options?: { ended?: boolean }) => {
      const navigationOptions = options?.ended ? { state: { meetingEnded: true } } : undefined

      if (projectId) {
        void navigate(`/projects/${projectId}/meeting`, navigationOptions)
        return
      }

      void navigate('/projects', navigationOptions)
    },
    [navigate, projectId],
  )

  const closeTransferModal = useCallback(() => {
    setIsTransferModalOpen(false)
    setTransferCandidates([])
    setSelectedHostId(null)
  }, [])

  const handleSelectHost = (id: number) => setSelectedHostId(id)

  const handleLeave = useCallback(async () => {
    if (!meetId) {
      toast.error('회의 정보를 확인할 수 없습니다.')
      return
    }

    setIsLeaving(true)
    try {
      const response = await deleteMeetParticipant({ meetId })
      const status = response.data?.status

      if (!status) {
        throw new Error('Invalid server response')
      }

      if (status === 'TRANSFER_REQUIRED') {
        const candidates = response.data.candidates ?? []
        if (candidates.length === 0) {
          toast.error('위임 가능한 참가자가 없어 회의를 종료합니다.')
          navigateAfterLeave({ ended: true })
          return
        }

        setTransferCandidates(candidates)
        setSelectedHostId(candidates[0]?.userId ?? null)
        setIsTransferModalOpen(true)
        return
      }

      if (status === 'LEFT') {
        toast.success('회의에서 나갔습니다.')
        navigateAfterLeave()
        return
      }

      if (status === 'ENDED') {
        toast.success('회의가 종료되었습니다.')
        navigateAfterLeave({ ended: true })
        return
      }

      // fallback
      toast.success(response.message ?? '퇴장이 완료되었습니다.')
      navigateAfterLeave()
    } catch (error) {
      console.error(error)
      toast.error('퇴장 처리에 실패했습니다.')
    } finally {
      setIsLeaving(false)
    }
  }, [meetId, navigateAfterLeave])

  const handleTransferAndLeave = useCallback(async () => {
    if (!meetId) {
      toast.error('회의 정보를 확인할 수 없습니다.')
      return
    }

    if (!selectedHostId) {
      toast.error('위임할 호스트를 선택해 주세요.')
      return
    }

    setIsTransferring(true)
    try {
      await postTransferHostAndLeave(
        { meetId },
        {
          newHostId: selectedHostId,
        },
      )
      toast.success('호스트를 위임하고 회의를 나갔습니다.')
      closeTransferModal()
      navigateAfterLeave()
    } catch (error) {
      console.error(error)
      toast.error('호스트 위임에 실패했습니다.')
    } finally {
      setIsTransferring(false)
    }
  }, [closeTransferModal, meetId, navigateAfterLeave, selectedHostId])

  const modalDescription = useMemo(() => {
    if (transferCandidates.length === 0) {
      return (
        <div className="space-y-4">
          <p className="text-[15px] leading-relaxed text-gray-700">
            위임 가능한 참가자가 없습니다. 회의가 종료됩니다.
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <p className="text-[15px] leading-relaxed text-gray-700">
          회의를 계속 진행하려면 다른 참가자에게 호스트 권한을 넘겨주세요.
        </p>

        <div className="bg-[#F7F7F7]">
          {transferCandidates.map((candidate) => (
            <button
              key={candidate.userId}
              onClick={() => handleSelectHost(candidate.userId)}
              className={`flex w-full items-center justify-between px-3 py-2 text-[14px] transition-colors ${
                selectedHostId === candidate.userId
                  ? 'bg-[#5A6784] text-white'
                  : 'text-[#5A6784] hover:bg-gray-100'
              }`}
            >
              <span className="font-medium">{candidate.nickname}</span>
              {selectedHostId === candidate.userId && <Check size={16} />}
            </button>
          ))}
        </div>
      </div>
    )
  }, [selectedHostId, transferCandidates])

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => void toggleMic()}
          className={`flex h-[50px] w-[50px] items-center justify-center rounded-lg transition-colors ${
            isMicOn ? 'bg-gray-700' : 'bg-locallit-red-600'
          }`}
        >
          {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
        </button>

        <button
          onClick={() => void toggleCamera()}
          className={`flex h-[50px] w-[50px] items-center justify-center rounded-lg transition-colors ${
            isCameraOn ? 'bg-gray-700' : 'bg-locallit-red-600'
          }`}
        >
          {isCameraOn ? <Video size={24} /> : <VideoOff size={24} />}
        </button>

        <button className="flex h-[50px] w-[50px] items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600">
          <Airplay size={24} />
        </button>

        <button
          className="bg-locallit-red-600 hover:bg-locallit-red-500 flex h-[50px] w-[100px] items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => void handleLeave()}
          disabled={isLeaving}
        >
          <PhoneOff size={24} />
        </button>
      </div>

      {/* 종료 모달 */}
      <Modal
        isOpen={isTransferModalOpen}
        title="회의에서 나가시겠어요?"
        description={modalDescription}
        cancelLabel="취소"
        confirmLabel="권한 넘기기"
        onCancel={closeTransferModal}
        onConfirm={() => void handleTransferAndLeave()}
        cancelDisabled={isTransferring}
        confirmDisabled={isTransferring || !selectedHostId}
      />
    </>
  )
}
