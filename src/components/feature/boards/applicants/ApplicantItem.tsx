import { useNavigate } from 'react-router-dom'

import Button from '@/components/atoms/Button'
import { Tag } from '@/components/atoms/Tag'
import type { GetRecruitApplicants } from '@/types/apis/recruit/recruit.api.types'

interface ApplicantItemProps {
  applicant: GetRecruitApplicants['Response']['data'][number]
  onAcceptClick: (applicant: GetRecruitApplicants['Response']['data'][number]) => void
  onRejectClick: (applicant: GetRecruitApplicants['Response']['data'][number]) => void
  isAccepting?: boolean
  isRejecting?: boolean
}

export default function ApplicantItem({
  applicant,
  onAcceptClick,
  onRejectClick,
  isAccepting = false,
  isRejecting = false,
}: ApplicantItemProps) {
  const navigate = useNavigate()
  const { applicantId, applicantName, positionName, university, major, stackNames } = applicant

  const displayPosition = positionName ?? '포지션 정보 없음'
  const displayUniversity = university ?? '학교 정보 없음'
  const displayMajor = major ?? '전공 정보 없음'

  return (
    <div className="flex items-center justify-between rounded-2xl bg-gray-100 px-7 py-5">
      {/* 왼쪽 프로필 영역 */}
      <div className="flex items-center gap-[29px]">
        <div className="h-[131px] w-[131px] rounded-full bg-white" />
        <div className="flex flex-col">
          <span className="text-b1-bold text-gray-900">{applicantName}</span>
          <span className="text-b4-medium mb-[15px] text-gray-500">{displayPosition}</span>
          <span className="text-b5-medium text-gray-500">{displayUniversity}</span>
          <span className="text-b5-medium text-gray-500">{displayMajor}</span>
        </div>
      </div>

      {/* 오른쪽 버튼 + 태그 */}
      <div className="flex h-[133px] flex-col items-end justify-between">
        {/* 기술 스택 */}
        <div className="flex flex-wrap justify-end gap-[10px]">
          {stackNames.length > 0 ? (
            stackNames.map((skill, index) => (
              <Tag key={`${skill}-${index}`} label={skill} size="md" />
            ))
          ) : (
            <span className="text-b5-medium text-gray-500">등록된 기술 스택이 없습니다.</span>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-[9px]">
          <Button
            variant="secondary"
            className="!text-b4-bold"
            onClick={() => void navigate(`/users/${applicantId}/profile`)}
          >
            프로필 보러 가기
          </Button>
          <Button
            className="!text-b4-bold"
            onClick={() => onAcceptClick(applicant)}
            disabled={isAccepting}
          >
            수락
          </Button>
          <Button
            className="!text-b4-bold"
            onClick={() => onRejectClick(applicant)}
            disabled={isRejecting}
          >
            거절
          </Button>
        </div>
      </div>
    </div>
  )
}
