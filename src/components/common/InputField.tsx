import clsx from 'clsx'
import { format, isValid, parse } from 'date-fns'
import { Calendar } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Tag } from '@/components/atoms/Tag'
import { CalendarDropdown } from '@/components/feature/boards/boardNew/CalendarDropdown'

type InputFieldVariant = 'default' | 'selected' | 'techTag' | 'error'

interface InputFieldProps {
  value?: string
  variant?: InputFieldVariant
  placeholder?: string
  tags?: string[]
  errorMessage?: string
  onRemoveTag?: (tag: string) => void
  onSelectDate?: (date: Date) => void
  dateValue?: Date | null
  dateFormat?: string
  className?: string
}

export function InputField({
  value,
  variant = 'default',
  placeholder = 'Text',
  tags = [],
  errorMessage,
  onRemoveTag,
  onSelectDate,
  dateValue = null,
  dateFormat = 'yyyy-MM-dd',
  className,
}: InputFieldProps) {
  const isInteractiveVariant =
    variant === 'default' || variant === 'selected' || variant === 'error'
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isCalendarOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCalendarOpen])

  const parsedValue = useMemo(() => {
    if (dateValue) return dateValue
    if (!value) return null
    const parsed = parse(value, dateFormat, new Date())
    return isValid(parsed) ? parsed : null
  }, [dateValue, value, dateFormat])

  const displayValue = useMemo(() => {
    if (value) return value
    if (parsedValue) return format(parsedValue, dateFormat)
    return placeholder
  }, [value, parsedValue, dateFormat, placeholder])

  const handleToggleCalendar = () => {
    if (!isInteractiveVariant) return
    setIsCalendarOpen((prev) => !prev)
  }

  const handleSelectDate = (date: Date) => {
    onSelectDate?.(date)
    setIsCalendarOpen(false)
  }

  return (
    <div ref={containerRef} className={clsx('relative min-w-[562px]', className)}>
      {/* default, selected, error 공통 input */}
      {isInteractiveVariant && (
        <>
          <div
            className={clsx(
              'flex min-h-[56px] items-center justify-between rounded-lg bg-gray-200 px-[20px] py-[14px]',
            )}
          >
            <span
              className={clsx(
                'text-b4-medium',
                !value && !parsedValue && variant === 'default' && 'text-gray-500',
              )}
            >
              {displayValue}
            </span>
            <button
              type="button"
              onClick={handleToggleCalendar}
              className="flex h-6 w-6 items-center justify-center text-neutral-500 transition hover:text-neutral-700 focus:outline-none"
            >
              <Calendar className="h-6 w-6" />
            </button>
          </div>

          {isCalendarOpen && (
            <div className="absolute left-0 z-10 mt-2">
              <CalendarDropdown selectedDate={parsedValue} onSelectDate={handleSelectDate} />
            </div>
          )}
        </>
      )}

      {/* techTag variant */}
      {variant === 'techTag' && (
        <div className="flex flex-wrap gap-[10px] rounded-lg bg-gray-200 px-[20px] py-[14px]">
          {tags.map((tag) => (
            <Tag
              key={tag}
              label={tag}
              variant="edit"
              withXIcon
              onRemove={() => onRemoveTag?.(tag)}
            />
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
