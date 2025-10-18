import Chip from '@/components/atoms/Chip'

interface RecruitInfo {
  position: string
  stacks: string[]
}

interface BoardDetailData {
  postId: number
  title: string
  content: string
  mainCategory: string
  subCategory: string
  writerId: number
  writerName: string
  createdAt: string
  updatedAt: string
  deadline: string
  projectDuration: string
  viewCount: number
  applicationCount: number
  recruits: RecruitInfo[]
}
interface Props {
  post: BoardDetailData
}

export default function BoardsDetailMeta({ post }: Props) {
  return (
    <section className="mt-6 flex flex-col gap-6 pb-8">
      <div className="text-b5-medium border-gray-250 flex items-center justify-between border-b-[1.5px] pb-5 text-gray-900">
        <div className="text-b5-medium text-gray-1000">{post.writerName}</div>
        <div className="flex gap-6 text-gray-700">
          <div className="flex gap-[6px]">
            <span>작성일:</span>
            <span className="text-b5-bold">{post.createdAt || '2025.08.12 12:34'}</span>
          </div>
          <div className="flex gap-[6px]">
            <span>수정일:</span>
            <span className="text-b5-bold">{post.updatedAt || '2025.08.12 16:55'}</span>
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
            {post.mainCategory || '사이드 프로젝트'} &gt; {post.subCategory}
          </div>
        </div>
        <div className="grid grid-cols-[100px_1fr] items-start gap-5">
          <div className="text-b4-medium text-gray-600">모집 인원</div>
          <div className="text-b4-bold text-gray-900">{post.recruits?.length ?? 0}명</div>
        </div>
        <div className="grid grid-cols-[100px_1fr] items-start gap-5">
          <div className="text-b4-medium text-gray-600">모집 마감일</div>
          <div className="text-b4-bold text-gray-900">{post.deadline}</div>
        </div>
        <div className="grid grid-cols-[100px_1fr] items-start gap-5">
          <div className="text-b4-medium text-gray-600">진행 기간</div>
          <div className="text-b4-bold text-gray-900">
            {post.projectDuration === 'UNDEFINED' ? '미정' : post.projectDuration}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {post.recruits.map((recruit, idx) => (
          <div key={idx} className="grid grid-cols-[100px_1fr] items-start gap-5">
            <div className="text-b4-medium text-gray-600">모집 팀원 {idx + 1}</div>
            <div className="flex flex-col gap-3">
              <div className="text-b4-bold text-gray-900">{recruit.position}</div>
              <div className="flex flex-wrap gap-2">
                {recruit.stacks.length > 0 ? (
                  recruit.stacks.map((stack, i) => <Chip key={i} label={stack} variant="stack" />)
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
