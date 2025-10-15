import React from 'react'
import clsx from 'clsx'

interface TabProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

const Tab: React.FC<TabProps> = ({ label, selected = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative flex h-[42px] cursor-pointer items-end justify-center gap-[3px] select-none"
    >
      {selected && (
        <span className="bg-locallit-red-500 absolute top-0 left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full" />
      )}

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

export default Tab
