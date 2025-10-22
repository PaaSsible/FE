import { Eye, File } from 'lucide-react'
import React from 'react'

import { Tag } from '@/components/atoms/Tag'

interface BoardItemProps {
  title: string
  timeAgo: string
  deadline: string
  field: string
  tags: string[]
  views: number
  bookmarks: number
  onClick?: () => void
}

const BoardItem: React.FC<BoardItemProps> = ({
  title,
  timeAgo,
  deadline,
  field,
  tags,
  views,
  bookmarks,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-between bg-gray-100 px-[25px] py-4"
    >
      {/* 왼쪽 영역: 제목 + 부가정보 */}
      <div className="flex flex-col gap-[7px]">
        <h3 className="text-b5-bold text-gray-850">{title}</h3>
        <p className="text-l1-medium flex gap-[7px] text-gray-600">
          {timeAgo} <span className="text-gray-400">·</span> 모집 마감일: {deadline}{' '}
          <span className="text-gray-400">·</span> 모집 포지션: {field}
        </p>
      </div>

      {/* 오른쪽 영역: 태그 + 통계 */}
      <div className="flex flex-col items-end gap-2">
        {/* 태그 리스트 */}
        <div className="flex flex-wrap justify-end gap-[5px]">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} size="sm" />
          ))}
        </div>

        {/* 조회수 / 북마크 */}
        <div className="text-l1-medium flex items-center gap-[17px] text-gray-600">
          <div className="flex gap-[10px]">
            <Eye className="h-6 w-6" />
            {views}
          </div>
          <div className="flex gap-[10px]">
            <File className="h-6 w-6" />
            {bookmarks}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardItem
