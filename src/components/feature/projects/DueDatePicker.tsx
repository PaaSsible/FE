/* eslint-disable import/extensions */

import clsx from 'clsx'
import dayjs from 'dayjs'
import { ChevronDownIcon } from 'lucide-react'
import { useState, type JSX } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DueDatePickerProps {
  date: Date | undefined
  setDate: (date: Date) => void
}

export function DueDatePicker({ date, setDate }: DueDatePickerProps): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            className={clsx(
              'w-full justify-between bg-transparent text-sm leading-tight font-medium hover:bg-transparent',
              {
                'text-black': date,
                'text-zinc-900 opacity-50': !date,
              },
            )}
          >
            {date ? dayjs(date).format('YYYY년 MM월 DD일') : '마감기한 설정'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden border-none p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            className="!outline-none"
            captionLayout="dropdown"
            onSelect={(date: Date | undefined) => {
              if (date) {
                setDate(date)
                setOpen(false)
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
