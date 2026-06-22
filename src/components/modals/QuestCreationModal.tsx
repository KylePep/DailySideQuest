'use client'

import { useState } from 'react'
import type { Stat, QuestTier } from '@/types'
import { useStore } from '@/store'

interface Props {
  tier: QuestTier
  onClose: () => void
}

const STATS: { value: Stat; label: string; icon: string }[] = [
  { value: 'health', label: 'Health', icon: '❤️' },
  { value: 'stamina', label: 'Stamina', icon: '⚡' },
  { value: 'mana', label: 'Mana', icon: '🔮' },
]

export default function QuestCreationModal({ tier, onClose }: Props) {
  const addCustomQuest = useStore(s => s.addCustomQuest)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stat, setStat] = useState<Stat>('health')

  function handleSubmit() {
    if (!title.trim()) return
    addCustomQuest(title.trim(), description.trim(), stat, tier)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white capitalize">New {tier} Quest</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Title (max 80 chars)</label>
            <input
              type="text"
              maxLength={80}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Quest title..."
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none text-sm"
            />
            <p className="mt-1 text-right text-[10px] text-gray-600">{title.length}/80</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Description (max 280 chars)</label>
            <textarea
              maxLength={280}
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What does completing this quest look like?"
              className="w-full resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none text-sm"
            />
            <p className="mt-1 text-right text-[10px] text-gray-600">{description.length}/280</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">Stat</label>
            <div className="flex gap-2">
              {STATS.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStat(s.value)}
                  className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
                    stat === s.value
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-700 py-2.5 text-sm text-gray-400 hover:border-gray-500 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              disabled={!title.trim()}
              onClick={handleSubmit}
              className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500 disabled:opacity-40 active:scale-95"
            >
              Add Quest
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
