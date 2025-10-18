import { Eye, File } from 'lucide-react'
import BoardActionButtons from './BoardActionButtons'
import { Tag } from '@/components/atoms/Tag'

interface MyBoardItemProps {
  title: string
  createdAt: string
  deadline: string
  position: string
  tags: string[]
  views: number
  applicants: number
  onDeleteClick: () => void
}

export default function MyBoardItem({
  title,
  createdAt,
  deadline,
  position,
  tags,
  views,
  applicants,
  onDeleteClick,
}: MyBoardItemProps) {
  return (
    <div className="flex w-full cursor-pointer items-center justify-between bg-gray-100 px-[25px] py-4">
      {/* 왼쪽: 모집글 정보 */}
      <div className="flex flex-col gap-[7px]">
        <h3 className="text-b5-bold text-gray-850">{title}</h3>
        <p className="text-l1-medium flex gap-[7px] text-gray-600">
          {createdAt} <span className="text-gray-400">·</span> 모집 마감일: {deadline}{' '}
          <span className="text-gray-400">·</span> 모집 포지션: {position}
        </p>
        <div className="mt-4 flex flex-wrap gap-[5px]">
          {tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </div>

      {/* 오른쪽: 통계 + 버튼 */}
      <div className="flex flex-col items-end justify-between gap-4">
        {/* 조회수 / 지원자수 */}
        <div className="text-l1-medium flex items-center gap-[17px] text-gray-600">
          <div className="flex gap-[10px]">
            <Eye className="h-6 w-6" />
            {views}
          </div>
          <div className="flex gap-[10px]">
            <File className="h-6 w-6" />
            {applicants}
          </div>
        </div>

        <BoardActionButtons onDeleteClick={onDeleteClick} />
      </div>
    </div>
  )
}
