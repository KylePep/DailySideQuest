export function xpToNextLevel(level: number): number {
  let cost = 100
  for (let i = 1; i < level; i++) {
    cost = Math.round(cost * 1.01)
  }
  return cost
}

export function applySleepBuff(xp: number, sleepBuffActive: boolean): number {
  if (!sleepBuffActive) return xp
  return Math.floor(xp * 1.2)
}

export function applyXpGain(
  currentXp: number,
  currentLevel: number,
  gainedXp: number
): { xp: number; level: number } {
  let xp = currentXp + gainedXp
  let level = currentLevel

  while (xp >= xpToNextLevel(level)) {
    xp -= xpToNextLevel(level)
    level++
  }

  return { xp, level }
}
