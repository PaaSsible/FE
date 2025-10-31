'use client'

import clsx from 'clsx'
import type { RemoteAudioTrack } from 'livekit-client'
import { Mic, MicOff, Video, VideoOff } from 'lucide-react'
import { useEffect, useState, useRef, type ReactElement } from 'react'

import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { useMeetingStore } from '@/stores/meetingStore'

const SLIDES_PER_PAGE = 4

export default function MeetingParticipantsBar(): ReactElement {
  const participants = useMeetingStore((state) => state.participants)
  const inactiveUserIds = useMeetingStore((state) => state.inactiveUserIds)
  const highlightedSpeakerUserId = useMeetingStore((state) => state.highlightedSpeakerUserId)
  const screenShare = useMeetingStore((state) => state.screenShare)
  const localPreviewStream = useMeetingStore((state) => state.localPreviewStream)
  const currentUserId = useMeetingStore((state) => state.currentUserId)
  const currentUserName = useMeetingStore((state) => state.currentUserName)
  const currentUserProfileImageUrl = useMeetingStore((state) => state.currentUserProfileImageUrl)
  const currentUserMedia = useMeetingStore((state) => state.currentUserMedia)
  const isCurrentUserSpeaking = useMeetingStore((state) => state.isCurrentUserSpeaking)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!carouselApi) return
    const updateControls = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }
    updateControls()
    carouselApi.on('select', updateControls)
    carouselApi.on('reInit', updateControls)
    return () => {
      carouselApi.off('select', updateControls)
      carouselApi.off('reInit', updateControls)
    }
  }, [carouselApi])

  const localUserId = currentUserId ?? 'local'
  const shouldShowLocalPreview = Boolean(screenShare?.isLocal && localPreviewStream)

  const renderParticipants: ParticipantTileProps[] = [
    ...(shouldShowLocalPreview && localPreviewStream
      ? [
          {
            variant: 'local',
            userId: localUserId,
            userName: currentUserName ?? '나',
            isMicOn: currentUserMedia.isMicOn,
            isCameraOn: currentUserMedia.isCameraOn,
            isSpeaking: isCurrentUserSpeaking,
            isHighlighted: highlightedSpeakerUserId === localUserId,
            isInactive: inactiveUserIds.includes(localUserId),
            profileImageUrl: currentUserProfileImageUrl ?? null,
            stream: localPreviewStream,
          } satisfies ParticipantTileProps,
        ]
      : []),
    ...participants.map(
      (user) =>
        ({
          variant: 'remote',
          userId: user.userId,
          userName: user.userName,
          isMicOn: user.isMicOn,
          isCameraOn: user.isCameraOn,
          isSpeaking: user.isSpeaking,
          isHighlighted: highlightedSpeakerUserId === user.userId,
          isInactive: inactiveUserIds.includes(user.userId),
          profileImageUrl: user.profileImageUrl ?? null,
          audioTrack: user.audioTrack ?? null,
          videoTrack: user.videoTrack ?? null,
        }) satisfies ParticipantTileProps,
    ),
  ]
  const totalParticipants = renderParticipants.length
  const totalPages = Math.ceil(Math.max(totalParticipants, 1) / SLIDES_PER_PAGE)
  const fillerCount = totalPages * SLIDES_PER_PAGE - totalParticipants
  const cells: Array<ParticipantTileProps | null> = [
    ...renderParticipants,
    ...Array.from({ length: fillerCount }).map(() => null),
  ]

  useEffect(() => {
    carouselApi?.reInit()
  }, [carouselApi, cells.length])

  return (
    <div className="carousel-viewport relative flex h-full max-h-[190px] min-h-[150px] w-full flex-col justify-center rounded-xl bg-gray-800 px-6 py-4">
      {totalParticipants === 0 ? (
        <p className="text-b4-medium text-gray-500">아직 참석한 팀원이 없습니다.</p>
      ) : (
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: 'start',
            containScroll: 'trimSnaps',
            dragFree: false,
            slidesToScroll: SLIDES_PER_PAGE,
          }}
          className="mb-3 w-full"
        >
          <div className="relative flex min-h-[140px] w-full items-center sm:min-h-[160px] xl:min-h-[170px]">
            <div className="relative flex-1 overflow-visible">
              <CarouselContent className="-ml-3 pb-10" containerClassName="overflow-hidden">
                {cells.map((user, i) => (
                  <CarouselItem key={i} className="basis-1/4 pt-4 pl-3">
                    {user ? (
                      <ParticipantTile key={user.userId} {...user} />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-transparent bg-transparent" />
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </div>
          </div>
        </Carousel>
      )}

      {totalParticipants > 0 && (
        <>
          <button
            type="button"
            onClick={() => carouselApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="text-l1-medium text-gray-250 absolute bottom-[10px] left-6 flex h-8 items-center rounded-lg border border-gray-600 bg-gray-700 px-[10px] transition disabled:text-gray-500 disabled:opacity-50"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => carouselApi?.scrollNext()}
            disabled={!canScrollNext}
            className="text-l1-medium text-gray-250 absolute right-6 bottom-[10px] flex h-8 items-center rounded-lg border border-gray-600 bg-gray-700 px-[10px] transition disabled:text-gray-500 disabled:opacity-50"
          >
            다음
          </button>
        </>
      )}
    </div>
  )
}

type ParticipantTileProps = {
  variant: 'remote' | 'local'
  userId: string
  userName: string
  isMicOn: boolean
  isCameraOn: boolean
  isSpeaking: boolean
  isHighlighted: boolean
  isInactive: boolean
  audioTrack?: RemoteAudioTrack | null
  videoTrack?: import('livekit-client').RemoteVideoTrack | null
  stream?: MediaStream | null
  profileImageUrl?: string | null
}

function ParticipantTile({
  variant,
  userId,
  userName,
  isMicOn,
  isCameraOn,
  isSpeaking,
  isHighlighted,
  isInactive,
  audioTrack,
  videoTrack,
  stream,
  profileImageUrl,
}: ParticipantTileProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const attachedTrackRef = useRef<import('livekit-client').RemoteVideoTrack | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const attachedAudioTrackRef = useRef<RemoteAudioTrack | null>(null)

  useEffect(() => {
    if (variant !== 'remote') return
    const el = videoRef.current
    if (!el) return

    if (attachedTrackRef.current && attachedTrackRef.current !== videoTrack) {
      try {
        attachedTrackRef.current.detach(el)
      } catch {}
      attachedTrackRef.current = null
    }

    if (isCameraOn && videoTrack) {
      try {
        videoTrack.attach(el)
        attachedTrackRef.current = videoTrack
      } catch (e) {
        console.warn('[ParticipantTile] failed to attach video track', e)
      }
      return () => {
        try {
          videoTrack.detach(el)
        } catch {}
        if (attachedTrackRef.current === videoTrack) attachedTrackRef.current = null
        try {
          el.srcObject = null
        } catch {}
      }
    }

    try {
      if (attachedTrackRef.current) {
        attachedTrackRef.current.detach(el)
        attachedTrackRef.current = null
      }
    } catch {}
    try {
      el.srcObject = null
    } catch {}
  }, [variant, videoTrack, isCameraOn])

  useEffect(() => {
    if (variant !== 'remote') return
    const el = audioRef.current
    if (!el) return

    const detach = () => {
      if (attachedAudioTrackRef.current) {
        try {
          attachedAudioTrackRef.current.detach(el)
        } catch (error) {
          console.warn('[ParticipantTile] failed to detach audio track', error)
        }
        attachedAudioTrackRef.current = null
      }
      try {
        el.srcObject = null
      } catch {}
    }

    if (!audioTrack || !isMicOn) {
      detach()
      return
    }

    if (attachedAudioTrackRef.current && attachedAudioTrackRef.current !== audioTrack) {
      detach()
    }

    try {
      audioTrack.attach(el)
      attachedAudioTrackRef.current = audioTrack
      void el.play().catch(() => {
        // Autoplay can fail without user gesture; rely on subsequent interactions.
      })
    } catch (error) {
      console.warn('[ParticipantTile] failed to attach audio track', error)
      detach()
    }

    return () => {
      detach()
    }
  }, [audioTrack, isMicOn, variant])

  useEffect(() => {
    if (variant !== 'local') return
    const el = videoRef.current
    if (!el) return

    if (isCameraOn && stream) {
      try {
        if (el.srcObject !== stream) {
          el.srcObject = stream
        }
      } catch (error) {
        console.warn('[ParticipantTile] failed to attach local preview stream', error)
      }
    } else {
      try {
        el.srcObject = null
      } catch {}
    }

    return () => {
      try {
        el.srcObject = null
      } catch {}
    }
  }, [isCameraOn, stream, variant])

  const showSpeakingBadge = isSpeaking || isHighlighted

  const innerContent = (
    <div
      className={clsx(
        'relative h-[128px] w-full overflow-hidden rounded-xl bg-[#1E1E20] text-center transition-all duration-300',
        {
          'border-locallit-red-500 border-2': showSpeakingBadge && !isInactive,
          'border border-transparent': !showSpeakingBadge && !isInactive,
          'bg-locallit-red-950 animate-freezeGlow': isInactive,
        },
      )}
      data-user-id={userId}
    >
      <div className="relative h-full w-full rounded-md bg-black">
        {isInactive && (
          <div className="animate-freezeOverlay pointer-events-none absolute inset-0 z-10 rounded-md bg-white/5" />
        )}
        {isCameraOn && ((variant === 'remote' && videoTrack) || (variant === 'local' && stream)) ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={variant === 'local'}
            className="absolute inset-0 h-full w-full rounded-lg object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
            <img
              src={profileImageUrl || '/assets/images/profile_default.png'}
              alt={userName}
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
        )}

        {/* overlay: name + mic/camera */}
        <div className="absolute right-0 bottom-0 left-0 z-20 flex items-center justify-between gap-3 bg-black/50 px-3 py-2">
          <span className="text-b4-medium truncate text-white">{userName}</span>
          <div className="flex items-center gap-3 text-white">
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
          </div>
        </div>
      </div>
      {variant === 'remote' && <audio ref={audioRef} autoPlay className="hidden" />}
    </div>
  )

  // create a container that allows the badge to overflow (so it's not clipped)
  const tileWithBadge = (
    <div className="relative">
      {(showSpeakingBadge || isInactive) && (
        <div className="bg-locallit-red-500 text-b5-bold absolute -top-3 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-1 text-gray-900">
          {isInactive ? '비발언자' : '발언자'}
        </div>
      )}
      {innerContent}
    </div>
  )

  // When inactive, render an outer wrapper that provides the gradient "border" via background
  if (isInactive) {
    return (
      <div
        className="rounded-xl p-[2px]"
        style={{
          background: 'linear-gradient(107.04deg, #FF6348 -0.17%, #227BD6 99.93%)',
        }}
      >
        {tileWithBadge}
      </div>
    )
  }

  return tileWithBadge
}
