import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import clsx from 'clsx'

interface DropdownProps {
  placeholder: string // 처음 표시할 기본 텍스트
  options: string[]
  onSelect: (value: string) => void
}

export default function Dropdown({ placeholder, options, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
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
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* 드롭다운 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-[6px] text-gray-500"
      >
        <span>{selected || placeholder}</span>
        <ChevronDown className={clsx('h-6 w-6 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <ul className="text-gray-0 absolute right-0 z-10 mt-2 w-[177px] rounded-sm bg-gray-500 font-light">
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
