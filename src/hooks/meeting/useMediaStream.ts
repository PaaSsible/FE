import { useCallback, useEffect, useRef, useState } from 'react'

import { useMeetingStore } from '@/stores/meetingStore'

export interface UseMediaStreamResult {
  stream: MediaStream | null
  isCameraOn: boolean
  isMicOn: boolean
  startStream: () => Promise<void>
  stopStream: () => void
  toggleCamera: () => Promise<void>
  toggleMic: () => Promise<void>
}

interface MediaStreamTrackWithHint extends MediaStreamTrack {
  contentHint: string
}

export function useMediaStream(): UseMediaStreamResult {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const streamRef = useRef<MediaStream | null>(null)
  const setCurrentUserMedia = useMeetingStore((state) => state.setCurrentUserMedia)
  const setLocalPreviewStream = useMeetingStore((state) => state.setLocalPreviewStream)

  const stopStream = useCallback(() => {
    const currentStream = streamRef.current
    currentStream?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setStream(null)
    setIsCameraOn(false)
    setIsMicOn(false)
    setLocalPreviewStream(null)
  }, [setLocalPreviewStream])

  const startStream = useCallback(async () => {
    try {
      const [videoStream, audioStream] = await Promise.all([
        navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 360 },
            frameRate: { ideal: 15 },
          },
        }),
        navigator.mediaDevices.getUserMedia({
          audio: true,
        }),
      ])

      videoStream.getVideoTracks().forEach((track) => {
        const t = track as MediaStreamTrackWithHint
        if ('contentHint' in t) {
          t.contentHint = 'motion'
        }
      })

      const combinedStream = new MediaStream([
        ...videoStream.getTracks(),
        ...audioStream.getTracks(),
      ])

      streamRef.current?.getTracks().forEach((t) => t.stop())
      streamRef.current = combinedStream
      setStream(combinedStream)
      setIsCameraOn(true)
      setIsMicOn(true)
      setLocalPreviewStream(combinedStream)
    } catch (error) {
      console.error('Media Error:', error)
    }
  }, [setLocalPreviewStream])

  const toggleCamera = useCallback(async () => {
    const currentStream = streamRef.current
    if (!currentStream) return
    const videoTracks = currentStream.getVideoTracks()

    const liveVideoTracks = videoTracks.filter((t) => t.readyState === 'live')

    if (liveVideoTracks.length > 0) {
      liveVideoTracks.forEach((t) => {
        t.stop()
        currentStream.removeTrack(t)
      })

      const remainingAudioTracks = currentStream
        .getAudioTracks()
        .filter((t) => t.readyState === 'live')
      const nextStream = new MediaStream([...remainingAudioTracks])

      streamRef.current = nextStream
      setStream(nextStream)
      setIsCameraOn(false)
      setLocalPreviewStream(nextStream)
    } else {
      try {
        const newVideoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 360 },
            frameRate: { ideal: 15 },
          },
          audio: false,
        })

        const newVideoTrack = newVideoStream.getVideoTracks()[0]
        const existingAudioTracks = currentStream
          .getAudioTracks()
          .filter((t) => t.readyState === 'live')
        const nextStream = new MediaStream([newVideoTrack, ...existingAudioTracks])

        streamRef.current = nextStream
        setStream(nextStream)
        setIsCameraOn(true)
        setLocalPreviewStream(nextStream)
      } catch (error) {
        console.error('Camera toggle error:', error)
      }
    }
  }, [setLocalPreviewStream])

  const toggleMic = useCallback(async () => {
    const currentStream = streamRef.current
    if (!currentStream) return
    const audioTracks = currentStream.getAudioTracks()
    const liveAudioTracks = audioTracks.filter((t) => t.readyState === 'live')
    const activeAudioTrack = liveAudioTracks[0]

    if (activeAudioTrack) {
      activeAudioTrack.stop()
      currentStream.removeTrack(activeAudioTrack)

      const remainingVideoTracks = currentStream
        .getVideoTracks()
        .filter((t) => t.readyState === 'live')
      const nextStream = new MediaStream([...remainingVideoTracks])

      streamRef.current = nextStream
      setStream(nextStream)
      setIsMicOn(false)
      setLocalPreviewStream(nextStream)
    } else {
      try {
        const newAudioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        })

        const newAudioTrack = newAudioStream.getAudioTracks()[0]
        const existingVideoTracks = currentStream
          .getVideoTracks()
          .filter((t) => t.readyState === 'live')
        const nextStream = new MediaStream([newAudioTrack, ...existingVideoTracks])

        streamRef.current = nextStream
        setStream(nextStream)
        setIsMicOn(true)
        setLocalPreviewStream(nextStream)
      } catch (error) {
        console.error('Mic toggle error:', error)
      }
    }
  }, [setLocalPreviewStream])

  useEffect(() => {
    void startStream()
    return () => {
      stopStream()
    }
  }, [startStream, stopStream])

  useEffect(() => {
    setCurrentUserMedia({ isMicOn, isCameraOn })
    return () => {
      setCurrentUserMedia({ isMicOn: false, isCameraOn: false })
    }
  }, [isCameraOn, isMicOn, setCurrentUserMedia])

  return { stream, isCameraOn, isMicOn, startStream, stopStream, toggleCamera, toggleMic }
}
