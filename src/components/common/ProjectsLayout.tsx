import { Outlet, useParams } from 'react-router-dom'

import ProjectSidebar from '@/components/common/ProjectsSidebar'

export default function ProjectsLayout() {
  const { projectId } = useParams()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProjectSidebar />

      <section className="flex-1 overflow-y-auto px-[100px] py-[45px]">
        <Outlet context={{ projectId }} />
      </section>
    </div>
  )
}
