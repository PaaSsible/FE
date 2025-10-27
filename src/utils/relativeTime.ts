import { differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns'

type InputDate = string | Date | null | undefined

export function formatRelativeTime(input: InputDate) {
  if (!input) {
    return '-'
  }

  const createdAt = input instanceof Date ? input : new Date(input)

  if (Number.isNaN(createdAt.getTime())) {
    return '-'
  }

  const now = new Date()
  const minutesDiff = Math.max(0, differenceInMinutes(now, createdAt))

  if (minutesDiff < 60) {
    const minuteLabel = Math.max(1, minutesDiff)
    return `${minuteLabel}분 전`
  }

  const hoursDiff = Math.max(0, differenceInHours(now, createdAt))

  if (hoursDiff < 24) {
    const hourLabel = Math.max(1, hoursDiff)
    return `${hourLabel}시간 전`
  }

  const daysDiff = Math.max(0, differenceInDays(now, createdAt))

  if (daysDiff < 7) {
    const dayLabel = Math.max(1, daysDiff)
    return `${dayLabel}일 전`
  }

  return format(createdAt, 'yyyy.MM.dd')
}

export function formatDate(input: InputDate) {
  if (!input) return '-'
  const date = input instanceof Date ? input : new Date(input)
  if (Number.isNaN(date.getTime())) return '-'
  return format(date, 'yyyy.MM.dd')
}
