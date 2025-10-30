import { useEffect } from 'react'
import toast from 'react-hot-toast'

import { getMeetAttendance } from '@/apis/meet.api'
import { useMeetingStore } from '@/stores/meetingStore'

const normalizeMembers = (
  members: Array<{ userId: number; userName: string; profileImageUrl: string | null }> | undefined,
) =>
  (members ?? []).map((member) => ({
    userId: String(member.userId),
    userName: member.userName,
    profileImageUrl: member.profileImageUrl ?? null,
  }))

export function useMeetingAttendance(meetId?: number): void {
  const setAttendance = useMeetingStore((state) => state.setAttendance)
  const setCurrentUserHost = useMeetingStore((state) => state.setCurrentUserHost)
  const setCurrentUser = useMeetingStore((state) => state.setCurrentUser)

  useEffect(() => {
    if (!meetId) return

    let isCancelled = false

    const fetchAttendance = async () => {
      try {
        const response = await getMeetAttendance({ meetId })
        const data = response.data

        if (isCancelled) return

        if (!data) {
          setAttendance([], [])
          setCurrentUserHost(false)
          setCurrentUser(null, null, null)
          return
        }

        setAttendance(normalizeMembers(data.presentMembers), normalizeMembers(data.absentMembers))
        setCurrentUserHost(Boolean(data.isHostUser))
        setCurrentUser(String(data.userId), data.userName ?? null, data.profileImageUrl ?? null)
      } catch (error) {
        if (isCancelled) return
        console.warn('[Meeting] Failed to fetch attendance', error)
        toast.error('회의 참석 정보를 불러오지 못했습니다.')
      }
    }

    void fetchAttendance()

    return () => {
      isCancelled = true
    }
  }, [meetId, setAttendance, setCurrentUser, setCurrentUserHost])
}
