import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const KST_TIMEZONE = 'Asia/Seoul'

const toKstDayjs = (value?: string | null) => {
  if (!value) return null

  const trimmed = value.trim()
  if (!trimmed) return null

  const normalized = (() => {
    const withT = trimmed.includes(' ') ? trimmed.replace(' ', 'T') : trimmed
    const hasTimezoneInfo = /([zZ]|[+-]\d{2}:?\d{2})$/.test(withT)
    return hasTimezoneInfo ? withT : `${withT}Z`
  })()

  const parsedUtc = dayjs.utc(normalized)
  if (parsedUtc.isValid()) {
    return parsedUtc.tz(KST_TIMEZONE)
  }

  const fallback = dayjs(trimmed)
  return fallback.isValid() ? fallback.tz(KST_TIMEZONE) : null
}

export const formatRecruitDateLabel = (value?: string | null): string => {
  if (!value) {
    return '-'
  }

  const parsed = toKstDayjs(value)
  if (!parsed) {
    return '-'
  }

  const hasTimeInfo = /T|\s\d{2}:\d{2}/.test(value)
  const formatString = hasTimeInfo ? 'YYYY.MM.DD HH:mm' : 'YYYY.MM.DD'

  return parsed.format(formatString)
}
