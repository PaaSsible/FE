import React from 'react'
import clsx from 'clsx'

interface PageProps {
  number: number
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}

export const Page: React.FC<PageProps> = ({
  number,
  selected = false,
  disabled = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={!disabled ? onClick : undefined}
      className={clsx(
        'flex h-[32px] w-[32px] items-center justify-center rounded-[8px] text-sm font-medium transition-colors',
        disabled
          ? 'bg-gray-0 cursor-not-allowed border border-gray-400 text-gray-400'
          : selected
            ? 'bg-locallit-red-500 border border-transparent text-white'
            : 'border border-gray-400 bg-white text-gray-800 hover:bg-gray-50',
      )}
    >
      {number}
    </button>
  )
}
