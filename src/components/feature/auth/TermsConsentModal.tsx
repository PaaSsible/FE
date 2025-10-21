import React from 'react'

import Checkbox from '@/components/atoms/Checkbox'
import Modal from '@/components/common/Modal'

interface TermsConsentModalProps {
  isOpen: boolean
  isChecked: boolean
  isSubmitting?: boolean
  onCheck: () => void
  onClose: () => void
  onConfirm: () => void
}

const TermsConsentModal: React.FC<TermsConsentModalProps> = ({
  isOpen,
  isChecked,
  isSubmitting = false,
  onCheck,
  onClose,
  onConfirm,
}) => {
  const actionsDisabled = !isChecked || isSubmitting

  const description = (
    <div className="flex flex-col gap-8">
      <p className="text-b5-medium text-gray-800">
        마이페이지에서 프로필을 설정하고 로컬잇과 함께 온라인 IT 협업을 효과적으로 진행해 보세요.
        <br />
        프로필 설정 이전에는 둘러보기만 가능합니다.
      </p>

      {/* 체크박스 */}
      <div className="flex items-center gap-2">
        <Checkbox checked={isChecked} onChange={onCheck} />
        <span className="text-b5-medium text-gray-550">
          모든{' '}
          <a href="/policy/terms" target="_blank" className="text-locallit-red-500">
            이용약관
          </a>{' '}
          및{' '}
          <a href="/policy/privacy" target="_blank" className="text-locallit-red-500">
            개인정보 처리방침
          </a>
          에 동의합니다.
        </span>
      </div>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      title="만나서 반갑습니다!"
      description={description}
      cancelLabel="둘러보기"
      confirmLabel="프로필 설정하러 가기"
      onCancel={onClose}
      onConfirm={onConfirm}
      cancelDisabled={actionsDisabled}
      confirmDisabled={actionsDisabled}
    />
  )
}

export default TermsConsentModal
