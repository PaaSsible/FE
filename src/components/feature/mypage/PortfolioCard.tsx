import { EllipsisVertical } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { formatDate } from '@/utils/relativeTime'

interface PortfolioCardProps {
  id: number
  userId?: number | null
  positionName: string
  title: string
  summary?: string | null
  contribution?: number | null
  mainCategory?: string | null
  subCategory?: string | null
  generatedByAi?: boolean | null
  createdAt: string
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
}

export default function PortfolioCard({
  id,
  title,
  summary,
  contribution,
  mainCategory,
  subCategory,
  positionName,
  generatedByAi = false,
  createdAt,
  onEdit,
  onDelete,
}: PortfolioCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const hasActions = Boolean(onEdit || onDelete)
  const displayTag = generatedByAi ? '로컬잇' : null
  const showContribution = generatedByAi && contribution !== null && contribution !== undefined
  const showCategory = generatedByAi && (mainCategory || subCategory)
  const shouldShowFallbackPosition = !showCategory && !showContribution

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])

  useEffect(() => {
    if (!isMenuOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen, closeMenu])

  const handleEdit = () => {
    onEdit?.(id)
    closeMenu()
  }

  const handleDelete = () => {
    onDelete?.(id)
    closeMenu()
  }

  return (
    <div className="overflow-hideen relative flex h-[263px] w-full flex-col rounded-md bg-white">
      {/* 상단 이미지 */}
      <div className="h-[130px] w-full rounded-t-md bg-gray-300" />

      {/* 내용 영역 */}
      <div className="flex h-[133px] flex-col justify-between p-4 text-left">
        {/* 상단 텍스트 */}
        <div className="flex flex-col gap-[2px]">
          <div className="flex items-center gap-2">
            {displayTag && (
              <span className="bg-locallit-red-500 w-[43px] rounded-full text-center text-[12px] font-medium text-white">
                {displayTag}
              </span>
            )}
            <span className="text-[15px] font-semibold text-gray-800">{title}</span>
          </div>
          {summary && <p className="line-clamp-1 text-[13px] text-gray-600">{summary}</p>}
        </div>

        {/* 하단 정보 */}
        <div>
          <div className="text-[12px] text-gray-900">{formatDate(createdAt)}</div>

          {showContribution && (
            <div className="flex gap-2 text-[12px] font-medium text-gray-900">
              <div>
                기여도: <span className="font-semibold">{contribution}%</span>
              </div>
              <div>포지션: {positionName}</div>
            </div>
          )}

          {/* 카테고리 + 메뉴 */}
          <div className="mt-1 flex items-center justify-between">
            {showCategory && (
              <div className="text-[12px] text-gray-500">
                {mainCategory} &gt; {subCategory}
              </div>
            )}
            {shouldShowFallbackPosition && (
              <div className="text-[12px] text-gray-900">포지션: {positionName}</div>
            )}

            {hasActions && (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  aria-label="포트폴리오 메뉴 열기"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="-mr-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-200"
                >
                  <EllipsisVertical size={20} />
                </button>

                {isMenuOpen && (
                  <div className="absolute -right-3 z-[9999] mt-2 w-[158px] rounded-md bg-gray-500 shadow-lg">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="font-regular w-full px-4 py-[10px] text-left text-white hover:bg-gray-600/70"
                      >
                        수정
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="font-regular w-full px-4 py-[10px] text-left text-white hover:bg-gray-600/70"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
