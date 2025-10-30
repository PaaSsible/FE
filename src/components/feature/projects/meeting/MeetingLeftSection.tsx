import { useEffect, type ReactElement } from 'react'
import toast from 'react-hot-toast'

import { useLiveKitRoom } from '@/hooks/meeting/useLiveKitRoom'
import { useMediaStream } from '@/hooks/meeting/useMediaStream'
import { useMeetingStore } from '@/stores/meetingStore'
import { getAuthUser } from '@/utils/authToken'

import MeetingControlsBar from './MeetingControlsBar'
import MeetingMainVideo from './MeetingMainVideo'
import MeetingParticipantsBar from './MeetingParticipantsBar'
import WorkTimer from './WorkTimer'

interface TimerController {
  start: (durationSeconds: number) => void
  pause: () => void
  resume: () => void
  end: () => void
}

interface MeetingLeftSectionProps {
  meetId?: number
  projectId?: number
  isHost: boolean
  timerController: TimerController
}

export default function MeetingLeftSection({
  meetId,
  projectId,
  isHost,
  timerController,
}: MeetingLeftSectionProps): ReactElement {
  const media = useMediaStream()
  const authUser = getAuthUser()
  const livekit = useLiveKitRoom({
    meetId,
    displayName: authUser?.username,
    localStream: media.stream,
  })
  // Select individual primitives from the store instead of returning a new
  // object each render. Returning a fresh object causes getSnapshot to produce
  // a new reference on every call which can trigger React's "Maximum update
  // depth exceeded" loop. Selecting primitives avoids that problem.
  const isTimerVisible = useMeetingStore((state) => state.isTimerVisible)
  const timerStatus = useMeetingStore((state) => state.timerState.status)
  const currentUserId = useMeetingStore((state) => state.currentUserId)
  const currentUserName = useMeetingStore((state) => state.currentUserName)
  const currentUserProfileImageUrl = useMeetingStore((state) => state.currentUserProfileImageUrl)

  const shouldRenderTimer = isHost
    ? isTimerVisible || timerStatus === 'running' || timerStatus === 'paused'
    : timerStatus === 'running' || timerStatus === 'paused' || timerStatus === 'ended'

  useEffect(() => {
    if (livekit.error) {
      toast.error(livekit.error.message)
    }
  }, [livekit.error])

  return (
    <div className="bg-gray-850 flex h-full min-h-0 flex-1 flex-col overflow-hidden px-5 pt-8 pb-4 sm:px-7 sm:pt-12 sm:pb-6 xl:px-8 xl:pt-30 xl:pb-8">
      <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4 xl:gap-6">
        <div
          className="flex-none"
          style={{
            height: 'clamp(150px, 20vh, 190px)',
          }}
        >
          <MeetingParticipantsBar />
        </div>
        <div className="flex min-h-0 flex-1">
          <MeetingMainVideo
            stream={media.stream}
            isCameraOn={media.isCameraOn}
            isMicOn={media.isMicOn}
            userId={currentUserId ?? authUser?.id ?? null}
            userName={currentUserName ?? authUser?.username ?? null}
            profileImageUrl={currentUserProfileImageUrl}
            className="max-h-[clamp(320px,52vh,620px)] min-h-[clamp(220px,40vh,540px)] flex-1"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 sm:gap-4 sm:pt-6">
        <MeetingControlsBar {...media} meetId={meetId} projectId={projectId} />
        {shouldRenderTimer && (
          <WorkTimer
            isHost={isHost}
            onStart={timerController.start}
            onPause={timerController.pause}
            onResume={timerController.resume}
            onEnd={timerController.end}
          />
        )}
      </div>
    </div>
  )
}
