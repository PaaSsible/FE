import clsx from 'clsx'
import {
  type LucideProps,
  LayoutGrid,
  ChartLine,
  MonitorPlay,
  MessageCircleMore,
} from 'lucide-react'
import type { JSX } from 'react'
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'

interface AsideItemProps {
  label: string
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  onClick: () => void
  isActive: boolean
}

const AsideItem = ({ label, icon: Icon, onClick, isActive = false }: AsideItemProps) => {
  return (
    <Button
      onClick={onClick}
      className={clsx(
        "hover:bg-locallit-red-500 flex h-11 w-full items-center justify-start gap-2 rounded-lg bg-transparent px-3 py-3 font-['Pretendard'] text-sm font-medium text-black transition-colors duration-200 ease-in-out hover:text-white",
        isActive && 'bg-locallit-red-500 text-white',
      )}
    >
      <Icon className="h-5 w-5" />
      {label}
    </Button>
  )
}

const asideItems = [
  { label: '칸반보드', icon: LayoutGrid, path: 'board' },
  { label: '프로젝트 현황', icon: ChartLine, path: 'status' },
  { label: '온라인 회의', icon: MonitorPlay, path: 'meeting' },
  { label: '채팅', icon: MessageCircleMore, path: 'chat' },
]
const ProjectLayout = (): JSX.Element => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = location.pathname.split('/').at(-1)

  return (
    <div className="flex min-h-[954px]">
      <aside className="z-10 inline-flex min-h-full w-72 flex-col items-center justify-start gap-1 bg-white px-6 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.07)]">
        {asideItems.map(({ label, icon, path }, index) => (
          <AsideItem
            key={index}
            label={label}
            icon={icon}
            onClick={() => void navigate(`/projects/${projectId}/${path}`)}
            isActive={currentPath === path}
          />
        ))}
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default ProjectLayout
