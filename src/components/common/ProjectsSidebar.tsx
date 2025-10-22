import { MessageCircleMore, TrendingUp, MonitorPlay, LayoutGrid } from 'lucide-react'
import { NavLink, useParams } from 'react-router-dom'

const navItems = [
  { label: '칸반보드', path: 'board', icon: <LayoutGrid size={18} /> },
  { label: '프로젝트 현황', path: 'status', icon: <TrendingUp size={18} /> },
  { label: '온라인 회의', path: 'meeting', icon: <MonitorPlay size={18} /> },
  { label: '채팅', path: 'chat', icon: <MessageCircleMore size={18} /> },
]

export default function ProjectsSidebar() {
  const { projectId } = useParams()

  return (
    <aside className="bg-gray-0 relative z-10 flex h-[954px] w-[280px] flex-col pt-6 pb-6 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.12)]">
      <nav className="flex flex-col gap-1 px-[24px]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={`/projects/${projectId}/${item.path}`}
            className={({ isActive }) =>
              `text-b5-medium flex h-[44px] w-[232px] items-center gap-3 rounded-lg px-4 py-3 transition-colors ${isActive ? 'bg-locallit-red-300 text-gray-900' : 'text-gray-500 hover:bg-gray-100'} `
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
