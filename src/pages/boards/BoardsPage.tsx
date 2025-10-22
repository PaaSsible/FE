import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'
import Dropdown from '@/components/atoms/Dropdown'
import Tab from '@/components/atoms/Tab'
import { Pagination } from '@/components/common/Pagination'
import TermsConsentModal from '@/components/feature/auth/TermsConsentModal'
import BoardItem from '@/components/feature/boards/BoardItem'
import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
import {
  RECRUIT_CATEGORIES,
  RECRUIT_CATEGORY_BY_LABEL,
  RECRUIT_SORT_LABELS,
  RECRUIT_SORT_TO_QUERY,
  type RecruitCategoryLabel,
  type RecruitSortLabel,
} from '@/constants/recruitFilters'
import usePositionsOptions from '@/hooks/boards/usePositionsOptions'
import useRecruitList from '@/hooks/boards/useRecruitList'
import useTermsConsent from '@/hooks/boards/useTermsConsent'
import { positionIdToLabel, stackIdToLabel } from '@/utils/recruitMeta'

const BoardsPage: React.FC = () => {
  const navigate = useNavigate()

  const [selectedTab, setSelectedTab] = useState<RecruitCategoryLabel>(RECRUIT_CATEGORIES[0].label)
  const [selectedChip, setSelectedChip] = useState<string | null>(
    RECRUIT_CATEGORIES[0].chips[0]?.label ?? null,
  )

  // 검색어 상태
  const [searchValue, setSearchValue] = useState('')

  const {
    isOpen: isTermsModalOpen,
    isSubmitting: isSubmittingTerms,
    hasAgreed: hasAgreedToTerms,
    handleAgree,
    handleClose,
  } = useTermsConsent()

  const currentCategory = useMemo(() => RECRUIT_CATEGORY_BY_LABEL[selectedTab], [selectedTab])
  const chipOptions = currentCategory.chips

  useEffect(() => {
    if (chipOptions.length === 0) {
      setSelectedChip(null)
      return
    }

    setSelectedChip((prev) => {
      if (prev && chipOptions.some((chip) => chip.label === prev)) {
        return prev
      }
      return chipOptions[0]?.label ?? null
    })
  }, [chipOptions])

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)

  // 드롭다운 상태
  const { options: positionOptions, getPositionIdByLabel } = usePositionsOptions()
  const ALL_POSITIONS_LABEL = '전체'
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)

  const [selectedSort, setSelectedSort] = useState<RecruitSortLabel>(RECRUIT_SORT_LABELS[0])

  const trimmedSearch = searchValue.trim()
  const isSearching = trimmedSearch.length > 0
  const selectedPositionId = useMemo(() => {
    if (!selectedPosition || selectedPosition === ALL_POSITIONS_LABEL) {
      return null
    }
    return getPositionIdByLabel(selectedPosition)
  }, [selectedPosition, getPositionIdByLabel])

  const selectedSubcategory = useMemo(() => {
    if (!selectedChip) {
      return null
    }

    const chip = chipOptions.find(({ label }) => label === selectedChip)
    return chip?.subCategory ?? null
  }, [chipOptions, selectedChip])

  useEffect(() => {
    setCurrentPage((prev) => (prev === 1 ? prev : 1))
  }, [selectedTab, trimmedSearch, selectedPositionId, selectedSort, selectedSubcategory])

  const {
    posts,
    pageInfo,
    error: recruitError,
    refetch: refetchRecruits,
  } = useRecruitList({
    page: currentPage,
    sort: RECRUIT_SORT_TO_QUERY[selectedSort],
    mainCategory: currentCategory.mainCategory,
    subCategory: selectedSubcategory ?? undefined,
    keyword: trimmedSearch,
    positionId: selectedPositionId,
  })

  const totalCount = pageInfo?.totalElements ?? 0
  const totalPages = pageInfo?.totalPages ?? 0

  const boardItems = useMemo(() => {
    return posts.map((post) => {
      const createdAt =
        post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt as Date | string)
      const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true, locale: ko }).replace(
        /^약\s*/,
        '',
      )

      const deadlineDate = new Date(post.deadline)
      const deadline = Number.isNaN(deadlineDate.getTime())
        ? '미정'
        : format(deadlineDate, 'yyyy.MM.dd')

      const positionNames = new Set<string>()
      const stackNames = new Set<string>()

      const recruits = (() => {
        if (Array.isArray(post.recruits) && post.recruits.length > 0) {
          return post.recruits.map(({ position, stacks }) => ({
            position: typeof position === 'number' ? position : null,
            stacks: Array.isArray(stacks)
              ? stacks.filter((value): value is number => typeof value === 'number')
              : typeof stacks === 'number'
                ? [stacks]
                : [],
          }))
        }
        if (Array.isArray(post.recruits) && post.recruits.length > 0) {
          return post.recruits.map(({ position, stacks }) => ({
            position,
            stacks,
          }))
        }
        return []
      })()

      recruits.forEach(({ position, stacks }) => {
        if (typeof position === 'number') {
          const positionLabel = positionIdToLabel(position)
          if (positionLabel) {
            positionNames.add(positionLabel)
          }
        }

        if (Array.isArray(stacks)) {
          stacks
            .filter((stackId): stackId is number => typeof stackId === 'number')
            .forEach((stackId) => {
              const stackLabel = stackIdToLabel(stackId)
              if (stackLabel) {
                stackNames.add(stackLabel)
              }
            })
        }
      })

      return {
        postId: post.postId,
        title: post.title,
        timeAgo,
        deadline,
        field: positionNames.size > 0 ? Array.from(positionNames).join(', ') : '포지션 미정',
        tags: Array.from(stackNames),
        views: post.viewCount,
        bookmarks: post.applicationCount,
      }
    })
  }, [posts])

  return (
    <div className="flex min-h-screen flex-col px-[144px] py-[44px] text-start">
      {/* 상단 헤더 */}
      <BoardsPageHeader
        title={isSearching ? `'${trimmedSearch}' 검색 결과` : '팀원 모집하기'}
        searchValue={searchValue}
        onSearchChange={(e) => setSearchValue(e.target.value)}
        onBackClick={isSearching ? () => setSearchValue('') : undefined}
      />

      {/* 카테고리 탭 */}
      <div className="border-gray-250 mt-6 flex justify-between border-b-[1.5px] pb-3">
        <div className="flex gap-[25px]">
          {RECRUIT_CATEGORIES.map((category) => (
            <Tab
              key={category.label}
              label={category.label}
              selected={selectedTab === category.label}
              onClick={() => {
                setSelectedTab(category.label)
                setSelectedChip(null)
                setSelectedPosition(null)
              }}
            />
          ))}
        </div>
        <Button
          variant="secondary"
          size="big"
          className="!text-b4-medium !h-[40px] !border"
          onClick={() => void navigate('/boards/mine')}
        >
          내 모집글 관리
        </Button>
      </div>

      {/* 필터 Chip 리스트 */}
      {chipOptions.length > 0 && (
        <div className="border-gray-250 flex flex-wrap justify-start gap-[10px] border-b-[1.5px] py-3">
          {chipOptions.map(({ label }) => (
            <Chip
              key={label}
              label={label}
              selected={selectedChip === label}
              onClick={() => setSelectedChip(label)}
            />
          ))}
        </div>
      )}

      {/* 검색 결과 + 드롭다운 + 글쓰기 버튼 */}
      <div className="mt-8 flex items-center justify-between font-medium text-gray-500">
        <span className="pt-4">검색 결과 {totalCount}건</span>

        <div className="flex items-center gap-4">
          {/* 포지션 드롭다운 */}
          <Dropdown
            key={selectedTab}
            placeholder="포지션"
            options={positionOptions}
            onSelect={(value) => {
              setSelectedPosition(value === ALL_POSITIONS_LABEL ? null : value)
            }}
          />

          {/* 정렬 드롭다운 */}
          <Dropdown
            placeholder="최신순"
            options={RECRUIT_SORT_LABELS}
            onSelect={(value) => {
              if (RECRUIT_SORT_LABELS.includes(value as RecruitSortLabel)) {
                setSelectedSort(value as RecruitSortLabel)
              }
            }}
          />

          {/* 검색 결과 없을 때만 글쓰기 버튼 표시 */}
          {!searchValue && <Button onClick={() => void navigate('/boards/new')}>글쓰기</Button>}
        </div>
      </div>

      {/* 게시글 리스트 */}
      <div className="mt-4 flex flex-col gap-4">
        {recruitError ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-4 text-center">
            <p className="text-b3-bold text-red-500">{recruitError}</p>
            <Button variant="primary" shape="square" onClick={refetchRecruits}>
              다시 시도하기
            </Button>
          </div>
        ) : boardItems.length > 0 ? (
          boardItems.map((post) => (
            <BoardItem
              key={post.postId}
              title={post.title}
              timeAgo={post.timeAgo}
              deadline={post.deadline}
              field={post.field}
              tags={post.tags}
              views={post.views}
              bookmarks={post.bookmarks}
              onClick={() => void navigate(`/boards/${post.postId}`)}
            />
          ))
        ) : (
          <div className="flex h-[500px] flex-col justify-center gap-[29px] text-center">
            <p className="text-s1-bold text-gray-1000">
              {isSearching && `'${trimmedSearch}' 검색 결과가 없습니다.`}
            </p>
            <p className="text-b2-medium text-gray-500">
              {isSearching && '다른 카테고리에서 확인해 보시거나 다른 키워드로 검색해 보세요.'}
            </p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-10 mb-16 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <TermsConsentModal
        isOpen={isTermsModalOpen}
        isChecked={hasAgreedToTerms}
        isSubmitting={isSubmittingTerms}
        onCheck={() => {
          void handleAgree()
        }}
        onClose={handleClose}
        onConfirm={handleClose}
      />
    </div>
  )
}

export default BoardsPage
