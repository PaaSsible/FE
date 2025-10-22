import { Check } from 'lucide-react'
import React, { useState } from 'react'

import Button from '@/components/atoms/Button'
import { positionsArray } from '@/types/entities/recruit-post/recruitPost.schemas'
import type { Position } from '@/types/entities/recruit-post/recruitPost.types'

interface ModalProps {
  isOpen: boolean
  title: string
  description?: string | React.ReactNode
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: (postion: Position) => void
  cancelDisabled?: boolean
  confirmDisabled?: boolean
}

const PositionSelectModal: React.FC<ModalProps> = ({
  isOpen,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  cancelDisabled,
  confirmDisabled,
}) => {
  const [position, setPosition] = useState<Position>()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 모달 본문 */}
      <div className="flex w-[484px] flex-col rounded-2xl bg-white px-8 pt-8 pb-[25px] text-start">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-[15px]">
            {/* 제목 */}
            <h2 className="text-s1-bold text-start">{title}</h2>
            {/* 설명 */}
            {description && <div className="text-b5-medium text-gray-800">{description}</div>}
          </div>

          <ul className="h flex h-[8.25rem] w-full flex-col overflow-y-scroll">
            {positionsArray.map((p, index) => (
              <li
                key={index}
                className="flex justify-between bg-neutral-100 p-3"
                onClick={() => setPosition({ id: index + 1, name: p })}
              >
                {p}
                {p === position?.name && <Check className="h-5 w-5" />}
              </li>
            ))}
          </ul>

          {/* 버튼 영역 */}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              size="big"
              onClick={onCancel}
              className="flex-1"
              disabled={cancelDisabled}
            >
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              size="big"
              onClick={() => position && onConfirm(position)}
              className="flex-1"
              disabled={confirmDisabled}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PositionSelectModal
