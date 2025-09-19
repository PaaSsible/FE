import React from 'react'

interface LogoProps {
  width?: number
  height?: number
  onClick?: () => void
}

const Logo: React.FC<LogoProps> = ({ width = 72, height = 58, onClick }) => {
  return (
    <img
      src="../../assets/logo.svg"
      alt="로컬잇 로고"
      width={width}
      height={height}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    />
  )
}

export default Logo
