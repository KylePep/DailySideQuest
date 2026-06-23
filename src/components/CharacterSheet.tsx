'use client'

import { useStore } from '@/store'
import { getAvatar } from '@/lib/avatars'
import { xpToNextLevel } from '@/lib/xp'
import StatBar from '@/components/StatBar'
import { isPreferredStat } from '@/lib/barPoints'
import type { Stat } from '@/types'

const STATS: Stat[] = ['health', 'stamina', 'mana']

const CLASS_NAMES: Record<string, string> = {
  knight: 'Knight',
  wizard: 'Wizard',
  bard: 'Bard',
}

const MODE_LABELS: Record<string, string> = {
  fun: '🎮 Fun',
  medium: '⚖️ Medium',
  hard: '💀 Hard',
}

const MODE_COLORS: Record<string, string> = {
  fun: 'bg-amber-900/60 text-amber-300',
  medium: 'bg-violet-900/60 text-violet-300',
  hard: 'bg-slate-800 text-slate-300',
}

export default function CharacterSheet() {
  const player = useStore(s => s.player)
  const monthlyBar = useStore(s => s.monthlyBar)
  const sleepBuff = useStore(s => s.sleepBuff)

  if (!player) return null

  const playerMode = player.mode ?? 'hard'
  const avatar = getAvatar(player.avatarId)
  const xpNeeded = xpToNextLevel(player.level)
  const xpPercent = Math.min(100, Math.round((player.xp / xpNeeded) * 100))

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">
      <div className="flex items-center gap-4 mb-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-800 text-violet-400">
          {avatar.svg}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white truncate">{player.name}</h2>
            {sleepBuff.active && (
              <span className="shrink-0 rounded-md bg-blue-900/60 px-2 py-0.5 text-xs text-blue-300">
                💤 +20% XP
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400">
              {CLASS_NAMES[player.playerClass]} · Level {player.level}
            </span>
            <span className={`rounded-md px-2 py-0.5 text-xs ${MODE_COLORS[playerMode]}`}>
              {MODE_LABELS[playerMode]}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-1 flex justify-between text-xs text-gray-500">
        <span>XP</span>
        <span>{player.xp} / {xpNeeded}</span>
      </div>
      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${xpPercent}%` }}
        />
      </div>

      <div className="flex flex-col gap-3 items-start w-full">
        {[...STATS].sort((a, b) => +isPreferredStat(player.playerClass, b) - +isPreferredStat(player.playerClass, a)).map(stat => (
          <StatBar
            key={stat}
            stat={stat}
            playerClass={player.playerClass}
            monthlyPoints={monthlyBar[stat]}
            careerPoints={player.careerStats[stat]}
          />
        ))}
      </div>
    </div>
  )
}
