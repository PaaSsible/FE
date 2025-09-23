// src/components/atoms/Button.tsx
import React from 'react'
import clsx from 'clsx'

type ButtonSize = 'small' | 'medium' | 'large'
type ButtonVariant = 'primary' | 'secondary'
type ButtonShape = 'square' | 'rounded'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  variant?: ButtonVariant
  shape?: ButtonShape
}

export default function Button({
  children,
  size = 'small',
  variant = 'primary',
  shape = 'square',
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const base =
    'font-pretendard transition-colors focus:outline-none inline-flex items-center justify-center'

  /** Variant (색상 + state) */
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-locallit-red-500 text-gray-0 hover:bg-locallit-red-600 active:bg-locallit-red-800',
    secondary:
      'bg-locallit-red-50 text-locallit-red-500 hover:bg-locallit-red-200 hover:text-locallit-red-600 active:bg-locallit-red-300 active:text-locallit-red-600',
  }

  const disabledStyle = 'bg-locallit-red-50 text-locallit-red-200 cursor-not-allowed'

  /** Size + Shape 조합 */
  const sizeShape: Record<ButtonShape, Record<ButtonSize, string>> = {
    square: {
      small: 'w-[141px] h-[40px] px-5 py-2.5 rounded-md text-b5-medium',
      medium: 'w-[512px] h-[64px] px-6 py-3 rounded-sm text-b3-medium',
      large: 'w-[240px] h-[56px] px-8 py-4 rounded-md', // 나중에 정의
    },
    rounded: {
      small: 'w-[166px] h-[52px] px-[26px] py-[10px] rounded-[30px] text-b4-bold',
      medium: 'w-[180px] h-[52px] px-[26px] py-[10px] rounded-[30px]', // 나중에 정의
      large: 'w-[240px] h-[56px] px-8 py-4 rounded-[30px]', // 나중에 정의
    },
  }

  return (
    <button
      className={clsx(
        base,
        sizeShape[shape][size],
        disabled ? disabledStyle : variants[variant],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
