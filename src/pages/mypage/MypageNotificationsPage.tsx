import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState, type JSX } from 'react'

import { getUserNotifications } from '@/apis/user.api'
import Chip from '@/components/atoms/Chip'
import { MypageHeader } from '@/components/feature/mypage/MypageHeader'
import type { GetUserNotifications } from '@/types/apis/user/user.api.types'
import type { Notification, NotificationTypeEnum } from '@/types/entities/user/user.types'
import { getAuthUser } from '@/utils/authToken'
import 'dayjs/locale/ko'

dayjs.extend(relativeTime)
dayjs.locale('ko')

const notificationTypeKorToEngMap: Record<string, NotificationTypeEnum> = {
  지원: 'RECRUIT',
  회의: 'MEET',
  채팅: 'CHAT',
}

export default function MypageNotificationsPage(): JSX.Element {
  const [selectedType, setSelectedType] = useState<'모두' | '지원' | '회의' | '채팅'>('모두')
  const chips = ['모두', '지원', '회의', '채팅'] as const
  const user = getAuthUser()
  const userId = user?.id
  const [notifications, setNotifications] = useState<Notification[]>()

  useEffect(() => {
    const getData = async () => {
      let query: GetUserNotifications['Query'] = {}
      if (selectedType !== '모두') {
        query = {
          type: notificationTypeKorToEngMap[selectedType],
        }
      }
      const response = await getUserNotifications(query)
      setNotifications(response.data)
    }
    if (userId) {
      void getData()
    }
  }, [userId, selectedType])

  return (
    <div className="min-h-screen bg-gray-50 px-[100px]">
      <MypageHeader title="알림" />

      {/* Chip */}
      <div className="mt-6 flex gap-[10px]">
        {chips.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            selected={selectedType === chip}
            onClick={() => setSelectedType(chip)}
          />
        ))}
      </div>

      {/* List */}
      <div className="mt-6 flex flex-col gap-4">
        {notifications && notifications.length === 0 ? (
          <div className="mt-40 flex flex-col items-center justify-center">
            <p className="text-s1-bold text-gray-700">알림이 없습니다.</p>
            <p className="text-b2-medium mt-2 text-gray-500">
              새로운 지원, 회의, 채팅 알림이 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          notifications &&
          notifications.map((n) => (
            <div
              key={n.id}
              className="relative rounded-xl bg-white p-6 text-left shadow-[0px_0px_20px_0px_#0000001A]"
            >
              {/* 오른쪽 상단 시간 */}
              <span className="text-l2-medium absolute top-6 right-6 text-gray-500">
                {dayjs(n.createdAt).fromNow()}
              </span>

              <p className="text-b5-bold text-gray-900">{n.title}</p>
              <p className="text-l1-medium mt-2 leading-relaxed whitespace-pre-line text-gray-700">
                {n.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
