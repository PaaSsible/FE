import clsx from 'clsx'
import { X } from 'lucide-react'

interface TagProps {
  label: string
  onRemove?: () => void
  className?: string
  withXIcon?: boolean
  variant?: 'default' | 'edit'
  size?: 'sm' | 'md'
}

export function Tag({
  label,
  onRemove,
  className,
  withXIcon = false,
  variant = 'default',
  size = 'md',
}: TagProps) {
  const base = 'inline-flex items-center text-gray-900'

  const variantStyles = {
    edit: 'rounded-sm bg-gray-0 gap-[9px] px-[10px] py-[3px]',
    default: clsx(
      size === 'md'
        ? 'rounded-[4px] px-[10px] py-[3px] gap-[9px] bg-gray-300'
        : 'rounded-sm bg-gray-0 px-[5px] py-[3px] bg-gray-0',
    ),
  }

  const fontStyles = {
    edit: 'font-b4-medium',
    default: size === 'sm' ? 'text-l2-medium' : 'font-l2-medium',
  }

  return (
    <div className={clsx(base, variantStyles[variant], className)}>
      <span className={fontStyles[variant]}>{label}</span>

      {variant === 'edit' && withXIcon && onRemove && (
        <button type="button" onClick={onRemove} className="text-gray-550">
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
