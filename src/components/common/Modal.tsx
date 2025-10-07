import React from 'react'
import Button from '../atoms/Button'

interface ModalProps {
  isOpen: boolean
  title: string
  description?: string | React.ReactNode
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  cancelDisabled?: boolean
  confirmDisabled?: boolean
}

const Modal: React.FC<ModalProps> = ({
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
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 모달 본문 */}
      <div className="flex w-[484px] flex-col rounded-2xl bg-white px-8 pt-8 pb-[25px] text-start">
        {/* 제목 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-s1-bold text-start">{title}</h2>

          {/* 설명 */}
          {description && <div className="text-b5-medium text-gray-800">{description}</div>}

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
              onClick={onConfirm}
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

export default Modal
