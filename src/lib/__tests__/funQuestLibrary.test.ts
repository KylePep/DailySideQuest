import { FUN_QUEST_LIBRARY, getFunTemplatesByStatAndTier } from '@/lib/funQuestLibrary'
import { QUEST_LIBRARY } from '@/lib/questLibrary'

describe('FUN_QUEST_LIBRARY', () => {
  it('all IDs start with f', () => {
    FUN_QUEST_LIBRARY.forEach(t => expect(t.id.startsWith('f')).toBe(true))
  })

  it('no ID collisions with hard library', () => {
    const hardIds = new Set(QUEST_LIBRARY.map(t => t.id))
    FUN_QUEST_LIBRARY.forEach(t => expect(hardIds.has(t.id)).toBe(false))
  })

  it('hard library IDs never start with f (pool detection invariant)', () => {
    QUEST_LIBRARY.forEach(t => expect(t.id.startsWith('f')).toBe(false))
  })

  it('all entries have required fields', () => {
    FUN_QUEST_LIBRARY.forEach(t => {
      expect(t.id).toBeTruthy()
      expect(t.title).toBeTruthy()
      expect(t.description).toBeTruthy()
      expect(['health', 'stamina', 'mana']).toContain(t.stat)
      expect(['daily', 'weekly', 'monthly']).toContain(t.tier)
    })
  })
})

describe('getFunTemplatesByStatAndTier', () => {
  it('returns 15 health daily templates', () => {
    expect(getFunTemplatesByStatAndTier('health', 'daily')).toHaveLength(15)
  })

  it('returns 15 stamina daily templates', () => {
    expect(getFunTemplatesByStatAndTier('stamina', 'daily')).toHaveLength(15)
  })

  it('returns 15 mana daily templates', () => {
    expect(getFunTemplatesByStatAndTier('mana', 'daily')).toHaveLength(15)
  })

  it('returns 10 health weekly templates', () => {
    expect(getFunTemplatesByStatAndTier('health', 'weekly')).toHaveLength(10)
  })

  it('returns 10 stamina weekly templates', () => {
    expect(getFunTemplatesByStatAndTier('stamina', 'weekly')).toHaveLength(10)
  })

  it('returns 10 mana weekly templates', () => {
    expect(getFunTemplatesByStatAndTier('mana', 'weekly')).toHaveLength(10)
  })

  it('returns 8 health monthly templates', () => {
    expect(getFunTemplatesByStatAndTier('health', 'monthly')).toHaveLength(8)
  })

  it('returns 8 stamina monthly templates', () => {
    expect(getFunTemplatesByStatAndTier('stamina', 'monthly')).toHaveLength(8)
  })

  it('returns 8 mana monthly templates', () => {
    expect(getFunTemplatesByStatAndTier('mana', 'monthly')).toHaveLength(8)
  })
})
