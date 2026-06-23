import { v4 as uuidv4 } from 'uuid'
import type { PlayerClass, Quest, QuestTemplate, Stat, QuestTier, QuestMode } from '@/types'
import { getTemplatesByStatAndTier, QUEST_LIBRARY } from '@/lib/questLibrary'
import { getFunTemplatesByStatAndTier, FUN_QUEST_LIBRARY } from '@/lib/funQuestLibrary'
import { DAILY_BAR_PTS, WEEKLY_BAR_PTS, MONTHLY_BAR_PTS } from '@/lib/barPoints'

const CLASS_PRIMARY: Record<PlayerClass, Stat> = {
  knight: 'health',
  wizard: 'mana',
  bard: 'stamina',
}

const ALL_STATS: Stat[] = ['health', 'stamina', 'mana']

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function templateToQuest(template: QuestTemplate): Quest {
  return {
    id: uuidv4(),
    templateId: template.id,
    title: template.title,
    description: template.description,
    stat: template.stat,
    tier: template.tier,
    barPoints: template.barPoints,
    xpValue: template.xpValue,
    completed: false,
    completedAt: null,
    isCustom: false,
    xpGained: undefined,
  }
}

function secondaryStat(primary: Stat): Stat {
  const others = ALL_STATS.filter(s => s !== primary)
  return pickRandom(others)
}

function getPool(mode: QuestMode, stat: Stat, tier: QuestTier): QuestTemplate[] {
  if (mode === 'fun') return getFunTemplatesByStatAndTier(stat, tier)
  if (mode === 'hard') return getTemplatesByStatAndTier(stat, tier)
  // medium: 50/50 coin flip per slot
  return Math.random() < 0.5
    ? getTemplatesByStatAndTier(stat, tier)
    : getFunTemplatesByStatAndTier(stat, tier)
}

export function generateDailyQuests(playerClass: PlayerClass, mode: QuestMode = 'hard'): Quest[] {
  const primary = CLASS_PRIMARY[playerClass]
  const secondary = secondaryStat(primary)
  const tertiary = ALL_STATS.find(s => s !== primary && s !== secondary)!

  const chosen: QuestTemplate[] = []

  const p1Pool = getPool(mode, primary, 'daily')
  const p1 = pickRandom(p1Pool)
  chosen.push(p1)

  const p2Pool = getPool(mode, primary, 'daily').filter(t => t.id !== p1.id)
  chosen.push(pickRandom(p2Pool))
  chosen.push(pickRandom(getPool(mode, secondary, 'daily')))
  chosen.push(pickRandom(getPool(mode, tertiary, 'daily')))

  return chosen.map(templateToQuest)
}

export function generateWeeklyQuests(playerClass: PlayerClass, mode: QuestMode = 'hard'): Quest[] {
  return ALL_STATS.map(stat => {
    const pool = getPool(mode, stat, 'weekly')
    return templateToQuest(pickRandom(pool))
  })
}

export function generateMonthlyQuest(playerClass: PlayerClass, mode: QuestMode = 'hard'): Quest {
  const primary = CLASS_PRIMARY[playerClass]
  const pool = getPool(mode, primary, 'monthly')
  return templateToQuest(pickRandom(pool))
}

export function rerollQuest(quest: Quest, activeQuests: Quest[]): Quest {
  const activeTemplateIds = new Set(activeQuests.map(q => q.templateId))
  const isFunQuest = quest.templateId.startsWith('f')
  const source = isFunQuest ? FUN_QUEST_LIBRARY : QUEST_LIBRARY

  const pool = source.filter(
    t => t.tier === quest.tier && t.stat === quest.stat && !activeTemplateIds.has(t.id)
  )

  if (pool.length === 0) {
    const fallback = source.filter(
      t => t.tier === quest.tier && t.stat === quest.stat && t.id !== quest.templateId
    )
    return templateToQuest(
      pickRandom(fallback.length > 0 ? fallback : source.filter(t => t.tier === quest.tier))
    )
  }

  return templateToQuest(pickRandom(pool))
}

export function createCustomQuest(
  title: string,
  description: string,
  stat: Stat,
  tier: QuestTier
): Quest {
  const barPointsMap: Record<QuestTier, number> = {
    daily: DAILY_BAR_PTS,
    weekly: WEEKLY_BAR_PTS,
    monthly: MONTHLY_BAR_PTS,
  }
  const xpMap: Record<QuestTier, number> = {
    daily: 10,
    weekly: 40,
    monthly: 140,
  }

  return {
    id: uuidv4(),
    templateId: `custom-${uuidv4()}`,
    title: title.slice(0, 80),
    description: description.slice(0, 280),
    stat,
    tier,
    barPoints: barPointsMap[tier],
    xpValue: xpMap[tier],
    completed: false,
    completedAt: null,
    isCustom: true,
    xpGained: undefined,
  }
}
