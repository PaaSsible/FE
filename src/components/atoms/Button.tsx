import clsx from 'clsx'
import React from 'react'

type ButtonSize = 'medium' | 'big'
type ButtonVariant = 'primary' | 'secondary'
type ButtonShape = 'square' | 'rounded'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  variant?: ButtonVariant
  shape?: ButtonShape
}

export default function Button({
  children,
  size = 'medium',
  variant = 'primary',
  shape = 'square',
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const base =
    'font-pretendard transition-colors focus:outline-none inline-flex items-center justify-center'

  const primaryStyles =
    'bg-locallit-red-500 text-gray-0 hover:bg-locallit-red-600 active:bg-locallit-red-800'

  const secondaryMediumStyles =
    'bg-locallit-red-50 text-locallit-red-500 border border-locallit-red-500 hover:bg-locallit-red-200 hover:text-locallit-red-600 active:bg-locallit-red-300 active:text-locallit-red-600'

  const secondaryBigActiveStyles =
    'bg-gray-0 border-[1.5px] border-locallit-red-500 text-locallit-red-500 hover:bg-locallit-red-50 active:bg-locallit-red-100'

  const generalDisabledStyle = 'bg-locallit-red-200 text-gray-0 cursor-not-allowed'

  const secondaryBigDisabledStyle =
    'bg-gray-0 border-[1.5px] border-locallit-red-200 text-locallit-red-200 cursor-not-allowed'

  // variant와 size에 따른 최종 스타일 결정 로직
  const isSecondaryBig = variant === 'secondary' && size === 'big'

  let finalStyles: string

  if (disabled) {
    // 비활성화 상태인 경우
    finalStyles = isSecondaryBig ? secondaryBigDisabledStyle : generalDisabledStyle
  } else {
    // 활성화 상태인 경우
    if (variant === 'primary') {
      finalStyles = primaryStyles
    } else {
      // variant === 'secondary'
      finalStyles = isSecondaryBig ? secondaryBigActiveStyles : secondaryMediumStyles
    }
  }

  const sizeShape: Record<ButtonShape, Record<ButtonSize, string>> = {
    square: {
      medium: 'h-[40px] px-5 py-2.5 rounded-md text-b5-medium',
      big: 'h-[52px] px-5 py-2.5 rounded-md text-b4-bold',
    },
    rounded: {
      medium: 'h-[40px] px-5 py-2.5 rounded-md text-b5-medium',
      big: 'h-[52px] px-[26px] py-[10px] rounded-[30px] text-b4-bold',
    },
  }

  return (
    <button
      className={clsx(base, finalStyles, sizeShape[shape][size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
