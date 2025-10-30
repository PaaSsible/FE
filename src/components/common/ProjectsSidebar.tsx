import { MessageCircleMore, TrendingUp, MonitorPlay, LayoutGrid, FilePlus2 } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

import { useCreateBoardPortfolio } from '@/hooks/projects/useCreateBoardPortfolio'

import Button from '../atoms/Button'

import Modal from './Modal'

export default function ProjectsSidebar() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false)
  const boardId = projectId ? Number(projectId) : NaN

  const { createBoardPortfolio, isSubmitting } = useCreateBoardPortfolio({
    onSuccess: () => {
      setIsPortfolioModalOpen(false)
      void navigate('/mypage/portfolio')
    },
  })

  const handleCloseModal = () => {
    if (isSubmitting) {
      return
    }
    setIsPortfolioModalOpen(false)
  }

  const handleConfirmModal = async () => {
    try {
      await createBoardPortfolio({ boardId })
    } catch (error) {
      // already handled via toast inside hook
    }
  }

  const navItems = [
    { label: '칸반보드', path: 'board', icon: <LayoutGrid size={18} /> },
    { label: '프로젝트 현황', path: 'status', icon: <TrendingUp size={18} /> },
    { label: '온라인 회의', path: 'meeting', icon: <MonitorPlay size={18} /> },
    { label: '채팅', path: 'chat', icon: <MessageCircleMore size={18} /> },
    { label: '포트폴리오 생성', path: null, icon: <FilePlus2 size={18} /> },
  ]

  return (
    <aside className="bg-gray-0 relative z-10 flex h-[954px] w-[280px] flex-col pt-6 pb-6 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.12)]">
      {/* 상단 메뉴 */}
      <nav className="flex flex-col gap-1 px-[24px]">
        {navItems
          .filter((item) => item.path) // path가 있는 것만 NavLink로
          .map((item) => (
            <NavLink
              key={item.path}
              to={`/projects/${projectId}/${item.path}`}
              className={({ isActive }) =>
                `text-b5-medium flex h-[44px] w-[232px] items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive ? 'bg-locallit-red-300 text-gray-900' : 'text-gray-500 hover:bg-gray-100'
                } `
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
      </nav>

      {/* 구분선 */}
      <div className="my-4 border-t border-gray-200" />

      {/* 액션 버튼 */}
      <div className="px-[24px]">
        <Button
          onClick={() => setIsPortfolioModalOpen(true)}
          className="h-[44px] w-[232px] cursor-pointer justify-start gap-3 !bg-gray-400"
        >
          <FilePlus2 size={18} />
          <span>포트폴리오 생성</span>
        </Button>
      </div>

      {/* 모달 */}
      {isPortfolioModalOpen && (
        <Modal
          isOpen
          title="포트폴리오를 생성하시겠습니까?"
          description={
            <p>
              현재 프로젝트의 작업 내용과 역할을 기반으로 <br /> AI가 자동으로 포트폴리오를
              생성합니다.
              <br />
              생성된 포트폴리오는 이후 자유롭게 수정할 수 있습니다.
            </p>
          }
          confirmLabel="생성하기"
          cancelLabel="취소"
          onConfirm={() => {
            void handleConfirmModal()
          }}
          onCancel={handleCloseModal}
          confirmDisabled={isSubmitting}
          cancelDisabled={isSubmitting}
        />
      )}
    </aside>
  )
}
