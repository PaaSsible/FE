import Chip from '@/components/atoms/Chip'
import {
  detailTypeToLabel,
  mainCategoryToLabel,
  positionIdToLabel,
  projectDurationToLabel,
  stackIdToLabel,
} from '@/utils/recruitMeta'

type RecruitStack = number | string

interface RecruitInfo {
  position: number | string
  stacks: RecruitStack[]
}

interface BoardDetailData {
  postId: number
  title: string
  content: string
  mainCategory?: string | null
  subCategory?: string | null
  writerId: number
  writerName: string
  createdAt?: string | null
  updatedAt?: string | null
  deadline?: string | null
  projectDuration?: string | null
  viewCount: number
  applicationCount: number
  recruits: RecruitInfo[]
}
interface Props {
  post: BoardDetailData
}

const formatDateLabel = (value?: string | null): string => {
  if (!value) {
    return '-'
  }

  const isoLike = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?)?/
  if (isoLike.test(value)) {
    return value.replace('T', ' ').replaceAll('-', '.')
  }

  return value
}

const formatPositionLabel = (position: number | string): string => {
  if (typeof position === 'number') {
    return positionIdToLabel(position) ?? `포지션 #${position}`
  }

  return position
}

const formatStackLabel = (stack: RecruitStack): string => {
  if (typeof stack === 'number') {
    return stackIdToLabel(stack) ?? `스택 #${stack}`
  }

  return stack
}

export default function BoardsDetailMeta({ post }: Props) {
  return (
    <section className="mt-5 flex flex-col gap-6 pb-8">
      <div className="text-b5-medium border-gray-250 flex items-center justify-between border-b-[1.5px] pb-5 text-gray-900">
        <div className="text-b5-medium text-gray-1000">{post.writerName}</div>
        <div className="flex gap-6 text-gray-700">
          <div className="flex gap-[6px]">
            <span>작성일:</span>
            <span className="text-b5-bold">{formatDateLabel(post.createdAt)}</span>
          </div>
          <div className="flex gap-[6px]">
            <span>수정일:</span>
            <span className="text-b5-bold">{formatDateLabel(post.updatedAt)}</span>
          </div>
          <div className="flex gap-[6px]">
            <span>조회수:</span>
            <span className="text-b5-bold">{post.viewCount}</span>
          </div>
          <div className="flex gap-[6px]">
            <span>지원자수:</span>
            <span className="text-b5-bold">{post.applicationCount}</span>
          </div>
        </div>
      </div>

      <div className="border-gray-250 grid grid-cols-2 gap-x-8 gap-y-5 border-b-[1.5px] pb-5">
        <div className="grid grid-cols-[100px_1fr] items-start gap-5">
          <div className="text-b4-medium text-gray-600">모집 구분</div>
          <div className="text-b4-bold text-gray-900">
            {mainCategoryToLabel(post.mainCategory)} &gt; {detailTypeToLabel(post.subCategory)}
          </div>
        </div>
        <div className="grid grid-cols-[100px_1fr] items-start gap-5">
          <div className="text-b4-medium text-gray-600">모집 인원</div>
          <div className="text-b4-bold text-gray-900">{post.recruits?.length ?? 0}명</div>
        </div>
        <div className="grid grid-cols-[100px_1fr] items-start gap-5">
          <div className="text-b4-medium text-gray-600">모집 마감일</div>
          <div className="text-b4-bold text-gray-900">{formatDateLabel(post.deadline)}</div>
        </div>
        <div className="grid grid-cols-[100px_1fr] items-start gap-5">
          <div className="text-b4-medium text-gray-600">진행 기간</div>
          <div className="text-b4-bold text-gray-900">
            {projectDurationToLabel(post.projectDuration)}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {post.recruits.map((recruit, idx) => (
          <div key={idx} className="grid grid-cols-[100px_1fr] items-start gap-5">
            <div className="text-b4-medium text-gray-600">모집 팀원 {idx + 1}</div>
            <div className="flex flex-col gap-3">
              <div className="text-b4-bold text-gray-900">
                {formatPositionLabel(recruit.position)}
              </div>
              <div className="flex flex-wrap gap-2">
                {recruit.stacks.length > 0 ? (
                  recruit.stacks.map((stack, i) => (
                    <Chip key={`${stack}-${i}`} label={formatStackLabel(stack)} variant="stack" />
                  ))
                ) : (
                  <Chip label="요구스택 없음" variant="stack" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
