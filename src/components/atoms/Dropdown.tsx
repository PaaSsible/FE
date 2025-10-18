import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface DropdownProps {
  placeholder: string
  options: string[]
  onSelect: (value: string) => void
  variant?: 'default' | 'form'
}

export default function Dropdown({
  placeholder,
  options,
  onSelect,
  variant = 'default',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (value: string) => {
    setSelected(value)
    setIsOpen(false)
    onSelect(value)
  }

  return (
    <div
      ref={dropdownRef}
      className={clsx(
        'relative select-none',
        variant === 'form' ? 'w-full' : 'inline-block text-left',
      )}
    >
      {/* 드롭다운 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          'text-b4-medium flex w-full items-center justify-between gap-[6px] rounded-lg',
          variant === 'default' ? 'text-gray-500' : 'bg-gray-200 px-5 py-[14px] text-gray-500',
        )}
      >
        <span className={selected ? 'text-gray-1000' : 'text-gray-500'}>
          {selected || placeholder}
        </span>
        <ChevronDown
          className={clsx(
            'h-6 w-6 transition-transform',
            isOpen && 'rotate-180',
            variant === 'form' && 'h-5 w-5',
          )}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul
          className={clsx(
            'text-gray-0 absolute z-10 mt-2 w-[177px] rounded-sm bg-gray-500 font-light',
            variant === 'default' && 'right-0',
            variant === 'form' && 'max-h-[242px] overflow-y-auto',
          )}
        >
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-5 py-[10px]"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
