import clsx from 'clsx'
import React from 'react'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

const ChipComponent: React.FC<ChipProps> = ({ label, selected = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'font-pretendard rounded-full border px-4 py-2 transition-colors select-none',
        selected
          ? 'border-locallit-red-500 bg-locallit-red-500 text-l1-bold text-gray-50'
          : 'border-gray-250 text-l1-medium text-gray-850 bg-white hover:bg-gray-100',
      )}
    >
      {label}
    </button>
  )
}

export const Chip = React.memo(ChipComponent)

export default Chip
