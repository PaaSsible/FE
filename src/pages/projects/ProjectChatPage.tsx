import ProjectsPageHeader from '@/components/feature/projects/ProjectsPageHeader'

export default function ProjectChatPage() {
  return (
    <div className="text-start">
      <ProjectsPageHeader title="채팅" onChatClick={() => console.log('채팅 추가')} />
    </div>
  )
}
