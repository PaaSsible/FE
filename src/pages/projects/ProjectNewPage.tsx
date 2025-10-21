import { useState, type JSX } from 'react'

import Chip from '@/components/atoms/Chip'
import Tab from '@/components/atoms/Tab'
import { activityTypeToDetailTypeMap } from '@/config/converters/activityTypeDetailTypeMap'
import { activityTypeEngToKorMap } from '@/config/converters/activityTypeEngToKorMap'
import { detailTypeEngToKorMap } from '@/config/converters/detailTypeEngToKorMap'
import { activityTypeArray } from '@/types/entities/board/board.entities.schemas'
import { type ActivityType, type DetailType } from '@/types/entities/board/board.entitites.types'

import ProjectHeader from './components/ProjectHeader'
import Separator from './components/Separator'

export default function ProjectNewPage(): JSX.Element {
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>('CONTEST')
  const [selectedDetailType, setSelectedDetailType] = useState<DetailType>('CONTEST_PLANNING')

  return (
    <div className="flex min-h-screen flex-col px-[144px] py-[44px] text-start">
      <ProjectHeader title="새 프로젝트 보드 생성" className="mb-[3.375rem]" />
      <div className="mb-6 flex items-center justify-start gap-6">
        {activityTypeArray.map((type, index) => (
          <Tab
            key={index}
            label={activityTypeEngToKorMap[type]}
            selected={selectedActivityType === type}
            onClick={() => setSelectedActivityType(type)}
          />
        ))}
      </div>
      <Separator />
      <div className="my-[1.0625rem] flex gap-2">
        {activityTypeToDetailTypeMap[selectedActivityType].map((detailType, index) => (
          <Chip
            key={index}
            variant="default"
            label={detailTypeEngToKorMap[detailType]}
            selected={selectedDetailType === detailType}
            onClick={() => setSelectedDetailType(detailType)}
          />
        ))}
      </div>
      <Separator />

      <div className="justify-start text-xl leading-loose font-medium text-black opacity-80">
        모집 마감일
      </div>
    </div>
  )
}
