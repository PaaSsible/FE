import { ChevronLeft, MessageSquarePlus } from 'lucide-react'
import React from 'react'

import SearchBar from '@/components/common/SearchBar'

interface ProjectsPageHeaderProps {
  /** 중앙에 표시될 제목 */
  title: string
  /** 제목 오른쪽에 표시할 카운트 (예: 지원 내역 3) */
  count?: number
  /** 왼쪽 화살표 클릭 시 동작 (없으면 숨김) */
  onBackClick?: () => void
  /** 검색창 (값 + 변경 핸들러 제공 시 노출) */
  searchValue?: string
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** 오른쪽 채팅 아이콘 버튼 클릭 핸들러 (없으면 숨김) */
  onChatClick?: () => void
}

export default function ProjectsPageHeader({
  title,
  count,
  onBackClick,
  searchValue,
  onSearchChange,
  onChatClick,
}: ProjectsPageHeaderProps) {
  return (
    <header className="mb-6 flex w-full items-center justify-between bg-gray-50">
      {/* 왼쪽: 화살표 + 제목 */}
      <div className="flex items-center gap-3">
        {onBackClick && (
          <button
            type="button"
            onClick={onBackClick}
            aria-label="뒤로가기"
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft size={28} className="text-gray-500" />
          </button>
        )}
        <div className="flex items-end gap-3">
          <h1 className="text-s1-bold text-gray-900">{title}</h1>
          {count !== undefined && <span className="text-s2-medium text-gray-500">{count}</span>}
        </div>
      </div>

      {/* 오른쪽: 검색창 또는 채팅 아이콘 */}
      <div className="flex items-center">
        {searchValue !== undefined && onSearchChange ? (
          <SearchBar value={searchValue} onChange={onSearchChange} />
        ) : onChatClick ? (
          <button
            type="button"
            aria-label="채팅 추가"
            onClick={onChatClick}
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)] transition hover:bg-gray-50"
          >
            <MessageSquarePlus size={20} className="text-gray-800" />
          </button>
        ) : null}
      </div>
    </header>
  )
}
