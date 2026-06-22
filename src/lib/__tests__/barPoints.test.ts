import {
  DAILY_BAR_PTS,
  WEEKLY_BAR_PTS,
  MONTHLY_BAR_PTS,
  isPreferredStat,
  getBarConfig,
  getBarPercent,
  getBarWidthClass,
} from '@/lib/barPoints'
import type { Stat, PlayerClass } from '@/types'

describe('constants', () => {
  it('daily bar points = 1', () => expect(DAILY_BAR_PTS).toBe(1))
  it('weekly bar points = 4', () => expect(WEEKLY_BAR_PTS).toBe(4))
  it('monthly bar points = 14', () => expect(MONTHLY_BAR_PTS).toBe(14))
})

describe('isPreferredStat', () => {
  it('knight prefers health', () => expect(isPreferredStat('knight', 'health')).toBe(true))
  it('knight does not prefer stamina', () => expect(isPreferredStat('knight', 'stamina')).toBe(false))
  it('wizard prefers mana', () => expect(isPreferredStat('wizard', 'mana')).toBe(true))
  it('bard prefers stamina', () => expect(isPreferredStat('bard', 'stamina')).toBe(true))
})

describe('getBarConfig', () => {
  it('preferred stat: fillAt=70, max=90', () => {
    const cfg = getBarConfig('knight', 'health')
    expect(cfg.fillAt).toBe(70)
    expect(cfg.max).toBe(90)
  })

  it('non-preferred stat: fillAt=40, max=46', () => {
    const cfg = getBarConfig('knight', 'stamina')
    expect(cfg.fillAt).toBe(40)
    expect(cfg.max).toBe(46)
  })
})

describe('getBarPercent', () => {
  it('0 points = 0%', () => expect(getBarPercent(0, 70)).toBe(0))
  it('fillAt points = 100%', () => expect(getBarPercent(70, 70)).toBe(100))
  it('half fillAt = 50%', () => expect(getBarPercent(35, 70)).toBe(50))
  it('above fillAt caps at 100%', () => expect(getBarPercent(90, 70)).toBe(100))
})

describe('getBarWidthClass', () => {
  it('preferred stat returns full-width class', () => {
    expect(getBarWidthClass('knight', 'health')).toBe('w-full')
  })

  it('non-preferred stat returns 2/3 width class', () => {
    expect(getBarWidthClass('knight', 'stamina')).toBe('w-2/3')
  })
})
