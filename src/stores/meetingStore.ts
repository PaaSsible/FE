'use client'
import type { RemoteAudioTrack, RemoteVideoTrack } from 'livekit-client'
import { create } from 'zustand'

export type MeetingMode = 'meeting' | 'work'

export interface Participant {
  userId: string
  userName: string
  profileImageUrl?: string
  isMicOn: boolean
  isCameraOn: boolean
  isSpeaking: boolean
  audioTrack?: RemoteAudioTrack | null
  videoTrack?: RemoteVideoTrack | null
}

export interface MeetingMember {
  userId: string
  userName: string
  profileImageUrl: string | null
}

export interface MeetingChatMessage {
  id: string
  meetId: number | null
  // senderId and targetUserId are strings (user ids). Use null for no target.
  senderId: string
  senderName: string
  targetUserId: string | null
  content: string
  timestamp: string
}

export interface MeetingState {
  mode: MeetingMode
  setMode: (mode: MeetingMode) => void

  participants: Participant[]
  addOrUpdateParticipant: (p: Participant) => void
  updateParticipant: (userId: string, data: Partial<Participant>) => void
  removeParticipant: (userId: string) => void
  clearParticipants: () => void

  setSpeaker: (userId: string | null) => void

  isTimerVisible: boolean
  setTimerVisible: (visible: boolean) => void

  isCurrentUserHost: boolean
  setCurrentUserHost: (isHost: boolean) => void

  // Current authenticated user info (for displaying main video when camera is off)
  currentUserId: string | null
  currentUserName: string | null
  currentUserProfileImageUrl: string | null
  setCurrentUser: (
    userId: string | null,
    userName: string | null,
    profileImageUrl: string | null,
  ) => void
  currentUserMedia: {
    isMicOn: boolean
    isCameraOn: boolean
  }
  setCurrentUserMedia: (media: Partial<{ isMicOn: boolean; isCameraOn: boolean }>) => void

  presentMembers: MeetingMember[]
  absentMembers: MeetingMember[]
  setAttendance: (present: MeetingMember[], absent: MeetingMember[]) => void
  clearAttendance: () => void

  inactiveUserIds: string[]
  setInactiveUserIds: (userIds: string[]) => void
  removeInactiveUserIds: (userIds: string[]) => void
  clearInactiveUserIds: () => void

  silentThresholdSeconds: number | null
  silentSnapshotAt: string | null
  setSilentMetadata: (metadata: {
    thresholdSeconds?: number | null
    snapshotAt?: string | null
  }) => void

  highlightedSpeakerUserId: string | null
  setHighlightedSpeakerUserId: (userId: string | null) => void

  isCurrentUserSpeaking: boolean
  setCurrentUserSpeaking: (speaking: boolean) => void

  timerState: {
    status: 'idle' | 'running' | 'paused' | 'ended'
    durationSeconds: number
    remainingSeconds: number
    remainingSecondsSynced: number
    serverStartTime: string | null
    lastSyncedAt: number | null
  }
  applyTimerEvent: (event: {
    type: 'START' | 'PAUSE' | 'RESUME' | 'END'
    duration?: number | null
    serverStartTime?: string | null
  }) => void
  resetTimerState: () => void

  publicMessages: MeetingChatMessage[]
  appendPublicMessage: (message: MeetingChatMessage) => void
  setPublicMessages: (messages: MeetingChatMessage[]) => void
  clearPublicMessages: () => void
}

export const useMeetingStore = create<MeetingState>((set) => ({
  mode: 'meeting',
  setMode: (mode) => set({ mode }),

  participants: [],
  addOrUpdateParticipant: (p) =>
    set((state) => {
      const exists = state.participants.find((x) => x.userId === p.userId)
      if (exists) {
        return {
          participants: state.participants.map((x) => (x.userId === p.userId ? { ...x, ...p } : x)),
        }
      }
      return { participants: [...state.participants, p] }
    }),
  updateParticipant: (userId, data) =>
    set((state) => ({
      participants: state.participants.map((p) => (p.userId === userId ? { ...p, ...data } : p)),
    })),
  removeParticipant: (userId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.userId !== userId),
    })),
  clearParticipants: () => set({ participants: [] }),

  setSpeaker: (userId) =>
    set((state) => ({
      participants: state.participants.map((p) => ({
        ...p,
        isSpeaking: userId ? p.userId === userId : false,
      })),
    })),

  isTimerVisible: false,
  setTimerVisible: (visible) => set({ isTimerVisible: visible }),

  isCurrentUserHost: false,
  setCurrentUserHost: (isHost) => set({ isCurrentUserHost: isHost }),

  // Current authenticated user info
  currentUserId: null,
  currentUserName: null,
  currentUserProfileImageUrl: null,
  setCurrentUser: (userId, userName, profileImageUrl) =>
    set((state) => ({
      currentUserId: userId,
      currentUserName: userName,
      currentUserProfileImageUrl: profileImageUrl,
      currentUserMedia: userId
        ? state.currentUserMedia
        : {
            isMicOn: false,
            isCameraOn: false,
          },
    })),
  currentUserMedia: {
    isMicOn: false,
    isCameraOn: false,
  },
  setCurrentUserMedia: (media) =>
    set((state) => ({
      currentUserMedia: {
        ...state.currentUserMedia,
        ...media,
      },
    })),

  presentMembers: [],
  absentMembers: [],
  setAttendance: (present, absent) =>
    set((state) => {
      const presentMap = new Map(present.map((member) => [member.userId, member]))
      return {
        presentMembers: present,
        absentMembers: absent,
        participants: state.participants.map((participant) => {
          const matchedMember = presentMap.get(participant.userId)
          if (!matchedMember) {
            return participant
          }
          return {
            ...participant,
            userName: matchedMember.userName ?? participant.userName,
            profileImageUrl: matchedMember.profileImageUrl ?? participant.profileImageUrl,
          }
        }),
      }
    }),
  clearAttendance: () => set({ presentMembers: [], absentMembers: [] }),

  inactiveUserIds: [],
  setInactiveUserIds: (userIds) => set({ inactiveUserIds: userIds }),
  removeInactiveUserIds: (userIds) =>
    set((state) => ({
      inactiveUserIds: state.inactiveUserIds.filter((id) => !userIds.includes(id)),
    })),
  clearInactiveUserIds: () => set({ inactiveUserIds: [] }),

  silentThresholdSeconds: null,
  silentSnapshotAt: null,
  setSilentMetadata: ({ thresholdSeconds, snapshotAt }) =>
    set((state) => ({
      silentThresholdSeconds:
        typeof thresholdSeconds === 'number'
          ? thresholdSeconds
          : thresholdSeconds === null
            ? null
            : state.silentThresholdSeconds,
      silentSnapshotAt:
        typeof snapshotAt === 'string'
          ? snapshotAt
          : snapshotAt === null
            ? null
            : state.silentSnapshotAt,
    })),

  highlightedSpeakerUserId: null,
  setHighlightedSpeakerUserId: (userId) => set({ highlightedSpeakerUserId: userId }),

  isCurrentUserSpeaking: false,
  setCurrentUserSpeaking: (speaking) => set({ isCurrentUserSpeaking: speaking }),

  timerState: {
    status: 'idle',
    durationSeconds: 0,
    remainingSeconds: 0,
    remainingSecondsSynced: 0,
    serverStartTime: null,
    lastSyncedAt: null,
  },
  applyTimerEvent: (event) =>
    set((state) => {
      const now = Date.now()
      const prev = state.timerState

      const computeRemainingFromPrev = (): number => {
        if (prev.status !== 'running' || !prev.serverStartTime) {
          return prev.remainingSeconds
        }
        const elapsedMs = now - Date.parse(prev.serverStartTime)
        const elapsedSeconds = Math.max(0, elapsedMs / 1000)
        return Math.max(0, prev.remainingSecondsSynced - elapsedSeconds)
      }

      switch (event.type) {
        case 'START': {
          const duration = Math.max(0, Number(event.duration ?? 0))
          const startTime = event.serverStartTime ?? new Date().toISOString()
          return {
            timerState: {
              status: 'running',
              durationSeconds: duration,
              remainingSeconds: duration,
              remainingSecondsSynced: duration,
              serverStartTime: startTime,
              lastSyncedAt: now,
            },
          }
        }
        case 'RESUME': {
          const remainingBeforeResume = computeRemainingFromPrev()
          const startTime = event.serverStartTime ?? new Date().toISOString()
          return {
            timerState: {
              ...prev,
              status: 'running',
              remainingSeconds: remainingBeforeResume,
              remainingSecondsSynced: remainingBeforeResume,
              serverStartTime: startTime,
              lastSyncedAt: now,
            },
          }
        }
        case 'PAUSE': {
          const remainingAfterPause = computeRemainingFromPrev()
          return {
            timerState: {
              ...prev,
              status: 'paused',
              remainingSeconds: remainingAfterPause,
              remainingSecondsSynced: remainingAfterPause,
              serverStartTime: null,
              lastSyncedAt: now,
            },
          }
        }
        case 'END': {
          return {
            timerState: {
              status: 'ended',
              durationSeconds: prev.durationSeconds,
              remainingSeconds: 0,
              remainingSecondsSynced: 0,
              serverStartTime: null,
              lastSyncedAt: now,
            },
          }
        }
        default:
          return { timerState: prev }
      }
    }),
  resetTimerState: () =>
    set({
      timerState: {
        status: 'idle',
        durationSeconds: 0,
        remainingSeconds: 0,
        remainingSecondsSynced: 0,
        serverStartTime: null,
        lastSyncedAt: null,
      },
    }),

  publicMessages: [],
  appendPublicMessage: (message) =>
    set((state) => {
      if (state.publicMessages.some((m) => m.id === message.id)) {
        return state
      }
      return { publicMessages: [...state.publicMessages, message] }
    }),
  setPublicMessages: (messages) => set({ publicMessages: messages }),
  clearPublicMessages: () => set({ publicMessages: [] }),
}))
