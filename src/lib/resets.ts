function toCalendarDay(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function toCalendarMonth(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth()}`
}

function todayKey(): string {
  return toCalendarDay(new Date().toISOString())
}

function thisMonthKey(): string {
  return toCalendarMonth(new Date().toISOString())
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function isNewDay(lastDay: string | null): boolean {
  if (!lastDay) return true
  return toCalendarDay(lastDay) !== todayKey()
}

export function isNewWeek(lastWeek: string | null): boolean {
  if (!lastWeek) return true
  return Date.now() - new Date(lastWeek).getTime() >= WEEK_MS
}

export function isNewMonth(lastMonth: string | null): boolean {
  if (!lastMonth) return true
  return toCalendarMonth(lastMonth) !== thisMonthKey()
}

export function isSleepCheckInDue(checkedInDate: string | null): boolean {
  if (!checkedInDate) return true
  return toCalendarDay(checkedInDate) !== todayKey()
}
