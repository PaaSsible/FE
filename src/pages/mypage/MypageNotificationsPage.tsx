'use client'

import { useState } from 'react'

import Chip from '@/components/atoms/Chip'
import { MypageHeader } from '@/components/feature/mypage/MypageHeader'

interface Notification {
  id: number
  type: '지원' | '회의' | '채팅' | '기타'
  title: string
  description: string // \n 로 줄바꿈
  time: string
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: '지원',
    title: '새로운 지원이 도착했어요!',
    description:
      '박지윤 님이 [캠퍼스 푸드맵 프로젝트]에 지원서를 제출했어요.\n함께할 팀원을 검토하고 빠르게 인터뷰를 진행해 보세요.',
    time: '15분 전',
  },
  {
    id: 2,
    type: '지원',
    title: '지원하신 프로젝트의 결과가 도착했어요.',
    description:
      '[스터디허브 플랫폼] 팀에서 함께하고 싶다는 소식을 전했어요!\n팀 페이지에서 포지션을 선택하고 협업을 시작해 보세요.',
    time: '1시간 전',
  },
  {
    id: 3,
    type: '회의',
    title: '회의가 시작됐어요! 지금 바로 참여하세요.',
    description:
      '[AI 포트폴리오 자동화 프로젝트] 팀의 온라인 회의가 시작됐습니다.\n팀원들과의 논의를 놓치지 않도록 바로 입장해 보세요.',
    time: '2시간 전',
  },
  {
    id: 4,
    type: '회의',
    title: '홍길동 님이 회의 참여를 요청했어요.',
    description:
      '[프로젝트 매칭 플랫폼 개선] 팀의 회의 초대 요청을 받았어요.\n회의 링크를 통해 실시간 피드백에 참여해 주세요.',
    time: '어제',
  },
  {
    id: 5,
    type: '채팅',
    title: '팀 채팅에 새로운 메시지가 도착했어요.',
    description:
      '이승주 님: “오늘 회의 일정 다시 한 번 확인 부탁드려요!”\n채팅방을 열어 메시지를 확인해 보세요.',
    time: '2일 전',
  },
]

export default function MypageNotificationsPage() {
  const [selectedType, setSelectedType] = useState<'모두' | '지원' | '회의' | '채팅'>('모두')
  const chips = ['모두', '지원', '회의', '채팅'] as const

  const filtered =
    selectedType === '모두'
      ? mockNotifications
      : mockNotifications.filter((n) => n.type === selectedType)

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
        {filtered.length === 0 ? (
          <div className="mt-40 flex flex-col items-center justify-center">
            <p className="text-s1-bold text-gray-700">알림이 없습니다.</p>
            <p className="text-b2-medium mt-2 text-gray-500">
              새로운 지원, 회의, 채팅 알림이 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          filtered.map((n) => (
            <div
              key={n.id}
              className="relative rounded-xl bg-white p-6 text-left shadow-[0px_0px_20px_0px_#0000001A]"
            >
              {/* 오른쪽 상단 시간 */}
              <span className="text-l2-medium absolute top-6 right-6 text-gray-500">{n.time}</span>

              <p className="text-b5-bold text-gray-900">{n.title}</p>
              <p className="text-l1-medium mt-2 leading-relaxed whitespace-pre-line text-gray-700">
                {n.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
