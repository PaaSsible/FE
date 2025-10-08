import { X } from 'lucide-react'
import clsx from 'clsx'

interface TagProps {
  label: string
  onRemove?: () => void
  className?: string
  withXIcon?: boolean
}

export function Tag({ label, onRemove, className, withXIcon = false }: TagProps) {
  const base = 'inline-flex items-center rounded-sm bg-gray-0'

  const withXIconStyle = 'gap-[9px] px-[10px] py-[3px]'
  const withoutXIconStyle = 'px-[5px] py-[3px] text-l2-medium'

  return (
    <div className={clsx(base, withXIcon ? withXIconStyle : withoutXIconStyle, className)}>
      <span className={clsx(withXIcon ? 'font-b4-medium' : 'font-l2-medium', 'text-gray-600')}>
        {label}
      </span>

      {withXIcon && onRemove && (
        <button type="button" onClick={onRemove} className="text-gray-550">
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
