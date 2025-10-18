import React from 'react'

import { Page } from '../atoms/Page'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (!totalPages || totalPages <= 0) return null

  const chunkSize = 5
  const chunkIndex = Math.floor((currentPage - 1) / chunkSize)
  const startPage = chunkIndex * chunkSize + 1
  const endPage = Math.min(startPage + chunkSize - 1, totalPages)

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  const hasPrevChunk = startPage > 1
  const hasNextChunk = endPage < totalPages

  const goPrevPage = () => onPageChange(Math.max(1, currentPage - 1))
  const goNextPage = () => onPageChange(Math.min(totalPages, currentPage + 1))
  const goPrevChunk = () => onPageChange(startPage - 1)
  const goNextChunk = () => onPageChange(endPage + 1)

  return (
    <div className="text-l1-medium mt-8 flex h-8 w-full items-center justify-between text-gray-800">
      <div className="flex h-8 items-center">
        {currentPage > 1 ? (
          <button
            type="button"
            onClick={goPrevPage}
            className="bg-gray-0 flex h-8 items-center justify-center rounded-lg border border-gray-400 px-[10px] py-1"
          >
            이전 페이지
          </button>
        ) : (
          <span className="invisible flex h-8 items-center px-3 py-1">이전 페이지</span>
        )}
      </div>

      <div className="flex h-8 items-center justify-center gap-[5px]">
        {hasPrevChunk && (
          <button
            type="button"
            className="bg-gray-0 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-400"
            onClick={goPrevChunk}
            aria-label="이전 구간"
          >
            …
          </button>
        )}

        {pages.map((num) => (
          <Page
            key={num}
            number={num}
            selected={num === currentPage}
            disabled={false}
            onClick={() => onPageChange(num)}
          />
        ))}

        {hasNextChunk && (
          <button
            type="button"
            className="bg-gray-0 flex h-8 w-8 items-center justify-center rounded-lg border border-gray-400"
            onClick={goNextChunk}
            aria-label="다음 구간"
          >
            …
          </button>
        )}
      </div>

      <div className="flex h-8 items-center">
        {currentPage < totalPages ? (
          <button
            type="button"
            onClick={goNextPage}
            className="bg-gray-0 flex h-8 items-center justify-center rounded-lg border border-gray-400 px-[10px] py-1"
          >
            다음 페이지
          </button>
        ) : (
          <span className="invisible flex h-8 items-center px-3 py-1">다음 페이지</span>
        )}
      </div>
    </div>
  )
}
