import { isBefore, startOfDay } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'
import Dropdown from '@/components/atoms/Dropdown'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import Tab from '@/components/atoms/Tab'
import { InputField } from '@/components/common/InputField'
import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
import {
  RECRUIT_CATEGORIES,
  RECRUIT_CATEGORY_BY_LABEL,
  RECRUIT_PERIODS,
  type RecruitCategoryConfig,
} from '@/constants/recruitFilters'
import usePositionsOptions from '@/hooks/boards/usePositionsOptions'
import useStacksOptions from '@/hooks/boards/useStacksOptions'
import { useBoardFormStore } from '@/stores/boardFormStore'

interface RecruitInfoSectionProps {
  showErrors?: boolean
  onValidityChange?: (isValid: boolean) => void
}

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

  const {
    options: positionOptions,
    getPositionIdByLabel,
    getPositionLabelById,
  } = usePositionsOptions()
  const { options: stackOptions, getStackIdByLabel, getStackLabelById } = useStacksOptions()

  const selectedCategoryLabel = useMemo(() => {
    const matched = RECRUIT_CATEGORIES.find((category) => category.mainCategory === mainCategory)
    return matched?.label ?? RECRUIT_CATEGORIES[0].label
  }, [mainCategory])

  const currentCategory: RecruitCategoryConfig = useMemo(
    () => RECRUIT_CATEGORY_BY_LABEL[selectedCategoryLabel],
    [selectedCategoryLabel],
  )

  const today = useMemo(() => startOfDay(new Date()), [])
  const memberPositionOptions = useMemo(
    () => positionOptions.filter((label) => label !== '전체'),
    [positionOptions],
  )

  const meaningfulRecruitment = useMemo(
    () => recruitment.filter((member) => member.position !== null || member.stacks.length > 0),
    [recruitment],
  )

  const hasIncompleteRecruitment = meaningfulRecruitment.some((member) => member.position === null)

  const isDeadlineValid = useMemo(() => {
    if (!deadline) {
      return false
    }

    return !isBefore(startOfDay(deadline), today)
  }, [deadline, today])

  const currentChipOptions = currentCategory.chips
  const selectedChipLabel = useMemo(() => {
    const matched = currentChipOptions.find((chip) => chip.subCategory === subCategory)
    return matched?.label ?? null
  }, [currentChipOptions, subCategory])

  const isFormValid = Boolean(
    deadline &&
      isDeadlineValid &&
      projectDuration &&
      (!meaningfulRecruitment.length || !hasIncompleteRecruitment),
  )

  useEffect(() => {
    onValidityChange?.(isFormValid)
  }, [isFormValid, onValidityChange])

  const handleAddMember = () => {
    setRecruitment([...recruitment, { position: null, stacks: [] }])
  }

  const handlePositionSelect = (index: number, label: string) => {
    const positionId = getPositionIdByLabel(label)
    const updated = [...recruitment]
    updated[index].position = positionId
    setRecruitment(updated)
  }

  const handleStacksChange = (index: number, labels: string[]) => {
    const selectedIds = labels
      .map((label) => getStackIdByLabel(label))
      .filter((id): id is number => typeof id === 'number')
    const uniqueIds = Array.from(new Set(selectedIds))
    const updated = [...recruitment]
    updated[index].stacks = uniqueIds
    setRecruitment(updated)
  }

  useEffect(() => {
    const hasMatchingChip = currentChipOptions.some(
      ({ subCategory: candidate }) => candidate === subCategory,
    )
    if (!hasMatchingChip && currentChipOptions.length > 0) {
      const firstChip = currentChipOptions[0]
      if (firstChip) {
        setSubCategory(firstChip.subCategory)
      }
    }
  }, [currentChipOptions, subCategory, setSubCategory])

  return (
    <section className="flex flex-col">
      <BoardsPageHeader title="모집 기본 정보" />

      {/* 탭 */}
      <div className="border-gray-250 mt-6 flex justify-between border-b-[1.5px] pb-3">
        <div className="flex gap-[25px]">
          {RECRUIT_CATEGORIES.map((category) => (
            <Tab
              key={category.label}
              label={category.label}
              selected={selectedCategoryLabel === category.label}
              onClick={() => {
                setMainCategory(category.mainCategory)
                if (category.chips.length > 0) {
                  const defaultChip = category.chips[0]
                  if (defaultChip) {
                    setSubCategory(defaultChip.subCategory)
                  }
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* 칩 */}
      {currentChipOptions.length > 0 && (
        <div className="border-gray-250 flex flex-wrap justify-start gap-[10px] border-b-[1.5px] py-3">
          {currentChipOptions.map((chip) => (
            <Chip
              key={chip.label}
              label={chip.label}
              selected={chip.label === selectedChipLabel}
              onClick={() => setSubCategory(chip.subCategory)}
            />
          ))}
        </div>
      )}

      {/* 모집 마감일 / 진행 기간 */}
      <div className="mt-6 flex w-full gap-4">
        <div className="flex flex-1 flex-col gap-[10px]">
          <span className="text-b2-medium">모집 마감일</span>
          <InputField
            placeholder="모집 마감일을 선택해주세요"
            dateValue={deadline}
            onSelectDate={(date) => setDeadline(date ?? null)}
          />
          {showErrors && !deadline && (
            <span className="text-b5-medium text-red-500">* 모집 마감일을 선택해 주세요.</span>
          )}
          {showErrors && deadline && !isDeadlineValid && (
            <span className="text-b5-medium text-red-500">
              * 모집 마감일은 오늘 이후 날짜로 선택해 주세요.
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-[10px]">
          <span className="text-b2-medium">진행 기간</span>
          <div className="flex flex-col gap-[7px]">
            <Dropdown
              placeholder={
                RECRUIT_PERIODS.find(({ code }) => code === projectDuration)?.label ?? '진행 기간'
              }
              options={RECRUIT_PERIODS.map(({ label }) => label)}
              onSelect={(label) => {
                const period = RECRUIT_PERIODS.find((item) => item.label === label)
                setProjectDuration(period?.code ?? null)
              }}
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
            const hasAnySelection = member.position !== null || member.stacks.length > 0
            const isMemberValid = member.position !== null
            const showTeamErrors = showErrors && hasAnySelection && !isMemberValid
            const selectedTags = member.stacks
              .map((id) => getStackLabelById(id))
              .filter((label): label is string => Boolean(label))

            const isOpen = openIndex === index
            const shouldShowDropdown = isOpen || selectedTags.length === 0
            const shouldShowPositionError = showTeamErrors && member.position === null
            const positionLabel =
              member.position !== null ? getPositionLabelById(member.position) : null
            const positionPlaceholder = positionLabel ?? '포지션'

            return (
              <div key={index} className="flex w-full gap-4">
                {/* 포지션 */}
                <div className="flex w-[25%] flex-col gap-[7px]">
                  <Dropdown
                    placeholder={positionPlaceholder}
                    options={memberPositionOptions}
                    onSelect={(value) => handlePositionSelect(index, value)}
                    variant="form"
                  />
                  {shouldShowPositionError && (
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
