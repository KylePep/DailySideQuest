import type { Stat, PlayerClass } from '@/types'

export const DAILY_BAR_PTS = 1
export const WEEKLY_BAR_PTS = 4
export const MONTHLY_BAR_PTS = 14

const CLASS_PRIMARY: Record<PlayerClass, Stat> = {
  knight: 'health',
  wizard: 'mana',
  bard: 'stamina',
}

export function isPreferredStat(playerClass: PlayerClass, stat: Stat): boolean {
  return CLASS_PRIMARY[playerClass] === stat
}

export function getBarConfig(
  playerClass: PlayerClass,
  stat: Stat
): { fillAt: number; max: number } {
  if (isPreferredStat(playerClass, stat)) {
    return { fillAt: 70, max: 90 }
  }
  return { fillAt: 40, max: 46 }
}

export function getBarPercent(points: number, fillAt: number): number {
  if (fillAt === 0) return 0
  return Math.min(100, Math.round((points / fillAt) * 100))
}

export function getBarWidthClass(playerClass: PlayerClass, stat: Stat): string {
  return isPreferredStat(playerClass, stat) ? 'w-full' : 'w-2/3'
}
