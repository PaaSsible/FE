import type { ColumnDef } from '@tanstack/react-table'
import type { JSX } from 'react'

import type { ContributionScore } from '@/types/components/contributionScore/contributionScore.types'

import { ContributionProgressBar } from './ContributionProgressBar'

export const columns: ColumnDef<ContributionScore>[] = [
  {
    accessorKey: 'memberName',
    header: '팀원',
  },
  {
    accessorKey: 'part',
    header: '파트',
  },
  {
    accessorKey: 'taskCompletion',
    header: '작업률',
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    cell: ({ row }): string => {
      return `${row.original.taskCompletion}%`
    },
  },
  {
    accessorKey: 'attendanceRate',
    header: '회의 참석률',
    cell: ({ row }): string => {
      return `${row.original.attendanceRate}%`
    },
  },
  {
    accessorKey: 'communicationFrequency',
    header: '커뮤니케이션 빈도',
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    cell: ({ row }): string => {
      const value = row.original.communicationFrequency.value
      const total = row.original.communicationFrequency.total
      return `${value}/${total}`
    },
  },

  {
    accessorKey: 'contribution',
    header: '기여도',
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    cell: ({ row }): JSX.Element => {
      const value = row.original.contribution
      return <ContributionProgressBar value={value} className="h-4" />
    },
  },
]
