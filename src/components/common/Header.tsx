import React, { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Button from '../atoms/Button'
import Logo from '../atoms/Logo'
import MenuItem from '../atoms/MenuItem'

interface HeaderProps {
  isLoggedIn: boolean
}

type MenuType = '팀원 모집하기' | '프로젝트 대시보드' | '마이페이지'

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuToPath: Record<MenuType, string> = {
    '팀원 모집하기': '/boards',
    '프로젝트 대시보드': '/projects',
    마이페이지: '/mypage',
  }

  const activeMenu = useMemo<MenuType | ''>(() => {
    const { pathname } = location

    if (pathname.startsWith('/boards')) {
      return '팀원 모집하기'
    }

    if (pathname.startsWith('/projects')) {
      return '프로젝트 대시보드'
    }

    if (pathname.startsWith('/mypage')) {
      return '마이페이지'
    }

    return ''
  }, [location])

  return (
    <header className="bg-gray-0 relative z-10 flex h-[70px] w-full items-center justify-between px-12 shadow-[0_4px_20px_0_rgba(242,242,242,1)]">
      <Logo onClick={() => (window.location.href = '/')} />

      {isLoggedIn ? (
        <nav className="flex items-center gap-[35px]">
          {(['팀원 모집하기', '프로젝트 대시보드', '마이페이지'] as MenuType[]).map((menu) => (
            <MenuItem
              key={menu}
              label={menu}
              selected={activeMenu === menu}
              onClick={() => {
                const target = menuToPath[menu]
                if (target) {
                  void navigate(target)
                }
              }}
            />
          ))}
        </nav>
      ) : (
        <div className="flex gap-[14px]">
          <Button variant="secondary" shape="square">
            서비스 소개
          </Button>
          <Button variant="primary" shape="square" onClick={() => void navigate('/start')}>
            서비스 시작하기
          </Button>
        </div>
      )}
    </header>
  )
}

export default Header
