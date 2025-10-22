import { useState } from 'react'

import ProjectsPageHeader from '@/components/feature/projects/ProjectsPageHeader'

export default function ProjectBoardPage() {
  const [keyword, setKeyword] = useState('')

  return (
    <div>
      <ProjectsPageHeader
        title="프로젝트 이름"
        searchValue={keyword}
        onSearchChange={(e) => setKeyword(e.target.value)}
      />
    </div>
  )
}
