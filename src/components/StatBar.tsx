'use client'

import type { Stat, PlayerClass } from '@/types'
import { getBarConfig, getBarPercent, getBarWidthClass, isPreferredStat } from '@/lib/barPoints'

interface Props {
  stat: Stat
  playerClass: PlayerClass
  monthlyPoints: number
  careerPoints: number
}

const STAT_COLORS: Record<Stat, string> = {
  health: 'bg-rose-500',
  stamina: 'bg-emerald-500',
  mana: 'bg-violet-500',
}

const STAT_LABELS: Record<Stat, string> = {
  health: 'Health',
  stamina: 'Stamina',
  mana: 'Mana',
}

const STAT_ICONS: Record<Stat, string> = {
  health: '❤️',
  stamina: '⚡',
  mana: '🔮',
}

export default function StatBar({ stat, playerClass, monthlyPoints, careerPoints }: Props) {
  const { fillAt, max } = getBarConfig(playerClass, stat)
  const percent = getBarPercent(monthlyPoints, fillAt)
  const widthClass = getBarWidthClass(playerClass, stat)
  const preferred = isPreferredStat(playerClass, stat)
  const isFull = monthlyPoints >= fillAt

  return (
    <div className={`${widthClass} transition-all`}>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{STAT_ICONS[stat]}</span>
          <span className={`text-sm font-semibold ${preferred ? 'text-white' : 'text-gray-400'}`}>
            {STAT_LABELS[stat]}
          </span>
          {preferred && (
            <span className="rounded-md bg-violet-800/60 px-1.5 py-0.5 text-[10px] text-violet-300">
              PRIMARY
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {monthlyPoints}/{max} pts
        </span>
      </div>

      <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${STAT_COLORS[stat]} ${isFull ? 'opacity-100' : 'opacity-80'}`}
          style={{ width: `${percent}%` }}
        />
        {isFull && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white drop-shadow">FULL</span>
          </div>
        )}
      </div>

      <div className="mt-1 text-right text-[10px] text-gray-600">
        {careerPoints} career pts
      </div>
    </div>
  )
}
