import React from 'react'
import clsx from 'clsx'

type ButtonType = 'primary' | 'secondary'

interface ButtonPopupProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: ButtonType // primary / secondary
  disabled?: boolean
}

export default function ButtonPopup({
  children,
  buttonType = 'primary',
  disabled = false,
  className,
  ...props
}: ButtonPopupProps) {
  const base =
    'w-[202px] h-[51px] font-pretendard text-b4-bold rounded-sm transition-colors focus:outline-none inline-flex items-center justify-center'

  const variants: Record<ButtonType, string> = {
    primary: 'bg-locallit-red-500 text-gray-0 hover:bg-locallit-red-600 active:bg-locallit-red-800',
    secondary:
      'border-[1.5px] border-locallit-red-500 bg-gray-0 text-locallit-red-500 hover:bg-locallit-red-50 active:bg-locallit-red-100',
  }

  const disabledStyle: Record<ButtonType, string> = {
    primary: 'bg-locallit-red-200 text-gray-0 cursor-not-allowed',
    secondary: 'border border-locallit-red-200 bg-gray-0 text-locallit-red-200 cursor-not-allowed',
  }

  return (
    <button
      className={clsx(base, disabled ? disabledStyle[buttonType] : variants[buttonType], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
