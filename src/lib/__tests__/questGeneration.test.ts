import {
  generateDailyQuests,
  generateWeeklyQuests,
  generateMonthlyQuest,
  rerollQuest,
  createCustomQuest,
} from '@/lib/questGeneration'
import type { PlayerClass, Stat } from '@/types'

describe('generateDailyQuests', () => {
  it('returns exactly 4 quests', () => {
    const quests = generateDailyQuests('knight')
    expect(quests).toHaveLength(4)
  })

  it('all quests are daily tier', () => {
    const quests = generateDailyQuests('wizard')
    quests.forEach(q => expect(q.tier).toBe('daily'))
  })

  it('all quests have completed=false', () => {
    const quests = generateDailyQuests('bard')
    quests.forEach(q => expect(q.completed).toBe(false))
  })

  it('includes at least 2 primary stat quests for knight', () => {
    const results: Record<string, number> = { health: 0, stamina: 0, mana: 0 }
    for (let i = 0; i < 20; i++) {
      generateDailyQuests('knight').forEach(q => results[q.stat]++)
    }
    expect(results['health']).toBeGreaterThanOrEqual(40)
  })

  it('each quest has a unique id', () => {
    const quests = generateDailyQuests('knight')
    const ids = new Set(quests.map(q => q.id))
    expect(ids.size).toBe(4)
  })
})

describe('generateWeeklyQuests', () => {
  it('returns exactly 3 quests', () => {
    const quests = generateWeeklyQuests('knight')
    expect(quests).toHaveLength(3)
  })

  it('all quests are weekly tier', () => {
    const quests = generateWeeklyQuests('wizard')
    quests.forEach(q => expect(q.tier).toBe('weekly'))
  })

  it('contains one of each stat (balanced)', () => {
    const quests = generateWeeklyQuests('bard')
    const stats = quests.map(q => q.stat).sort()
    expect(stats).toEqual(['health', 'mana', 'stamina'])
  })
})

describe('generateMonthlyQuest', () => {
  it('returns exactly 1 quest', () => {
    const quest = generateMonthlyQuest('knight')
    expect(quest).toBeDefined()
  })

  it('is monthly tier', () => {
    const quest = generateMonthlyQuest('wizard')
    expect(quest.tier).toBe('monthly')
  })

  it('knight monthly is health stat', () => {
    const quest = generateMonthlyQuest('knight')
    expect(quest.stat).toBe('health')
  })

  it('wizard monthly is mana stat', () => {
    const quest = generateMonthlyQuest('wizard')
    expect(quest.stat).toBe('mana')
  })

  it('bard monthly is stamina stat', () => {
    const quest = generateMonthlyQuest('bard')
    expect(quest.stat).toBe('stamina')
  })
})

describe('rerollQuest', () => {
  it('returns a quest with a different id', () => {
    const quests = generateDailyQuests('knight')
    const original = quests[0]
    const rerolled = rerollQuest(original, quests)
    expect(rerolled.id).not.toBe(original.id)
  })

  it('returns a quest with the same tier', () => {
    const quests = generateDailyQuests('knight')
    const original = quests[0]
    const rerolled = rerollQuest(original, quests)
    expect(rerolled.tier).toBe(original.tier)
  })

  it('returns a quest not already in active list', () => {
    const quests = generateDailyQuests('knight')
    const original = quests[0]
    const rerolled = rerollQuest(original, quests)
    const activeIds = quests.map(q => q.id)
    expect(activeIds).not.toContain(rerolled.id)
  })
})

describe('createCustomQuest', () => {
  it('creates a quest with isCustom=true', () => {
    const q = createCustomQuest('Run a mile', 'Go for a run.', 'health', 'daily')
    expect(q.isCustom).toBe(true)
  })

  it('creates with correct stat and tier', () => {
    const q = createCustomQuest('Study', 'Read a chapter.', 'mana', 'weekly')
    expect(q.stat).toBe('mana')
    expect(q.tier).toBe('weekly')
  })

  it('title is capped at 80 characters', () => {
    const longTitle = 'A'.repeat(100)
    const q = createCustomQuest(longTitle, 'desc', 'stamina', 'daily')
    expect(q.title.length).toBeLessThanOrEqual(80)
  })

  it('description is capped at 280 characters', () => {
    const longDesc = 'B'.repeat(400)
    const q = createCustomQuest('Title', longDesc, 'health', 'monthly')
    expect(q.description.length).toBeLessThanOrEqual(280)
  })

  it('has completed=false', () => {
    const q = createCustomQuest('Title', 'Desc', 'mana', 'daily')
    expect(q.completed).toBe(false)
  })
})
