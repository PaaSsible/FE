import clsx from 'clsx'
import React from 'react'

interface MenuItemProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

const MenuItem: React.FC<MenuItemProps> = ({ label, selected = false, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={clsx(
        'font-pretendard cursor-pointer px-2 py-1 transition-colors select-none',
        selected && 'text-b5-extrabold text-locallit-red-500',
        !selected && [
          'text-b5-medium text-gray-900',
          'hover:text-b5-bold',
          'active:text-b5-bold active:text-locallit-red-800',
        ],
      )}
    >
      {label}
    </span>
  )
}

export default MenuItem
