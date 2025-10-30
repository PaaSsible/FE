import { Track, type Room } from 'livekit-client'
import { useCallback, useEffect, useRef } from 'react'

import { useMeetingStore, type ScreenShareState } from '@/stores/meetingStore'

interface UseScreenShareOptions {
  room: Room | null
}

interface UseScreenShareResult {
  isScreenSharing: boolean
  isAnotherSharing: boolean
  startScreenShare: () => Promise<void>
  stopScreenShare: () => Promise<void>
  activeScreenShare: ScreenShareState | null
}

const createDisplayMediaStream = async (): Promise<MediaStream> => {
  if (!navigator?.mediaDevices?.getDisplayMedia) {
    throw new Error('이 브라우저에서는 화면 공유를 지원하지 않습니다.')
  }

  try {
    return await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: { ideal: 30, max: 60 },
        cursor: 'always',
      },
      audio: true,
    })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : '화면 공유를 시작하지 못했습니다.'
    throw new Error(message)
  }
}

export function useScreenShare({ room }: UseScreenShareOptions): UseScreenShareResult {
  const activeScreenShare = useMeetingStore((state) => state.screenShare)
  const setScreenShare = useMeetingStore((state) => state.setScreenShare)
  const clearScreenShare = useMeetingStore((state) => state.clearScreenShare)
  const currentUserId = useMeetingStore((state) => state.currentUserId)
  const currentUserName = useMeetingStore((state) => state.currentUserName)
  const currentUserProfileImageUrl = useMeetingStore((state) => state.currentUserProfileImageUrl)

  const localScreenStreamRef = useRef<MediaStream | null>(null)

  const stopScreenShare = useCallback(async () => {
    const participant = room?.localParticipant
    const currentLocalStream = localScreenStreamRef.current
    localScreenStreamRef.current = null

    const ensureCleared = () => {
      const shareState = useMeetingStore.getState().screenShare
      if (shareState?.isLocal) {
        clearScreenShare()
      }
    }

    try {
      const unpublishTrack = async (source: Track.Source) => {
        if (!participant) return
        try {
          const publication = participant.getTrackPublication(source)
          const publishedTrack = publication?.track ?? null
          if (publishedTrack) {
            await participant.unpublishTrack(publishedTrack)
          }
        } catch (err) {
          console.warn('[ScreenShare] failed to unpublish track', source, err)
        }
      }

      await Promise.all([
        unpublishTrack(Track.Source.ScreenShare),
        unpublishTrack(Track.Source.ScreenShareAudio),
      ])
    } finally {
      if (currentLocalStream) {
        currentLocalStream.getTracks().forEach((track) => {
          try {
            track.stop()
          } catch (err) {
            console.warn('[ScreenShare] failed to stop track', err)
          }
        })
      }
      ensureCleared()
    }
  }, [clearScreenShare, room])

  const startScreenShare = useCallback(async () => {
    if (!room) {
      throw new Error('회의에 연결되어 있지 않습니다.')
    }

    const currentShare = useMeetingStore.getState().screenShare
    if (currentShare && !currentShare.isLocal) {
      throw new Error('다른 참가자가 이미 화면을 공유 중입니다.')
    }
    if (currentShare?.isLocal) {
      return
    }

    const stream = await createDisplayMediaStream()
    const [videoTrack] = stream.getVideoTracks()
    if (!videoTrack) {
      stream.getTracks().forEach((track) => track.stop())
      throw new Error('공유할 화면을 찾지 못했습니다.')
    }

    const participant = room.localParticipant
    if (!participant) {
      stream.getTracks().forEach((track) => track.stop())
      throw new Error('로컬 참가자 정보를 찾지 못했습니다.')
    }

    try {
      await participant.publishTrack(videoTrack, { source: Track.Source.ScreenShare })
    } catch (error) {
      stream.getTracks().forEach((track) => track.stop())
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : '화면 공유를 시작하지 못했습니다.'
      throw new Error(message)
    }

    const [audioTrack] = stream.getAudioTracks()
    if (audioTrack) {
      try {
        await participant.publishTrack(audioTrack, { source: Track.Source.ScreenShareAudio })
      } catch (error) {
        console.warn('[ScreenShare] failed to publish screen audio track', error)
      }
    }

    videoTrack.addEventListener(
      'ended',
      () => {
        void stopScreenShare()
      },
      { once: true },
    )

    localScreenStreamRef.current = stream

    const ownerId =
      currentUserId ?? (typeof participant.identity === 'string' ? participant.identity : null)
    const ownerName =
      currentUserName ??
      participant.name ??
      (typeof participant.identity === 'string' ? participant.identity : '나')

    setScreenShare({
      ownerId: ownerId ?? 'local',
      ownerName,
      profileImageUrl: currentUserProfileImageUrl ?? null,
      stream,
      isLocal: true,
    })
  }, [
    currentUserId,
    currentUserName,
    currentUserProfileImageUrl,
    room,
    setScreenShare,
    stopScreenShare,
  ])

  useEffect(() => {
    return () => {
      void stopScreenShare()
    }
  }, [stopScreenShare])

  useEffect(() => {
    if (!room && activeScreenShare?.isLocal) {
      void stopScreenShare()
    }
  }, [activeScreenShare?.isLocal, room, stopScreenShare])

  const isScreenSharing = Boolean(activeScreenShare && activeScreenShare.isLocal)
  const isAnotherSharing = Boolean(activeScreenShare && !activeScreenShare.isLocal)

  return {
    isScreenSharing,
    isAnotherSharing,
    startScreenShare,
    stopScreenShare,
    activeScreenShare,
  }
}

export type { UseScreenShareResult }
