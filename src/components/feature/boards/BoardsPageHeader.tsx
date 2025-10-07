import React from 'react'
import SearchBar from '../common/SearchBar'
import Button from '@/components/atoms/Button'
import { ChevronLeft } from 'lucide-react'

interface BoardsPageHeaderProps {
  /** 중앙에 표시될 페이지 제목 */
  title: string
  /** 왼쪽 화살표 클릭 시 동작 (없으면 숨김) */
  onBackClick?: () => void
  /** 검색창 (값 + 변경 핸들러 제공 시 노출) */
  searchValue?: string
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** 오른쪽 버튼 텍스트 + 클릭 핸들러 제공 시 노출 */
  rightButtonLabel?: string
  onRightButtonClick?: () => void
}

const BoardsPageHeader: React.FC<BoardsPageHeaderProps> = ({
  title,
  onBackClick,
  searchValue,
  onSearchChange,
  rightButtonLabel,
  onRightButtonClick,
}) => {
  return (
    <header className="flex w-full items-center justify-between bg-gray-50">
      {/* 왼쪽: 화살표 + 제목 */}
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
        <h1 className="text-s1-bold">{title}</h1>
      </div>

      {/* 오른쪽: SearchBar 또는 Button */}
      <div className="flex items-center">
        {searchValue !== undefined && onSearchChange ? (
          <SearchBar value={searchValue} onChange={onSearchChange} />
        ) : rightButtonLabel && onRightButtonClick ? (
          <Button shape="square" onClick={onRightButtonClick}>
            {rightButtonLabel}
          </Button>
        ) : null}
      </div>
    </header>
  )
}

export default BoardsPageHeader
