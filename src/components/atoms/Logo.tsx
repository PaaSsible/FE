import React from 'react'

interface LogoProps {
  height?: number
  onClick?: () => void
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
  return (
    <img
      src={'assets/images/codo.svg'}
      alt="CoDo 로고"
      style={{ height: 'auto', width: '115px', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    />
  )
}

export default Logo
