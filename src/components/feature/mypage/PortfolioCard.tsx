import clsx from 'clsx'
import { EllipsisVertical } from 'lucide-react'
import type { KeyboardEvent } from 'react'
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
  imageUrl?: string | null
  createdAt: string
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onSelect?: (id: number) => void
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
  imageUrl,
  onEdit,
  onDelete,
  onSelect,
}: PortfolioCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const hasActions = Boolean(onEdit || onDelete)
  const displayTag = generatedByAi ? 'CoDo' : null
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

  const handleCardClick = () => {
    onSelect?.(id)
  }

  const handleDelete = () => {
    onDelete?.(id)
    closeMenu()
  }

  const interactiveProps =
    typeof onSelect === 'function'
      ? {
          role: 'button' as const,
          tabIndex: 0,
          onClick: handleCardClick,
          onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              handleCardClick()
            }
          },
        }
      : {}

  return (
    <div
      {...interactiveProps}
      className={clsx(
        'overflow-hideen relative flex h-[250px] w-full flex-col rounded-md bg-white shadow-[0_0_20px_0_#0000001A]',
        typeof onSelect === 'function' ? 'cursor-pointer hover:shadow-md' : '',
      )}
    >
      {/* 상단 이미지 */}
      <div className="relative h-[125px] w-full overflow-hidden rounded-t-md bg-gray-300">
        <img
          src={imageUrl || '/assets/images/portfolio_default.png'}
          alt={`${title} 대표 이미지`}
          className="h-full w-full object-cover"
        />
      </div>

      {/* 내용 영역 */}
      <div className="flex h-[125px] flex-col justify-between p-[14px] text-left">
        {/* 상단 텍스트 */}
        <div className="flex flex-col gap-[2px]">
          <div className="flex items-center gap-2">
            {displayTag && (
              <span className="bg-locallit-red-500 text-l2-medium w-[42px] rounded-full text-center text-gray-50">
                {displayTag}
              </span>
            )}
            <span className="text-b5-bold text-gray-850">{title}</span>
          </div>
          {summary && <p className="text-l2-medium text-gray-550 line-clamp-1">{summary}</p>}
        </div>

        {/* 하단 정보 */}
        <div>
          {showCategory && (
            <div className="text-l2-medium text-gray-550">
              {mainCategory} &gt; {subCategory}
            </div>
          )}
          {showContribution && (
            <div className="text-l2-medium flex gap-[6px] text-gray-800">
              <div>기여도: {contribution}%</div>·<div>포지션: {positionName}</div>
            </div>
          )}
          {shouldShowFallbackPosition && (
            <div className="text-l2-medium text-gray-800">포지션: {positionName}</div>
          )}

          {/* 카테고리 + 메뉴 */}
          <div className="flex items-center justify-between">
            <div className="text-l2-medium text-gray-800">생성일: {formatDate(createdAt)}</div>

            {hasActions && (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  aria-label="포트폴리오 메뉴 열기"
                  onClick={(event) => {
                    event.stopPropagation()
                    setIsMenuOpen((prev) => !prev)
                  }}
                  className="-mt-2 -mr-2 flex h-6 w-6 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-200"
                >
                  <EllipsisVertical size={20} />
                </button>

                {isMenuOpen && (
                  <div className="absolute -right-3 z-[9999] mt-2 w-[158px] rounded-md bg-gray-500 shadow-lg">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleEdit()
                        }}
                        className="font-regular w-full px-4 py-[10px] text-left text-white hover:rounded-md hover:bg-gray-600/70"
                      >
                        수정
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleDelete()
                        }}
                        className="font-regular w-full px-4 py-[10px] text-left text-white hover:rounded-md hover:bg-gray-600/70"
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
