import clsx from 'clsx'
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface MultiSelectDropdownProps {
  placeholder: string
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export default function MultiSelectDropdown({
  placeholder,
  options,
  selected,
  onChange,
  open,
  onOpenChange,
  className,
}: MultiSelectDropdownProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value)
    }
    onOpenChange?.(value)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOption = (option: string) => {
    const exists = selected.includes(option)
    const next = exists ? selected.filter((item) => item !== option) : [...selected, option]
    onChange(next)
  }

  return (
    <div
      ref={dropdownRef}
      className={clsx('relative inline-block w-full text-left select-none', className)}
    >
      <button
        type="button"
        onClick={() => setOpen(!isOpen)}
        className="text-b4-medium flex w-full items-center justify-between gap-[6px] rounded-lg bg-gray-200 px-5 py-[14px] text-gray-500"
      >
        <span>{placeholder}</span>
        <ChevronDown className={clsx('h-6 w-6 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <ul className="text-gray-0 absolute z-10 mt-2 max-h-[242px] w-[177px] overflow-y-auto rounded-sm bg-gray-500 font-light">
          {options.map((option) => {
            const isSelected = selected.includes(option)
            return (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => toggleOption(option)}
                  className="text-gray-0 flex w-full items-center justify-between px-5 py-[10px]"
                >
                  <span>{option}</span>
                  <Check
                    className={clsx(
                      'h-4 w-4 transition-opacity',
                      isSelected ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
