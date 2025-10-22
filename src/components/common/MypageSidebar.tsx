import { UserRound, Bell, FileImage, FilePen } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: '나의 프로필', path: '/mypage', icon: <UserRound size={18} /> },
  { label: '포트폴리오 관리', path: '/mypage/portfolio', icon: <FileImage size={18} /> },
  { label: '지원 내역 확인', path: '/mypage/applications', icon: <FilePen size={18} /> },
  { label: '알림', path: '/mypage/notifications', icon: <Bell size={18} /> },
]

export default function MypageSidebar() {
  return (
    <aside className="bg-gray-0 relative z-10 flex h-[954px] w-[280px] flex-col pt-6 pb-6 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.12)]">
      <nav className="flex flex-col gap-1 px-[24px]">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `text-b5-medium flex h-[44px] w-[232px] items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                isActive ? 'bg-locallit-red-300 text-gray-900' : 'text-gray-500 hover:bg-gray-100'
              }`
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
