import clsx from 'clsx'
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface CalendarDropdownProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
}

export function CalendarDropdown({ selectedDate, onSelectDate }: CalendarDropdownProps) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(selectedDate ?? new Date()))

  useEffect(() => {
    setCurrentMonth(startOfMonth(selectedDate ?? new Date()))
  }, [selectedDate])

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 })

    const days: Date[] = []
    let cursor = start

    while (cursor <= end) {
      days.push(cursor)
      cursor = addDays(cursor, 1)
    }

    return days
  }, [currentMonth])

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const handleSelect = (day: Date) => {
    onSelectDate(day)
  }

  return (
    <div className="w-[276px] rounded-md border border-gray-200 bg-white p-3 text-sm leading-5 font-normal">
      <div className="mb-2 flex items-center justify-between px-2">
        <button
          type="button"
          onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-200"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-200"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 text-center text-xs font-medium text-gray-500">
        {weekDays.map((day) => (
          <div key={day} className="flex h-8 items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center">
        {calendarDays.map((day) => {
          const isCurrentMonthDay = isSameMonth(day, currentMonth)
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false
          const isToday = isSameDay(day, new Date())

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleSelect(day)}
              className={clsx(
                'mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-md text-sm leading-5 font-normal transition-colors',
                {
                  'bg-neutral-900 text-white': isSelected,
                  'bg-gray-100 text-neutral-900': !isSelected && isToday,
                  'text-gray-900 hover:bg-gray-100': !isSelected && !isToday && isCurrentMonthDay,
                  'text-gray-300 hover:bg-gray-100': !isCurrentMonthDay,
                },
              )}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
