import { xpToNextLevel, applySleepBuff, applyXpGain } from '@/lib/xp'

describe('xpToNextLevel', () => {
  it('level 1 requires 100 xp', () => {
    expect(xpToNextLevel(1)).toBe(100)
  })

  it('each level costs 1% more than previous, rounded', () => {
    expect(xpToNextLevel(2)).toBe(Math.round(100 * 1.01))
    expect(xpToNextLevel(3)).toBe(Math.round(Math.round(100 * 1.01) * 1.01))
  })

  it('level 10 costs more than level 1', () => {
    expect(xpToNextLevel(10)).toBeGreaterThan(xpToNextLevel(1))
  })
})

describe('applySleepBuff', () => {
  it('adds 20% when sleep buff is active', () => {
    expect(applySleepBuff(100, true)).toBe(120)
  })

  it('returns original xp when sleep buff is inactive', () => {
    expect(applySleepBuff(100, false)).toBe(100)
  })

  it('floors result to integer', () => {
    expect(applySleepBuff(15, true)).toBe(18)
  })
})

describe('applyXpGain', () => {
  it('returns new xp and same level when not enough to level up', () => {
    const result = applyXpGain(50, 1, 30)
    expect(result.xp).toBe(80)
    expect(result.level).toBe(1)
  })

  it('levels up and carries over excess xp', () => {
    const result = applyXpGain(90, 1, 50)
    expect(result.level).toBe(2)
    expect(result.xp).toBe(90 + 50 - xpToNextLevel(1))
  })

  it('can level up multiple times from a single gain', () => {
    const result = applyXpGain(0, 1, 500)
    expect(result.level).toBeGreaterThan(2)
  })
})
