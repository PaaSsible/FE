import { format, isValid, parseISO } from 'date-fns'

const parseDateValue = (value: string): Date | null => {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T')

  try {
    const parsed = parseISO(normalized)
    if (isValid(parsed)) {
      return parsed
    }
  } catch {
    // ignore parseISO errors and fall back to native Date
  }

  const fallback = new Date(trimmed)
  return Number.isNaN(fallback.getTime()) ? null : fallback
}

export const formatRecruitDateLabel = (value?: string | null): string => {
  if (!value) {
    return '-'
  }

  const parsed = parseDateValue(value)
  if (!parsed) {
    return '-'
  }

  const hasTimeInfo = /T|\s\d{2}:\d{2}/.test(value)
  const formatString = hasTimeInfo ? 'yyyy.MM.dd HH:mm' : 'yyyy.MM.dd'

  return format(parsed, formatString)
}

export { parseDateValue }
