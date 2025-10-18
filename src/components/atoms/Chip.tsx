import clsx from 'clsx'
import React from 'react'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  variant?: 'default' | 'stack'
}

const ChipComponent: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  variant = 'default',
}) => {
  if (variant === 'stack') {
    return (
      <span className="bg-gray-250 font-pretendard text-l1-medium inline-flex items-center rounded-[30px] px-3 py-[6px] text-gray-500">
        {label}
      </span>
    )
  }

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
