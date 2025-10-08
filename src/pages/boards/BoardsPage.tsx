import React, { useState, useEffect } from 'react'
import Chip from '@/components/atoms/Chip'
import BoardItem from '@/components/feature/boards/BoardItem'
import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
import { Pagination } from '@/components/feature/boards/Pagination'
import Button from '@/components/atoms/Button'
import Dropdown from '@/components/atoms/Dropdown'
import Tab from '@/components/atoms/Tab'

const BoardsPage: React.FC = () => {
  // 상단 탭
  const tabs = ['공모전/대회', '사이드 프로젝트', '스터디', '기타'] as const
  type Tab = (typeof tabs)[number]
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0])

  // 필터 Chip
  const chipLabels = [
    '기획 중심',
    '기획+디자인',
    '디자인 중심',
    '개발 중심',
    '융합 프로젝트',
    '기타',
  ] as const
  type ChipLabel = (typeof chipLabels)[number]
  const [selectedChip, setSelectedChip] = useState<ChipLabel>(chipLabels[0])

  // 검색어 상태
  const [searchValue, setSearchValue] = useState('')

  const handleBackClick = () => {
    setSearchValue('')
  }

  // 게시글 리스트
  const posts = Array(5)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: '팀 프로젝트 React 기반 프론트엔드 개발자 1명 구합니다',
      timeAgo: '2시간 전',
      deadline: '2025.07.31',
      field: '프론트엔드',
      tags: ['스택 어쩌고', '스택스택', '조건어쩌고'],
      views: 133,
      bookmarks: 133,
    }))

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)

  // 드롭다운 상태 (하드코딩 데이터)
  const positionOptions = ['전체', '기획자', '디자이너', '프론트엔드', '백엔드', '기타']
  const sortOptions = ['최신순', '마감순', '인기순']

  // 드롭다운 나중에 API로 대체할 부분
  /*
  useEffect(() => {
    async function fetchDropdownData() {
      try {
        // const res = await fetch('/api/positions')
        // const data = await res.json()
        // setPositionOptions(data.positions)

        // const sortRes = await fetch('/api/sort-options')
        // const sortData = await sortRes.json()
        // setSortOptions(sortData.sorts)
      } catch (error) {
        console.error('드롭다운 데이터 로드 실패:', error)
      }
    }

    fetchDropdownData()
  }, [])
  */

  // 검색 필터링 (임시 로직)
  const trimmedSearch = searchValue.trim() // 공백만 입력된 경우 무시
  const filteredPosts = trimmedSearch
    ? posts.filter((post) => post.title.toLowerCase().includes(trimmedSearch.toLowerCase()))
    : posts

  const isSearching = trimmedSearch.length > 0

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
          {tabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              selected={selectedTab === tab}
              onClick={() => setSelectedTab(tab)}
            />
          ))}
        </div>
        <Button variant="secondary" size="big" className="!text-b4-medium !h-[40px] !border">
          내 모집글 관리
        </Button>
      </div>

      {/* 필터 Chip 리스트 */}
      <div className="border-gray-250 flex flex-wrap justify-start gap-[10px] border-b-[1.5px] py-3">
        {chipLabels.map((label) => (
          <Chip
            key={label}
            label={label}
            selected={selectedChip === label}
            onClick={() => setSelectedChip(label)}
          />
        ))}
      </div>

      {/* 검색 결과 + 드롭다운 + 글쓰기 버튼 */}
      <div className="mt-8 flex items-center justify-between font-medium text-gray-500">
        <span className="pt-4">검색 결과 {filteredPosts.length}건</span>

        <div className="flex items-center gap-4">
          {/* 포지션 드롭다운 */}
          <Dropdown
            placeholder="포지션"
            options={positionOptions}
            onSelect={(value) => console.log('선택된 포지션:', value)}
          />

          {/* 정렬 드롭다운 */}
          <Dropdown
            placeholder="최신순"
            options={sortOptions}
            onSelect={(value) => console.log('선택된 정렬:', value)}
          />

          {/* 검색 결과 없을 때만 글쓰기 버튼 표시 */}
          {!searchValue && <Button>글쓰기</Button>}
        </div>
      </div>

      {/* 게시글 리스트 */}
      <div className="mt-4 flex flex-col gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <BoardItem
              key={post.id}
              title={post.title}
              timeAgo={post.timeAgo}
              deadline={post.deadline}
              field={post.field}
              tags={post.tags}
              views={post.views}
              bookmarks={post.bookmarks}
              onClick={() => console.log(`${post.title} 클릭`)}
            />
          ))
        ) : (
          <div className="flex h-[500px] flex-col justify-center gap-[29px] text-center">
            <p className="text-s1-bold text-gray-1000">'{searchValue}' 검색 결과가 없습니다.</p>
            <p className="text-b2-medium text-gray-500">
              다른 카테고리에서 확인해 보시거나 다른 키워드로 검색해 보세요.
            </p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-10 mb-16 flex justify-center">
        <Pagination currentPage={currentPage} totalPages={6} onPageChange={setCurrentPage} />
      </div>
    </div>
  )
}

export default BoardsPage
