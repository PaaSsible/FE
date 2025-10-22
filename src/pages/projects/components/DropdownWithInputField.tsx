'use client'

import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import { type JSX } from 'react'

import { Tag } from '@/components/atoms/Tag'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DropdownWithInputFieldSingleProps<T> {
  multiple?: false
  options: readonly T[]
  selectedOption: T | undefined
  setSelectedOption: (option: T) => void
  placeholder?: string
  className?: string
}

interface DropdownWithInputFieldMultipleProps<T> {
  multiple: true
  options: readonly T[]
  selectedOption: T[]
  setSelectedOption: (option: T[]) => void
  placeholder?: string
  className?: string
}

type DropdownWithInputFieldProps<T> =
  | DropdownWithInputFieldSingleProps<T>
  | DropdownWithInputFieldMultipleProps<T>

export function DropdownWithInputField<T extends string>(
  props: DropdownWithInputFieldProps<T>,
): JSX.Element {
  const {
    multiple = false,
    options,
    selectedOption,
    setSelectedOption,
    placeholder,
    className,
  } = props

  const handleSelect = (option: T) => {
    if (!multiple) {
      // 단일 선택
      ;(setSelectedOption as (option: T) => void)(option)
      return
    }

    // 다중 선택
    const selectedArray = selectedOption as T[]
    if (selectedArray.includes(option)) {
      ;(setSelectedOption as (option: T[]) => void)(selectedArray.filter((o) => o !== option))
    } else {
      ;(setSelectedOption as (option: T[]) => void)([...selectedArray, option])
    }
  }

  const handleRemove = (option: T) => {
    if (!multiple) return // 단일 선택일 때는 아무 것도 안함
    if (!Array.isArray(selectedOption)) return // 안전 체크
    ;(setSelectedOption as (option: T[]) => void)(selectedOption.filter((o) => o !== option))
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-between overflow-hidden rounded-lg bg-gray-200 px-5 py-3.5',
        className,
      )}
    >
      <div
        className={clsx(
          "flex flex-wrap justify-start gap-2.5 font-['Pretendard'] text-lg leading-7 font-medium text-black",
        )}
      >
        {multiple
          ? selectedOption && Array.isArray(selectedOption) && selectedOption.length > 0
            ? selectedOption.map((option, _) => (
                <Tag
                  key={`${option}`}
                  label={option}
                  withXIcon={true}
                  onRemove={() => handleRemove(option)}
                />
              ))
            : placeholder
          : selectedOption || placeholder}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <ChevronDown className="h-6 w-6 text-gray-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="inline-flex max-h-60 w-44 flex-col items-start justify-start overflow-y-auto border-none bg-stone-400 focus-visible:outline-none"
        >
          {options.map((option, index) => (
            <DropdownMenuCheckboxItem
              key={index}
              className="w-full px-5 py-2.5 font-['Inter'] text-base leading-normal font-normal text-white"
              onCheckedChange={() => handleSelect(option)}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
