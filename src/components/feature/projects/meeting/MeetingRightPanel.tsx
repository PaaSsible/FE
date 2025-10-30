'use client'

import { useState, type ReactElement } from 'react'
import toast from 'react-hot-toast'

import SegmentedControl from '@/components/atoms/SegmentedControl'
import Modal from '@/components/common/Modal'
// import { mockParticipants } from '@/constants/mockParticipants'
import { useMeetingStore } from '@/stores/meetingStore'

import AbsentMembersSection from './AbsentMembersSection'
import ChatSection from './ChatSection'
import PresentMembersSection from './PresentMembersSection'

interface MeetingRightPanelProps {
  sendPublicMessage?: (params: {
    content: string
    targetUserId?: string | null
    senderName?: string | null
  }) => boolean
  onRequestRandomSpeaker?: () => void
}

export default function MeetingRightPanel({
  sendPublicMessage,
  onRequestRandomSpeaker,
}: MeetingRightPanelProps): ReactElement {
  const [activeTab, setActiveTab] = useState<'participants' | 'chat'>('participants')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isTimerVisible = useMeetingStore((state) => state.isTimerVisible)
  const setTimerVisible = useMeetingStore((state) => state.setTimerVisible)
  const isCurrentUserHost = useMeetingStore((state) => state.isCurrentUserHost)

  const handleSendAlertClick = (userName: string) => {
    setSelectedUser(userName)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleConfirmClick = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
    toast.success('알림이 발송되었습니다.')
  }

  return (
    <>
      <aside className="text-gray-0 flex w-[384px] flex-col bg-gray-800">
        <div className="flex flex-col items-center pt-5">
          <SegmentedControl
            variant={activeTab === 'participants' ? 'participant' : 'chatting'}
            onChange={(variant) =>
              setActiveTab(variant === 'participant' ? 'participants' : 'chat')
            }
          />
        </div>

        <div className="mt-[50px] flex flex-1 flex-col justify-between">
          <div className="flex-1 space-y-8 overflow-y-auto">
            {activeTab === 'participants' ? (
              <div className="flex flex-col gap-[55px] px-[30px]">
                <PresentMembersSection />
                <AbsentMembersSection onSendAlert={handleSendAlertClick} />
              </div>
            ) : (
              <ChatSection sendPublicMessage={sendPublicMessage} />
            )}
          </div>

          {/* 하단 버튼 영역 */}
          {activeTab === 'participants' && isCurrentUserHost && (
            <div className="text-b5-medium sticky bottom-0 flex justify-center gap-4 px-6 py-5">
              <button
                className="text-gray-0 h-[47px] w-[152px] rounded-md bg-gray-700 py-[10px] hover:bg-gray-600"
                onClick={() => {
                  if (typeof onRequestRandomSpeaker === 'function') {
                    void onRequestRandomSpeaker()
                  }
                }}
              >
                발언자 랜덤 선정
              </button>
              <button
                className={`h-[47px] w-[152px] rounded-md transition ${
                  isTimerVisible
                    ? 'bg-locallit-red-500 text-white'
                    : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                }`}
                onClick={() => setTimerVisible(!isTimerVisible)}
              >
                작업 타이머 시작
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 알림 모달 */}
      <Modal
        isOpen={isModalOpen}
        title={
          <div>
            결석자 &apos;{selectedUser ?? ''}&apos;에게 알림을
            <br />
            보내시겠습니까?
          </div>
        }
        description="보낸 알림은 취소할 수 없습니다."
        cancelLabel="취소"
        confirmLabel="보내기"
        onCancel={handleCloseModal}
        onConfirm={handleConfirmClick}
      />
    </>
  )
}
