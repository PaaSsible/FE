import { ChevronLeft } from 'lucide-react'
import React from 'react'

interface MypageHeaderProps {
  /** 중앙에 표시될 페이지 제목 */
  title: string
  /** 왼쪽 화살표 클릭 시 동작 (없으면 숨김) */
  onBackClick?: () => void
  /** 선택적 카운트 (예: 알림 개수, 포트폴리오 수 등) */
  count?: number
}

export const MypageHeader: React.FC<MypageHeaderProps> = ({ title, onBackClick, count }) => {
  return (
    <header className="mb-6 flex w-full items-center justify-between bg-gray-50">
      <div className="flex items-center gap-4">
        {onBackClick && (
          <button
            type="button"
            onClick={onBackClick}
            aria-label="뒤로가기"
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={36} className="text-gray-500" />
          </button>
        )}
        <div className="text-s1-bold flex items-center gap-2">
          {title}
          {typeof count === 'number' && <span className="text-gray-500">{count}</span>}
        </div>
      </div>
    </header>
  )
}
