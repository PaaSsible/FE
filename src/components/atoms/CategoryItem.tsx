import React from 'react'
import clsx from 'clsx'

interface CategoryMenuItemProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

const CategoryMenuItem: React.FC<CategoryMenuItemProps> = ({
  label,
  selected = false,
  onClick,
}) => {
  return (
    <div onClick={onClick} className="flex cursor-pointer flex-col items-center select-none">
      {selected && <span className="bg-locallit-red-500 mb-1 h-1.5 w-1.5 rounded-full" />}
      <span
        className={clsx(
          'font-pretendard transition-colors',
          selected ? 'text-b2-bold text-locallit-red-500' : 'text-b2-medium text-gray-700',
        )}
      >
        {label}
      </span>
    </div>
  )
}

export default CategoryMenuItem
