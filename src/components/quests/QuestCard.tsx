'use client'

import type { Quest, QuestTier } from '@/types'
import { useStore } from '@/store'

interface Props {
  quest: Quest
  tier: QuestTier
  onAddCustom?: () => void
}

const STAT_COLORS: Record<string, string> = {
  health: 'border-rose-800/50 bg-rose-950/20',
  stamina: 'border-emerald-800/50 bg-emerald-950/20',
  mana: 'border-violet-800/50 bg-violet-950/20',
}

const STAT_BADGE: Record<string, string> = {
  health: 'bg-rose-900/60 text-rose-300',
  stamina: 'bg-emerald-900/60 text-emerald-300',
  mana: 'bg-violet-900/60 text-violet-300',
}

const STAT_ICONS: Record<string, string> = {
  health: '❤️',
  stamina: '⚡',
  mana: '🔮',
}

export default function QuestCard({ quest, tier }: Props) {
  const completeQuest = useStore(s => s.completeQuest)
  const uncompleteQuest = useStore(s => s.uncompleteQuest)
  const rerollQuestById = useStore(s => s.rerollQuestById)

  function handleToggle() {
    if (quest.completed) {
      uncompleteQuest(quest.id, tier)
    } else {
      completeQuest(quest.id, tier)
    }
  }

  return (
    <div
      className={`rounded-xl border p-4 transition ${
        quest.completed
          ? 'border-gray-700/50 bg-gray-800/20 opacity-50'
          : STAT_COLORS[quest.stat]
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`group mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 transition ${
            quest.completed
              ? 'border-gray-600 bg-gray-600 hover:border-red-500 hover:bg-red-900/30'
              : 'border-gray-500 hover:border-white hover:bg-white/10'
          }`}
        >
          {quest.completed && (
            <>
              <span className="flex h-full w-full items-center justify-center text-[10px] text-white group-hover:hidden">
                ✓
              </span>
              <span className="hidden h-full w-full items-center justify-center text-[10px] text-red-400 group-hover:flex">
                ✕
              </span>
            </>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${STAT_BADGE[quest.stat]}`}>
              {STAT_ICONS[quest.stat]} {quest.stat}
            </span>
            <span className="text-[10px] text-gray-500">+{quest.barPoints} bar pts · +{quest.xpValue} XP</span>
            {quest.isCustom && (
              <span className="rounded-md bg-yellow-900/40 px-1.5 py-0.5 text-[10px] text-yellow-400">
                custom
              </span>
            )}
          </div>
          <p className={`font-semibold leading-tight ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
            {quest.title}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 leading-snug">{quest.description}</p>
        </div>

        {!quest.completed && !quest.isCustom && (
          <button
            onClick={() => rerollQuestById(quest.id, tier)}
            title="Reroll this quest"
            className="shrink-0 rounded-lg p-1.5 text-gray-600 hover:bg-gray-700 hover:text-gray-300 transition"
          >
            🎲
          </button>
        )}
      </div>
    </div>
  )
}
