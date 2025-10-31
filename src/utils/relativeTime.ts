import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const KST_TIMEZONE = 'Asia/Seoul'

type InputDate = string | Date | null | undefined

export function formatRelativeTime(input: InputDate) {
  const createdAt = toKstDayjs(input)
  if (!createdAt) return '-'

  const now = dayjs.utc().tz(KST_TIMEZONE)
  const minutesDiff = Math.max(0, now.diff(createdAt, 'minute'))

  if (minutesDiff < 60) {
    const minuteLabel = Math.max(1, minutesDiff)
    return `${minuteLabel}분 전`
  }

  const hoursDiff = Math.max(0, now.diff(createdAt, 'hour'))

  if (hoursDiff < 24) {
    const hourLabel = Math.max(1, hoursDiff)
    return `${hourLabel}시간 전`
  }

  const daysDiff = Math.max(0, now.diff(createdAt, 'day'))

  if (daysDiff < 7) {
    const dayLabel = Math.max(1, daysDiff)
    return `${dayLabel}일 전`
  }

  return createdAt.format('YYYY.MM.DD')
}

export function formatDate(input: InputDate) {
  const date = toKstDayjs(input)
  if (!date) return '-'
  return date.format('YYYY.MM.DD')
}

function toKstDayjs(value: InputDate) {
  if (!value) {
    return null
  }

  const appendUtcSuffixIfMissing = (original: string) => {
    const hasTimezoneInfo = /([zZ]|[+-]\d{2}:?\d{2})$/.test(original)
    return hasTimezoneInfo ? original : `${original}Z`
  }

  if (value instanceof Date) {
    const isoString = value.toISOString()
    const parsedUtc = dayjs.utc(isoString)
    return parsedUtc.isValid() ? parsedUtc.tz(KST_TIMEZONE) : null
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null

    const normalized = appendUtcSuffixIfMissing(trimmed.replace(' ', 'T'))
    const parsedUtc = dayjs.utc(normalized)
    if (parsedUtc.isValid()) {
      return parsedUtc.tz(KST_TIMEZONE)
    }

    const parsedLocal = dayjs(trimmed)
    return parsedLocal.isValid() ? parsedLocal.tz(KST_TIMEZONE) : null
  }

  return null
}
