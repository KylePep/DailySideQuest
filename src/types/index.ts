export type Stat = 'health' | 'stamina' | 'mana'

export type PlayerClass = 'knight' | 'wizard' | 'bard'

export type QuestTier = 'daily' | 'weekly' | 'monthly'

export interface QuestTemplate {
  id: string
  title: string
  description: string
  stat: Stat
  tier: QuestTier
  barPoints: number
  xpValue: number
}

export interface Quest {
  id: string
  templateId: string
  title: string
  description: string
  stat: Stat
  tier: QuestTier
  barPoints: number
  xpValue: number
  completed: boolean
  completedAt: string | null
  xpGained: number | undefined
  isCustom: boolean
}

export interface PlayerStats {
  health: number
  stamina: number
  mana: number
}

export interface Player {
  name: string
  avatarId: string
  playerClass: PlayerClass
  level: number
  xp: number
  careerStats: PlayerStats
}

export interface MonthlyBar {
  month: string
  health: number
  stamina: number
  mana: number
}

export interface SleepBuff {
  active: boolean
  checkedInDate: string | null
}

export interface Onboarding {
  completed: boolean
  step: number
}

export interface Resets {
  lastDay: string | null
  lastWeek: string | null
  lastMonth: string | null
}

export interface AvatarDefinition {
  id: string
  name: string
  svg: React.ReactNode
}
