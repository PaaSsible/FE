import { useEffect, useMemo, useState } from 'react'

import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'
import Dropdown from '@/components/atoms/Dropdown'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import Tab from '@/components/atoms/Tab'
import { InputField } from '@/components/common/InputField'
import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
import { useBoardFormStore } from '@/stores/boardFormStore'

interface RecruitInfoSectionProps {
  showErrors?: boolean
  onValidityChange?: (isValid: boolean) => void
}

const tabs = ['공모전/대회', '사이드 프로젝트', '스터디', '기타']
const chips = ['기획 중심', '기획+디자인', '디자인 중심', '개발 중심', '융합 프로젝트', '기타']
const periodOptions = ['기간 미정', '1개월', '2개월', '3개월', '4개월', '5개월', '6개월', '장기']
const positionOptions = [
  '기획자',
  'PM',
  '마케터',
  '디자이너',
  '프론트엔드 개발자',
  '백엔드 개발자',
  'iOS',
  '안드로이드',
  '데브옵스',
  '기타',
]
const stackOptions = [
  'JavaScript',
  'TypeScript',
  'React',
  'Vue',
  'NodeJS',
  'Spring',
  'Java',
  'NextJS',
  'Express',
  'Go',
  'C',
  'Python',
  'Django',
  'Swift',
  'Kotlin',
  'MySQL',
  'MongoDB',
  'php',
  'GraphQL',
  'Firebase',
  'ReactNative',
  'Unity',
  'Flutter',
  'AWS',
  'Kubernetes',
  'Docker',
  'Git',
  'Figma',
  'Zeplin',
  'Jest',
  'Svelte',
]

const mainCategoryByTab: Record<string, string> = {
  '공모전/대회': 'CONTEST',
  '사이드 프로젝트': 'SIDE_PROJECT',
  스터디: 'STUDY',
  기타: 'ETC',
}
const subCategoryByChip: Record<string, string> = {
  '기획 중심': 'CONTEST_PLANNING',
  '기획+디자인': 'CONTEST_PLANNING_DESIGN',
  '디자인 중심': 'CONTEST_DESIGN',
  '개발 중심': 'CONTEST_DEV',
  '융합 프로젝트': 'CONTEST_MIXED',
  기타: 'CONTEST_ETC',
}
const periodCodeByLabel: Record<string, string> = {
  '기간 미정': 'UNDEFINED',
  '1개월': 'ONE',
  '2개월': 'TWO',
  '3개월': 'THREE',
  '4개월': 'FOUR',
  '5개월': 'FIVE',
  '6개월': 'SIX',
  장기: 'LONG',
}
const positionIdByLabel = Object.fromEntries(positionOptions.map((l, i) => [l, i + 1]))
const stackIdByLabel = Object.fromEntries(stackOptions.map((l, i) => [l, i + 1]))

export default function RecruitInfoSection({
  showErrors = false,
  onValidityChange,
}: RecruitInfoSectionProps) {
  const {
    mainCategory,
    subCategory,
    deadline,
    projectDuration,
    recruitment,
    setMainCategory,
    setSubCategory,
    setDeadline,
    setProjectDuration,
    setRecruitment,
  } = useBoardFormStore()

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const hasValidTeamMember = useMemo(
    () => recruitment.some((r) => r.position !== null),
    [recruitment],
  )
  const isFormValid = Boolean(deadline && projectDuration && hasValidTeamMember)

  useEffect(() => {
    onValidityChange?.(isFormValid)
  }, [isFormValid, onValidityChange])

  const handleAddMember = () => {
    setRecruitment([...recruitment, { position: null, stacks: [] }])
  }

  const handlePositionSelect = (index: number, label: string) => {
    const positionId = positionIdByLabel[label] ?? null
    const updated = [...recruitment]
    updated[index].position = positionId
    setRecruitment(updated)
  }

  const handleStacksChange = (index: number, labels: string[]) => {
    const selectedIds = labels
      .map((label) => stackIdByLabel[label])
      .filter((id): id is number => id !== undefined)
    const updated = [...recruitment]
    updated[index].stacks = selectedIds
    setRecruitment(updated)
  }

  return (
    <section className="flex flex-col">
      <BoardsPageHeader title="모집 기본 정보" />

      {/* 탭 */}
      <div className="border-gray-250 mt-6 flex justify-between border-b-[1.5px] pb-3">
        <div className="flex gap-[25px]">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              selected={mainCategoryByTab[tab] === mainCategory}
              onClick={() => setMainCategory(mainCategoryByTab[tab])}
            />
          ))}
        </div>
      </div>

      {/* 칩 */}
      <div className="border-gray-250 flex flex-wrap justify-start gap-[10px] border-b-[1.5px] py-3">
        {chips.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            selected={subCategoryByChip[chip] === subCategory}
            onClick={() => setSubCategory(subCategoryByChip[chip])}
          />
        ))}
      </div>

      {/* 모집 마감일 / 진행 기간 */}
      <div className="mt-6 flex w-full gap-4">
        <div className="flex flex-1 flex-col gap-[10px]">
          <span className="text-b2-medium">모집 마감일</span>
          <InputField
            placeholder="모집 마감일을 선택해주세요"
            dateValue={deadline}
            onSelectDate={(date) => setDeadline(date ?? null)}
          />
        </div>

        <div className="flex flex-1 flex-col gap-[10px]">
          <span className="text-b2-medium">진행 기간</span>
          <div className="flex flex-col gap-[7px]">
            <Dropdown
              placeholder={
                Object.keys(periodCodeByLabel).find(
                  (key) => periodCodeByLabel[key] === projectDuration,
                ) ?? '진행 기간'
              }
              options={periodOptions}
              onSelect={(label) => setProjectDuration(periodCodeByLabel[label] ?? null)}
              variant="form"
            />
            {showErrors && !projectDuration && (
              <span className="text-b5-medium text-red-500">* 진행 기간을 선택해 주세요.</span>
            )}
          </div>
        </div>
      </div>

      {/* 모집할 팀원 */}
      <div className="mt-6 flex flex-col gap-4">
        <span className="text-b2-medium">모집할 팀원</span>

        <div className="flex w-full flex-col gap-3">
          {recruitment.map((member, index) => {
            const showTeamErrors = showErrors && (!member.position || member.stacks.length === 0)
            const selectedTags = member.stacks
              .map((id) => Object.keys(stackIdByLabel).find((key) => stackIdByLabel[key] === id))
              .filter(Boolean) as string[]

            const isOpen = openIndex === index
            const shouldShowDropdown = isOpen || selectedTags.length === 0

            return (
              <div key={index} className="flex w-full gap-4">
                {/* 포지션 */}
                <div className="flex w-[25%] flex-col gap-[7px]">
                  <Dropdown
                    placeholder={
                      Object.keys(positionIdByLabel).find(
                        (key) => positionIdByLabel[key] === member.position,
                      ) ?? '포지션'
                    }
                    options={positionOptions}
                    onSelect={(value) => handlePositionSelect(index, value)}
                    variant="form"
                  />
                  {showTeamErrors && !member.position && (
                    <span className="text-b5-medium text-red-500">
                      * 팀원의 포지션을 선택해 주세요.
                    </span>
                  )}
                </div>

                {/* 기술 스택 */}
                <div className="flex flex-1 flex-col gap-[7px]">
                  {shouldShowDropdown ? (
                    <MultiSelectDropdown
                      placeholder="기술 스택"
                      options={stackOptions}
                      selected={selectedTags}
                      onChange={(values) => handleStacksChange(index, values)}
                      open={isOpen}
                      onOpenChange={(open) => setOpenIndex(open ? index : null)}
                    />
                  ) : (
                    <InputField
                      variant="techTag"
                      tags={selectedTags}
                      onRemoveTag={(tag) => {
                        const updatedTags = selectedTags.filter((t) => t !== tag)
                        handleStacksChange(index, updatedTags)
                      }}
                    />
                  )}

                  {/* {showTeamErrors && member.stacks.length === 0 && (
                    <span className="text-b5-medium text-red-500">
                      * 기술 스택을 한 가지 이상 선택해 주세요.
                    </span>
                  )} */}
                </div>
              </div>
            )
          })}
        </div>

        <Button
          type="button"
          shape="square"
          size="big"
          className="!bg-gray-400"
          onClick={handleAddMember}
        >
          팀원 추가하기
        </Button>
      </div>
    </section>
  )
}
