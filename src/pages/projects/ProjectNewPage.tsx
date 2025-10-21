import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState, type JSX } from 'react'

import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'
import Tab from '@/components/atoms/Tab'
import { InputField } from '@/components/common/InputField'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { activityTypeToDetailTypeMap } from '@/config/converters/activityTypeDetailTypeMap'
import { activityTypeEngToKorMap } from '@/config/converters/activityTypeEngToKorMap'
import { detailTypeEngToKorMap } from '@/config/converters/detailTypeEngToKorMap'
import { activityTypeArray } from '@/types/entities/board/board.entities.schemas'
import { type ActivityType, type DetailType } from '@/types/entities/board/board.entitites.types'
import { stacksArray } from '@/types/entities/recruit-post/recruitPost.schemas'

import { DropdownWithInputField } from './components/Dropdown'
import ProjectHeader from './components/ProjectHeader'
import ProjectNewLabel from './components/ProjectNewLabel'
import { RichTextEditor } from './components/RichTextEditor'
import Separator from './components/Separator'

const recruitProcessPeriodArray = [
  '기간미정',
  '1개월',
  '2개월',
  '3개월',
  '4개월',
  '5개월',
  '6개월 이상',
] as const
type RecruitProcessPeriod = (typeof recruitProcessPeriodArray)[number]

const positionsArray = [
  '기획자',
  'PM',
  '마케터',
  '디자이너',
  '프론트엔드 개발자  ',
  '백엔드 개발자',
  'iOS',
  '안드로이드',
  '데브옵스',
  '기타',
] as const
type Positions = (typeof positionsArray)[number]
type TechStacks = (typeof stacksArray)[number]

export default function ProjectNewPage(): JSX.Element {
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>('CONTEST')
  const [selectedDetailType, setSelectedDetailType] = useState<DetailType>('CONTEST_PLANNING')
  const [recruitDate, setRecruitDate] = useState<Date>(new Date())
  const [selectedRecruitPeriod, setSelectedRecruitPeriod] =
    useState<RecruitProcessPeriod>('기간미정')
  const [selectedPosition, setSelectedPosition] = useState<Positions | undefined>()
  const [selectedTechStacks, setSelectedTechStacks] = useState<TechStacks[]>([])
  const [content, setContent] = useState<string>('')

  return (
    <div className="flex min-h-screen flex-col px-[144px] py-[44px] text-start">
      <ProjectHeader title="모집 기본 정보" className="mb-[3.375rem]" />
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
      {activityTypeEngToKorMap[selectedActivityType] && (
        <>
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
        </>
      )}

      <div className="mb-[8.3125rem] flex flex-col gap-[2.375rem]">
        <div className="mt-[2.5625rem] flex gap-6">
          <div>
            <ProjectNewLabel label="모집 마감일" />
            <InputField
              placeholder="YYYY-MM-DD"
              dateValue={recruitDate}
              onSelectDate={(date: Date) => {
                setRecruitDate(date)
              }}
            />
          </div>
          <div className="flex flex-1/2 flex-col">
            <ProjectNewLabel label="진행 기간" />
            <DropdownWithInputField
              multiple={false}
              options={recruitProcessPeriodArray}
              selectedOption={selectedRecruitPeriod}
              setSelectedOption={setSelectedRecruitPeriod}
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <ProjectNewLabel label="모집할 팀원" />
          <div className="flex items-start justify-center gap-6">
            <DropdownWithInputField
              options={positionsArray}
              selectedOption={selectedPosition}
              setSelectedOption={setSelectedPosition}
              placeholder="포지션"
              className="flex max-h-[3.5rem] flex-1/4"
            />
            <DropdownWithInputField
              multiple
              options={stacksArray}
              selectedOption={selectedTechStacks}
              setSelectedOption={setSelectedTechStacks}
              placeholder="기술 스택"
              className="flex flex-3/4"
            />
          </div>
        </div>

        <Button variant="primary" size="big" className="!bg-gray-400">
          팀원 추가하기
        </Button>
      </div>

      <ProjectHeader title="모집글 작성" className="mb-[2.5625rem]" />
      <div className="mb-[2.375rem] flex flex-1 flex-col">
        <ProjectNewLabel label="제목" />
        <input
          placeholder="제목을 입력해 주세요."
          className="mt-3 flex flex-1 bg-gray-200 px-5 py-3.5 text-lg leading-7 font-medium outline-none"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <ProjectNewLabel label="본문" />
        <div className="flex">
          <RichTextEditor content={content} setContent={setContent} />
        </div>
      </div>
    </div>
  )
}
