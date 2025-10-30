'use client'

import type { JSX } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { postMeet, getBoardMeet, postMeetParticipant } from '@/apis/meet.api'
import Button from '@/components/atoms/Button'
import type { MeetingInfo } from '@/types/apis/meet/meet.api.types'

type ViewStatus = 'idle' | 'active' | 'ended'

const DEFAULT_STATUS: ViewStatus = 'idle'

export default function ProjectMeetingPage(): JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { projectId } = useParams<{ projectId: string }>()

  const boardId = useMemo(() => {
    const parsed = Number(projectId)
    return Number.isFinite(parsed) ? parsed : NaN
  }, [projectId])

  const meetingEndedFromState =
    (location.state as { meetingEnded?: boolean } | null)?.meetingEnded === true

  const [meetingStatus, setMeetingStatus] = useState<ViewStatus>(
    meetingEndedFromState ? 'ended' : DEFAULT_STATUS,
  )
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  const meetingRoomId = meetingInfo?.meetId ?? null
  const previewAttendees = useMemo(
    () =>
      meetingInfo
        ? meetingInfo.attendees.map((attendee) => ({
            userId: attendee.userId,
            userName: attendee.userName,
            profileImageUrl: attendee.profileImageUrl ?? null,
          }))
        : [],
    [meetingInfo],
  )
  const participantCount = meetingInfo?.participantCount ?? 0

  const fetchMeeting = useCallback(async () => {
    if (!Number.isFinite(boardId)) return

    setIsLoading(true)
    try {
      const response = await getBoardMeet({ boardId })
      if (response.success && response.data) {
        setMeetingInfo(response.data)
        setMeetingStatus('active')
      } else {
        setMeetingInfo(null)
        setMeetingStatus(DEFAULT_STATUS)
      }
    } catch (error) {
      console.error('failed to fetch meeting info', error)
      setMeetingInfo(null)
      setMeetingStatus(DEFAULT_STATUS)
    } finally {
      setIsLoading(false)
    }
  }, [boardId])

  useEffect(() => {
    if (!Number.isFinite(boardId) || meetingStatus === 'ended') return
    void fetchMeeting()
  }, [boardId, fetchMeeting, meetingStatus])

  useEffect(() => {
    if (!meetingEndedFromState) return
    setMeetingInfo(null)
    setMeetingStatus('ended')
    void navigate(location.pathname + location.search, { replace: true })
  }, [meetingEndedFromState, navigate, location.pathname, location.search])

  const handleStartMeeting = useCallback(async () => {
    if (!Number.isFinite(boardId) || meetingStatus === 'active') return

    setIsStarting(true)
    try {
      const startTime = new Date().toISOString()
      const response = await postMeet({ boardId, startTime })
      if (!response.success) {
        throw new Error(response.message ?? '회의를 시작하지 못했습니다.')
      }
      setMeetingInfo({
        meetId: response.data.meetId,
        participantCount: 1,
        attendees: [],
      })
      setMeetingStatus('active')
      toast.success('회의가 시작되었습니다.')
      if (projectId) {
        void navigate(`/projects/${projectId}/meeting/${response.data.meetId}`)
      }
    } catch (error) {
      console.error('failed to start meeting', error)
      toast.error(error instanceof Error ? error.message : '회의 시작 중 문제가 발생했습니다.')
    } finally {
      setIsStarting(false)
    }
  }, [boardId, meetingStatus])

  const handleJoinMeeting = useCallback(() => {
    if (!meetingRoomId || !projectId || isJoining) return
    setIsJoining(true)
    void (async () => {
      try {
        const response = await postMeetParticipant({ meetId: meetingRoomId })
        if (!response.success) {
          throw new Error(response.message ?? '회의에 참여하지 못했습니다.')
        }
        void navigate(`/projects/${projectId}/meeting/${meetingRoomId}`)
      } catch (error) {
        console.error('failed to join meeting', error)
        toast.error(error instanceof Error ? error.message : '회의 참여 중 문제가 발생했습니다.')
      } finally {
        setIsJoining(false)
      }
    })()
  }, [isJoining, meetingRoomId, navigate, projectId])

  const handleEndMeeting = () => {
    setMeetingStatus('ended')
  }

  const handleBackToStart = () => {
    setMeetingStatus('idle')
    void fetchMeeting()
  }

  if (!Number.isFinite(boardId)) {
    return (
      <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center bg-gray-50 text-center text-gray-600">
        유효하지 않은 프로젝트 정보입니다.
      </div>
    )
  }

  const isIdle = meetingStatus === 'idle'
  const isActive = meetingStatus === 'active'
  const isEnded = meetingStatus === 'ended'

  return (
    <div className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center bg-gray-50 text-center">
      {/* 상태별 제목 및 설명 */}
      {isIdle && (
        <>
          <h1 className="mb-2 text-[20px] font-semibold text-gray-900">
            팀 협업을 위한 온라인 회의
          </h1>
          <p className="mb-8 text-gray-500">
            {isLoading
              ? '회의 정보를 불러오는 중입니다...'
              : '현재 진행 중인 온라인 회의가 없습니다.'}
          </p>
        </>
      )}

      {isActive && (
        <>
          <h1 className="mb-2 text-[20px] font-semibold text-gray-900">
            팀 협업을 위한 온라인 회의
          </h1>
          <p className="mb-8 text-gray-500">현재 진행 중인 온라인 회의가 있습니다.</p>
        </>
      )}

      {isEnded && (
        <>
          <h1 className="text-s1-bold mb-2 text-gray-900">회의가 끝났습니다.</h1>
          <p className="text-b2-medium mb-8 text-gray-500">
            첫 화면으로 돌아가면 오늘의 회의 기록은 지워집니다.
          </p>
        </>
      )}

      {/* 회의 진행 중인 카드 */}
      {isActive && (
        <div className="relative mb-8 flex h-[313px] w-[555px] flex-col items-center justify-center rounded-lg bg-[#1B1B1D] text-white">
          <div className="text-[18px] font-medium">{participantCount}명이 회의 중입니다...</div>
          <div className="absolute bottom-4 left-4 flex -space-x-2">
            {previewAttendees.slice(0, 5).map((p) =>
              p.profileImageUrl ? (
                <img
                  key={p.userId}
                  src={p.profileImageUrl}
                  alt={p.userName}
                  className="h-[45px] w-[45px] rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div
                  key={p.userId}
                  className="flex h-[45px] w-[45px] items-center justify-center rounded-full border-2 border-white bg-gray-600 text-sm font-semibold"
                >
                  {p.userName.charAt(0).toUpperCase()}
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* 버튼 영역 */}
      <div className="flex w-[555px] flex-col gap-3">
        {isIdle && (
          <>
            <Button
              size="big"
              onClick={() => void handleStartMeeting()}
              disabled={isStarting || isLoading}
            >
              {isStarting ? '회의 시작 중...' : '새로운 회의 시작하기'}
            </Button>
            <Button size="big" variant="secondary" disabled>
              이전 회의 기록 보기
            </Button>
          </>
        )}

        {isActive && (
          <>
            <Button size="big" onClick={handleJoinMeeting} disabled={!meetingRoomId || isJoining}>
              {isJoining ? '회의 참가 중...' : '회의에 참석하기'}
            </Button>
            <Button size="big" variant="secondary" onClick={handleEndMeeting}>
              이전 회의 기록 보기
            </Button>
          </>
        )}

        {isEnded && (
          <>
            <Button size="big" onClick={() => alert('회의록 생성 기능은 준비 중입니다.')}>
              회의록 생성하기
            </Button>
            <Button size="big" variant="secondary" onClick={handleBackToStart}>
              첫 화면으로 돌아가기
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
