import { v4 as uuidv4 } from 'uuid'
import type { PlayerClass, Quest, QuestTemplate, Stat, QuestTier } from '@/types'
import { getTemplatesByStatAndTier, QUEST_LIBRARY } from '@/lib/questLibrary'
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
  }
}

function secondaryStat(primary: Stat): Stat {
  const others = ALL_STATS.filter(s => s !== primary)
  return pickRandom(others)
}

export function generateDailyQuests(playerClass: PlayerClass): Quest[] {
  const primary = CLASS_PRIMARY[playerClass]
  const secondary = secondaryStat(primary)
  const tertiary = ALL_STATS.find(s => s !== primary && s !== secondary)!

  const primaryPool = getTemplatesByStatAndTier(primary, 'daily')
  const secondaryPool = getTemplatesByStatAndTier(secondary, 'daily')
  const tertiaryPool = getTemplatesByStatAndTier(tertiary, 'daily')

  const chosen: QuestTemplate[] = []

  const p1 = pickRandom(primaryPool)
  chosen.push(p1)
  const p2 = pickRandom(primaryPool.filter(t => t.id !== p1.id))
  chosen.push(p2)
  chosen.push(pickRandom(secondaryPool))
  chosen.push(pickRandom(tertiaryPool))

  return chosen.map(templateToQuest)
}

export function generateWeeklyQuests(playerClass: PlayerClass): Quest[] {
  return ALL_STATS.map(stat => {
    const pool = getTemplatesByStatAndTier(stat, 'weekly')
    return templateToQuest(pickRandom(pool))
  })
}

export function generateMonthlyQuest(playerClass: PlayerClass): Quest {
  const primary = CLASS_PRIMARY[playerClass]
  const pool = getTemplatesByStatAndTier(primary, 'monthly')
  return templateToQuest(pickRandom(pool))
}

export function rerollQuest(quest: Quest, activeQuests: Quest[]): Quest {
  const activeTemplateIds = new Set(activeQuests.map(q => q.templateId))
  const pool = QUEST_LIBRARY.filter(
    t => t.tier === quest.tier && t.stat === quest.stat && !activeTemplateIds.has(t.id)
  )

  if (pool.length === 0) {
    const fallback = QUEST_LIBRARY.filter(
      t => t.tier === quest.tier && t.stat === quest.stat && t.id !== quest.templateId
    )
    return templateToQuest(pickRandom(fallback.length > 0 ? fallback : QUEST_LIBRARY.filter(t => t.tier === quest.tier)))
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
  }
}
