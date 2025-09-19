import React from 'react'
import clsx from 'clsx'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

const Chip: React.FC<ChipProps> = ({ label, selected = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'font-pretendard rounded-full border px-4 py-2 transition-colors select-none',
        selected
          ? 'bg-locallit-red-500 border-locallit-red-500 text-l1-bold text-gray-50'
          : 'border-gray-250 text-l1-medium text-gray-850 bg-white',
      )}
    >
      {label}
    </button>
  )
}

export default Chip
