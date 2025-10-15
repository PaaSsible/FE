import React from 'react'
import logo from '../../assets/logo.svg'

interface LogoProps {
  height?: number
  onClick?: () => void
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <img
      src={logo}
      alt="로컬잇 로고"
      style={{ height: 'auto', width: '72px', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    />
  )
}

export default Logo
