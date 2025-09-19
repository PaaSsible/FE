import React, { useState } from 'react'
import Logo from '../atoms/Logo'
import MenuItem from '../atoms/MenuItem'
import Button from '../atoms/Button'

interface HeaderProps {
  isLoggedIn: boolean
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const [activeMenu, setActiveMenu] = useState('')

  return (
    <header className="bg-gray-0 flex h-[70px] w-full items-center justify-between border-b px-12">
      <Logo onClick={() => (window.location.href = '/')} />

      {isLoggedIn ? (
        <nav className="flex items-center gap-[35px]">
          {['팀원 모집하기', '프로젝트 대시보드', '마이페이지'].map((menu) => (
            <MenuItem
              key={menu}
              label={menu}
              selected={activeMenu === menu}
              onClick={() => setActiveMenu(menu)}
            />
          ))}
        </nav>
      ) : (
        <div className="flex gap-[14px]">
          <Button variant="secondary" shape="square">
            서비스 소개
          </Button>
          <Button variant="primary" shape="square">
            서비스 시작하기
          </Button>
        </div>
      )}
    </header>
  )
}

export default Header
