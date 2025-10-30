'use client'

import clsx from 'clsx'
import { format, parseISO } from 'date-fns'
import { Eye, FileText } from 'lucide-react'

import Button from '@/components/atoms/Button'
import { Tag } from '@/components/atoms/Tag'
import type { MyRecruitApplication } from '@/hooks/mypage/useMyRecruitApplications'
import { formatStacks, positionIdToLabel } from '@/utils/recruitMeta'
import { formatRelativeTime } from '@/utils/relativeTime'

interface ApplicationItemProps {
  application: MyRecruitApplication
  onCancelClick?: (application: MyRecruitApplication) => void
  onRejectReasonClick?: (application: MyRecruitApplication) => void
}

const statusLabelMap: Record<MyRecruitApplication['status'], string> = {
  PENDING: '지원 상태: 지원 완료',
  ACCEPTED: '지원 상태: 수락',
  REJECTED: '지원 상태: 거절',
}

const statusClassMap: Record<MyRecruitApplication['status'], string> = {
  PENDING: 'bg-locallit-red-400 w-[143px]',
  ACCEPTED: 'bg-green-400 w-[116px]',
  REJECTED: 'bg-red-400 w-[116px]',
}

const formatDate = (value?: string | null, pattern = 'yyyy.MM.dd'): string => {
  if (!value) {
    return '날짜 정보 없음'
  }

  try {
    return format(parseISO(value), pattern)
  } catch (error) {
    console.warn('Failed to format date', value, error)
    return '날짜 정보 없음'
  }
}

export default function ApplicationItem({
  application,
  onCancelClick,
  onRejectReasonClick,
}: ApplicationItemProps) {
  const { status } = application

  const statusLabel = statusLabelMap[status]
  const statusColor = clsx(
    'rounded-[100px] px-4 py-[5px] text-l1-bold text-gray-0',
    statusClassMap[status],
  )

  const positions = Array.from(
    new Set(
      application.recruits
        .map((recruit) => positionIdToLabel(recruit.position))
        .filter((label): label is string => Boolean(label)),
    ),
  )
  const positionLabel = positions.length > 0 ? positions.join(', ') : '포지션 정보 없음'

  const stackNames = Array.from(
    new Set(application.recruits.flatMap((recruit) => formatStacks(recruit.stacks))),
  )

  const deadlineLabel = formatDate(application.deadline, 'yyyy.MM.dd')

  const showCancelButton = status === 'PENDING'
  const showRejectReasonButton = status === 'REJECTED'

  return (
    <div className="flex w-full flex-col rounded-xl bg-white px-5 py-4 text-left shadow-[0_0_20px_0_#0000001A]">
      <div className="flex flex-col gap-[10px]">
        <div className={statusColor}>{statusLabel}</div>

        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <h3 className="text-b5-bold text-gray-850">{application.title}</h3>
          <div className="flex flex-wrap gap-[5px]">
            {stackNames.length > 0 ? (
              stackNames.map((stack) => (
                <Tag key={stack} label={stack} size="sm" className="!bg-gray-250" />
              ))
            ) : (
              <Tag
                label="등록된 스택이 없습니다"
                size="sm"
                className="!bg-gray-250 !text-gray-500"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-[7px] flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-l1-medium text-gray-600">
          {formatRelativeTime(application.createdAt)} · 모집 마감일: {deadlineLabel} · 모집 포지션:{' '}
          {positionLabel}
        </p>
        <div className="text-l1-medium flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-[10px]">
            <Eye size={24} />
            <span>{application.viewCount}</span>
          </div>
          <div className="flex items-center gap-[10px]">
            <FileText size={24} />
            <span>{application.applicationCount}</span>
          </div>
        </div>
      </div>

      <div className="mt-[15px] flex w-full justify-end">
        {showCancelButton && (
          <Button
            onClick={() => onCancelClick?.(application)}
            variant="secondary"
            shape="square"
            size="big"
            className="!text-b5-medium !h-[33px] !min-w-[125px]"
          >
            지원 취소
          </Button>
        )}
        {showRejectReasonButton && (
          <Button
            onClick={() => onRejectReasonClick?.(application)}
            variant="secondary"
            shape="square"
            size="big"
            className="!text-b5-medium !h-[33px] !min-w-[125px]"
          >
            거절 사유 보기
          </Button>
        )}
      </div>
    </div>
  )
}
