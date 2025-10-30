'use client'

import {
  Room,
  RoomEvent,
  Track,
  type Participant,
  type RemoteParticipant,
  type RemoteAudioTrack,
  type RemoteVideoTrack,
  type RemoteTrackPublication,
  type LocalParticipant,
} from 'livekit-client'
import { useCallback, useEffect, useRef, useState } from 'react'

import { postLivekitToken } from '@/apis/livekit.api'
import { useMeetingStore } from '@/stores/meetingStore'
import type { LivekitTokenPayload } from '@/types/apis/livekit/livekit.api.types'

interface UseLiveKitRoomOptions {
  meetId?: number
  displayName?: string
  localStream?: MediaStream | null
  autoConnect?: boolean
}

interface UseLiveKitRoomResult {
  room: Room | null
  isConnecting: boolean
  isConnected: boolean
  error: Error | null
  livekitInfo: LivekitTokenPayload | null
  remoteParticipants: RemoteParticipant[]
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const debug = (msg: string, ...args: unknown[]) => console.log(`[LiveKit] ${msg}`, ...args)

const pickActiveTrack = (tracks?: MediaStreamTrack[]): MediaStreamTrack | null => {
  if (!tracks?.length) return null
  const t = tracks[0]
  return t && t.readyState === 'live' ? t : null
}

const toError = (err: unknown, fallback: string): Error => {
  if (err instanceof Error) return err
  if (typeof err === 'string') return new Error(err)
  return new Error(fallback)
}

export function useLiveKitRoom({
  meetId,
  displayName,
  localStream,
  autoConnect = true,
}: UseLiveKitRoomOptions): UseLiveKitRoomResult {
  const roomRef = useRef<Room | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [livekitInfo, setLivekitInfo] = useState<LivekitTokenPayload | null>(null)
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipant[]>([])

  const {
    addOrUpdateParticipant,
    removeParticipant,
    updateParticipant,
    clearParticipants,
    removeInactiveUserIds,
  } = useMeetingStore()

  const applyParticipantSnapshot = useCallback(
    (participant: Participant) => {
      const state = useMeetingStore.getState()
      const matchedMember = state.presentMembers.find(
        (member) => member.userId === participant.identity,
      )
      const existing = state.participants.find((p) => p.userId === participant.identity)

      const userName =
        matchedMember?.userName ?? existing?.userName ?? participant.name ?? participant.identity
      const profileImageUrl =
        matchedMember?.profileImageUrl ?? existing?.profileImageUrl ?? undefined

      const micPub = participant.getTrackPublication(Track.Source.Microphone) as
        | RemoteTrackPublication
        | undefined
      const camPub = participant.getTrackPublication(Track.Source.Camera) as
        | RemoteTrackPublication
        | undefined

      const micMuted = micPub?.isMuted ?? false
      const camMuted = camPub?.isMuted ?? false
      const liveAudioTrack = (micPub?.track as RemoteAudioTrack | null) ?? null
      const liveVideoTrack = (camPub?.track as RemoteVideoTrack | null) ?? null

      const resolvedAudioTrack = micMuted ? null : (liveAudioTrack ?? existing?.audioTrack ?? null)
      const resolvedVideoTrack = camMuted ? null : (liveVideoTrack ?? existing?.videoTrack ?? null)

      const nextIsMicOn = micMuted ? false : resolvedAudioTrack ? true : (existing?.isMicOn ?? true)
      const nextIsCameraOn = camMuted
        ? false
        : resolvedVideoTrack
          ? true
          : (existing?.isCameraOn ?? true)

      const updatePayload = {
        userName,
        profileImageUrl,
        isMicOn: nextIsMicOn,
        isCameraOn: nextIsCameraOn,
        audioTrack: resolvedAudioTrack,
        videoTrack: resolvedVideoTrack,
      }

      if (existing) {
        updateParticipant(participant.identity, updatePayload)
      } else {
        addOrUpdateParticipant({
          userId: participant.identity,
          ...updatePayload,
          isSpeaking: false,
        })
      }
    },
    [addOrUpdateParticipant, updateParticipant],
  )

  const refreshParticipants = useCallback(() => {
    const room = roomRef.current
    const remotes = room ? Array.from(room.remoteParticipants.values()) : []
    setRemoteParticipants(remotes)
    remotes.forEach((p) => applyParticipantSnapshot(p))
  }, [applyParticipantSnapshot])

  const registerRoomListeners = useCallback(
    (room: Room) => {
      debug('register listeners')
      room
        .on(RoomEvent.ConnectionStateChanged, (state) => debug('connection state ->', state))
        .on(RoomEvent.Connected, () => {
          debug('CONNECTED to room', room.name)
          refreshParticipants()
        })
        .on(RoomEvent.Reconnecting, () => debug('RECONNECTING...'))
        .on(RoomEvent.Reconnected, () => {
          debug('RECONNECTED')
          // after reconnect, resync remote participants and their publications
          refreshParticipants()
        })
        .on(RoomEvent.Disconnected, (reason) => {
          debug('DISCONNECTED', reason)
          setIsConnected(false)
          setRemoteParticipants([])
          clearParticipants()
        })

        .on(RoomEvent.ParticipantConnected, (p) => {
          debug('participant connected', p.identity)
          refreshParticipants()
          applyParticipantSnapshot(p)
        })
        .on(RoomEvent.ParticipantDisconnected, (p) => {
          debug('participant disconnected', p.identity)
          refreshParticipants()
          removeParticipant(p.identity)
        })
        .on(RoomEvent.TrackSubscribed, (track, pub, p) => {
          debug('track subscribed', p.identity, track.kind)
          refreshParticipants()
          applyParticipantSnapshot(p)
        })
        .on(RoomEvent.TrackUnsubscribed, (track, pub, p) => {
          debug('track unsubscribed', p.identity, track.kind)
          refreshParticipants()
          applyParticipantSnapshot(p)
        })
        .on(RoomEvent.TrackMuted, (pub, p) => {
          debug('track muted', p.identity)
          refreshParticipants()
          applyParticipantSnapshot(p)
        })
        .on(RoomEvent.TrackUnmuted, (pub, p) => {
          debug('track unmuted', p.identity)
          refreshParticipants()
          applyParticipantSnapshot(p)
        })
        .on(RoomEvent.TrackUnpublished, (pub, p) => {
          debug('track unpublished', p.identity, pub.source)
          refreshParticipants()
          applyParticipantSnapshot(p)
        })
        .on(RoomEvent.TrackPublished, (pub, p) => {
          debug('track published', p.identity, pub.source)
          refreshParticipants()
          applyParticipantSnapshot(p)
        })
        .on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
          const ids = speakers.map((s) => s.identity)
          if (ids.length > 0) {
            removeInactiveUserIds(ids)
          }
          const { participants } = useMeetingStore.getState()
          participants.forEach((pp) => {
            updateParticipant(pp.userId, { isSpeaking: ids.includes(pp.userId) })
          })
        })
    },
    [
      clearParticipants,
      applyParticipantSnapshot,
      refreshParticipants,
      removeInactiveUserIds,
      removeParticipant,
      updateParticipant,
    ],
  )

  const disconnect = useCallback(async () => {
    const room = roomRef.current
    if (!room) return
    try {
      room.removeAllListeners()
      await room.disconnect()
    } catch (err) {
      console.error('[LiveKit] Disconnect error', err)
    } finally {
      roomRef.current = null
      setIsConnected(false)
      setRemoteParticipants([])
      setLivekitInfo(null)
      clearParticipants()
    }
  }, [clearParticipants])

  const connect = useCallback(async () => {
    if (!meetId || !displayName) {
      setError(new Error('회의 연결에 필요한 정보가 부족합니다.'))
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      await disconnect()

      const info = await postLivekitToken({ meetId, displayName })
      if (!info?.url || !info?.token) throw new Error('LiveKit token or url is missing')
      setLivekitInfo(info)
      debug('token ok, url:', info.url)

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        publishDefaults: { videoSimulcastLayers: [] },
      })

      console.log('[LiveKit] attempting to connect — url:', info.url, 'room:', info.room)
      try {
        await room.connect(info.url, info.token)
        debug('room.connect resolved. state=', room.state, 'name=', room.name)
      } catch (connErr) {
        console.error('[LiveKit] room.connect threw error:', connErr)
        if (connErr && typeof connErr === 'object') {
          try {
            console.error('[LiveKit] connect error details:')
            const det = Object.getOwnPropertyNames(connErr).reduce(
              (acc: Record<string, unknown>, k: string) => {
                acc[k] = (connErr as unknown as Record<string, unknown>)[k]
                return acc
              },
              {} as Record<string, unknown>,
            )
            console.error(det)
          } catch (ee) {
            console.warn('[LiveKit] failed to enumerate connect error', ee)
          }
        }

        try {
          const msg = connErr instanceof Error ? connErr.message : String(connErr)
          if (/turn|allocate|588/i.test(msg)) {
            throw new Error(
              'TURN allocation/auth failed (likely invalid or expired TURN credentials). Ensure the server provides dynamic iceServers with valid TURN credentials.',
            )
          }
        } catch (e) {
          if (e instanceof Error) throw e
        }

        throw connErr
      }

      try {
        console.log('[LiveKit] token payload (masked):', {
          url: info.url,
          room: info.room,
        })
      } catch (e) {
        console.warn('[LiveKit] failed to log token payload', e)
      }

      roomRef.current = room
      setIsConnected(true)

      // Ensure we have listeners for runtime events
      registerRoomListeners(room)
      refreshParticipants()

      // Attach RTCPeerConnection debug listeners if accessible
      try {
        const findPc = (): RTCPeerConnection | null => {
          const asRecord = room as unknown as Record<string, unknown>
          try {
            const candidate =
              asRecord.pc ??
              (asRecord.engine as Record<string, unknown>)?.pc ??
              asRecord.peerConnection
            if (candidate instanceof RTCPeerConnection) return candidate
          } catch {
            // ignore
          }
          return null
        }

        const pc = findPc()
        if (pc) {
          console.log('[LiveKit][PC] RTCPeerConnection detected — attaching debug listeners')
          pc.addEventListener('iceconnectionstatechange', () =>
            console.log('[LiveKit][PC] iceConnectionState ->', pc.iceConnectionState),
          )
          pc.addEventListener('icegatheringstatechange', () =>
            console.log('[LiveKit][PC] iceGatheringState ->', pc.iceGatheringState),
          )
          pc.addEventListener('signalingstatechange', () =>
            console.log('[LiveKit][PC] signalingState ->', pc.signalingState),
          )
          pc.addEventListener('icecandidate', (ev: RTCPeerConnectionIceEvent) =>
            console.log('[LiveKit][PC] onicecandidate ->', ev.candidate),
          )
        } else {
          console.log('[LiveKit][PC] RTCPeerConnection not accessible (private).')
        }
      } catch (err) {
        console.warn('[LiveKit] Failed to attach PC debug listeners', err)
      }
    } catch (err) {
      const e = toError(err, 'LiveKit 서버와의 연결에 실패했습니다.')
      console.error('[LiveKit] Connection failed:', e)
      setError(e)
      await disconnect()
    } finally {
      setIsConnecting(false)
    }
  }, [meetId, displayName, disconnect, refreshParticipants, registerRoomListeners])

  useEffect(() => {
    if (!autoConnect) return
    if (meetId && displayName) void connect()
    else void disconnect()
  }, [autoConnect, meetId, displayName, connect, disconnect])

  useEffect(() => {
    return () => {
      void disconnect()
    }
  }, [disconnect])

  useEffect(() => {
    if (!isConnected || !localStream) return
    const room = roomRef.current
    const participant = room?.localParticipant
    if (!room || !participant) return

    const syncTrack = async (
      lp: LocalParticipant,
      source: Track.Source,
      nextTrack: MediaStreamTrack | null,
    ): Promise<void> => {
      const pub = lp.getTrackPublication(source)
      const current = pub?.track ?? null
      if (current && nextTrack && current.mediaStreamTrack?.id === nextTrack.id) return
      try {
        if (current) await lp.unpublishTrack(current)
        if (nextTrack) await lp.publishTrack(nextTrack, { source })
      } catch (err) {
        const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown'
        console.error(`[LiveKit] Failed to sync ${String(source)} track: ${msg}`)
      }
    }

    const video = pickActiveTrack(localStream.getVideoTracks())
    const audio = pickActiveTrack(localStream.getAudioTracks())
    void syncTrack(participant, Track.Source.Camera, video)
    void syncTrack(participant, Track.Source.Microphone, audio)
  }, [isConnected, localStream])

  const room = roomRef.current

  return {
    room,
    isConnecting,
    isConnected,
    error,
    livekitInfo,
    remoteParticipants,
    connect,
    disconnect,
  }
}

export default useLiveKitRoom
