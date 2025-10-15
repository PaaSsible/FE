import { Calendar } from 'lucide-react'
import clsx from 'clsx'
import { Tag } from '@/components/atoms/Tag' // Tag atom import

type InputFieldVariant = 'default' | 'selected' | 'techTag' | 'error'

interface InputFieldProps {
  label?: string
  value?: string
  variant?: InputFieldVariant
  placeholder?: string
  tags?: string[]
  errorMessage?: string
  onRemoveTag?: (tag: string) => void
}

export function InputField({
  label,
  value,
  variant = 'default',
  placeholder = 'Text',
  tags = [],
  errorMessage,
  onRemoveTag,
}: InputFieldProps) {
  return (
    <div className="w-[562px]">
      {/* default, selected, error 공통 input */}
      {(variant === 'default' || variant === 'selected' || variant === 'error') && (
        <div className="flex min-h-[56px] items-center justify-between rounded-lg bg-gray-200 px-[20px] py-[14px]">
          <span
            className={clsx('text-b4-medium', !value && variant === 'default' && 'text-gray-500')}
          >
            {value || placeholder}
          </span>
          <Calendar className="h-6 w-6 text-neutral-500" />
        </div>
      )}

      {/* techTag variant */}
      {variant === 'techTag' && (
        <div className="flex flex-wrap gap-[10px] rounded-lg bg-gray-200 px-[20px] py-[14px]">
          {tags.map((tag, idx) => (
            <Tag key={idx} label={tag} onRemove={() => onRemoveTag?.(tag)} />
          ))}
        </div>
      )}

      {/* error 메시지 */}
      {variant === 'error' && errorMessage && (
        <p className="text-b5-medium mt-[7px] text-start text-red-500">* {errorMessage}</p>
      )}
    </div>
  )
}
