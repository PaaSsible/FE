'use client'

import { useState } from 'react'

import Button from '@/components/atoms/Button'
import Modal from '@/components/common/Modal'

export default function PortfolioCreationNotice() {
  const [isThrowModalOpen, setIsThrowModalOpen] = useState(false)
  const [isGenreateModalOpen, setIsGenerateModalOpen] = useState(false)

  const mockProject = {
    boardId: 101,
    boardName: '프로젝트 어쩌고',
    mainCategory: '공모전/대회',
    subCategory: '융합 프로젝트',
  }

  return (
    <div className="bg-locallit-red-100 mb-6 flex flex-col justify-between rounded-lg p-6 text-gray-900 sm:flex-row sm:items-center">
      <div>
        <p className="font-medium">
          ‘{mockProject.boardName}’의 진행이 완료되었습니다. 포트폴리오를 자동으로 생성하시겠습니까?
        </p>
        <div className="mt-2 text-left text-sm text-gray-700">
          {mockProject.mainCategory} {'>'} {mockProject.subCategory}
        </div>
      </div>

      <div className="mt-4 flex gap-3 sm:mt-0">
        <Button variant="primary" onClick={() => setIsGenerateModalOpen(true)}>
          생성하기
        </Button>
        <Button variant="secondary" onClick={() => setIsThrowModalOpen(true)}>
          버리기
        </Button>
      </div>

      <Modal
        isOpen={isGenreateModalOpen}
        title="프로젝트의 포트폴리오를 자동으로 생성하시겠어요?"
        description="포트폴리오 관리탭에서 언제든 수정, 삭제가 가능합니다."
        cancelLabel="뒤로가기"
        confirmLabel="생성하기"
        onCancel={() => setIsGenerateModalOpen(false)}
        onConfirm={() => setIsGenerateModalOpen(false)}
      />

      <Modal
        isOpen={isThrowModalOpen}
        title="프로젝트를 버리시겠어요?"
        description={
          <p>
            버려진 프로젝트는 대시보드에서 확인은 가능하지만 <br />
            포트폴리오 자동 생성 기능은 활용할 수 없습니다. <br />
            그래도 버리시겠어요?
          </p>
        }
        cancelLabel="뒤로가기"
        confirmLabel="버리기"
        onCancel={() => setIsThrowModalOpen(false)}
        onConfirm={() => setIsThrowModalOpen(false)}
      />
    </div>
  )
}
