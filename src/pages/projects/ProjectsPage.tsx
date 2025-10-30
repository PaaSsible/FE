import { Separator } from '@radix-ui/react-dropdown-menu'
import { useEffect, useState, type JSX } from 'react'
import { ZodError } from 'zod'

import { getBoardList } from '@/apis/board.api'
import Tab from '@/components/atoms/Tab'
import SearchBar from '@/components/common/SearchBar'
import CreateProjectButton from '@/components/feature/projects/CreateProjectButton'
import ProjectHeader from '@/components/feature/projects/ProjectHeader'
import ProjectListItem from '@/components/feature/projects/ProjectListItem'
import { statusTab, type StatusTab } from '@/config/constants/statusKor'
import { statusKorToEngMap } from '@/config/converters/statusKorToEngMap'
import type { GetBoardList } from '@/types/apis/board/board.api.types'
import type { Board } from '@/types/entities/board/board.entitites.types'

export default function ProjectsPage(): JSX.Element {
  const [selectedTab, setSelectedTab] = useState<StatusTab>('전체')
  const [searchValue, setSearchValue] = useState<string>('')
  const [projects, setProjects] = useState<Board[]>([])

  useEffect(() => {
    const getData = async () => {
      try {
        const query: GetBoardList['Query'] = {
          status: statusKorToEngMap[selectedTab],
          keyword: searchValue ?? undefined,
        }
        const res = await getBoardList(query)
        setProjects(res.data)
      } catch (error) {
        if (error instanceof ZodError) console.log('파싱 실패', error)
      }
    }
    void getData()
  }, [selectedTab, searchValue])

  return (
    <div className="flex min-h-screen flex-col px-[144px] py-[44px] text-start">
      <ProjectHeader title="프로젝트 대시보드" />
      <div className="bottom-6 mb-6 flex w-full justify-between">
        <div className="flex items-center justify-start gap-6">
          {statusTab.map((tab, index) => (
            <Tab
              key={index}
              label={tab}
              selected={selectedTab === tab}
              onClick={() => setSelectedTab(tab)}
            />
          ))}
        </div>
        <SearchBar value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      </div>
      <Separator />
      <div className="mt-[2.125rem] grid grid-cols-3 gap-6">
        {projects.map((project, _) => (
          <ProjectListItem key={project.boardId} project={project} />
        ))}
        <CreateProjectButton />
      </div>
    </div>
  )
}
