import { isNewDay, isNewWeek, isNewMonth, isSleepCheckInDue } from '@/lib/resets'

const DAY = 24 * 60 * 60 * 1000

function daysAgo(n: number): string {
  return new Date(Date.now() - n * DAY).toISOString()
}

function isoToday(): string {
  return new Date().toISOString()
}

describe('isNewDay', () => {
  it('returns true when lastDay is null', () => {
    expect(isNewDay(null)).toBe(true)
  })

  it('returns true when last day was yesterday', () => {
    expect(isNewDay(daysAgo(1))).toBe(true)
  })

  it('returns false when last day is today', () => {
    expect(isNewDay(isoToday())).toBe(false)
  })
})

describe('isNewWeek', () => {
  it('returns true when lastWeek is null', () => {
    expect(isNewWeek(null)).toBe(true)
  })

  it('returns true when last week was 7+ days ago', () => {
    expect(isNewWeek(daysAgo(7))).toBe(true)
  })

  it('returns false when last week was 2 days ago', () => {
    expect(isNewWeek(daysAgo(2))).toBe(false)
  })
})

describe('isNewMonth', () => {
  it('returns true when lastMonth is null', () => {
    expect(isNewMonth(null)).toBe(true)
  })

  it('returns true when last month was a different calendar month', () => {
    const pastDate = new Date()
    pastDate.setMonth(pastDate.getMonth() - 1)
    expect(isNewMonth(pastDate.toISOString())).toBe(true)
  })

  it('returns false when last month is in the same calendar month', () => {
    expect(isNewMonth(isoToday())).toBe(false)
  })
})

describe('isSleepCheckInDue', () => {
  it('returns true when checkedInDate is null', () => {
    expect(isSleepCheckInDue(null)).toBe(true)
  })

  it('returns true when last check-in was yesterday', () => {
    expect(isSleepCheckInDue(daysAgo(1))).toBe(true)
  })

  it('returns false when already checked in today', () => {
    expect(isSleepCheckInDue(isoToday())).toBe(false)
  })
})
