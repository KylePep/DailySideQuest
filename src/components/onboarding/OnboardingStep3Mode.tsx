'use client'

import { useState } from 'react'
import type { QuestMode } from '@/types'

interface Props {
  onNext: (mode: QuestMode) => void
  onBack: () => void
}

const MODES: { id: QuestMode; emoji: string; name: string; description: string }[] = [
  {
    id: 'fun',
    emoji: '🎮',
    name: 'Fun',
    description: 'Quests that feel genuinely rewarding and enjoyable. Try a handstand. Host a game night. Build something for fun.',
  },
  {
    id: 'medium',
    emoji: '⚖️',
    name: 'Medium',
    description: 'A mix of fun and serious quests. Keep things interesting without going full grind.',
  },
  {
    id: 'hard',
    emoji: '💀',
    name: 'Hard',
    description: 'Disciplined self-improvement. No-alcohol weeks, meal prep, inbox zero.',
  },
]

export default function OnboardingStep3Mode({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<QuestMode>('hard')

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="text-2xl font-bold text-white">Choose Your Mode</h2>
      <p className="max-w-xs text-gray-400">This determines the flavor of quests you receive. You can change it any time.</p>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => setSelected(mode.id)}
            className={`rounded-xl p-4 text-left transition ${
              selected === mode.id
                ? 'bg-violet-600 ring-2 ring-violet-400'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{mode.emoji}</span>
              <span className="font-bold text-white">{mode.name}</span>
            </div>
            <p className="text-sm text-gray-300">{mode.description}</p>
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-700 px-6 py-2 text-gray-400 hover:border-gray-500 hover:text-white transition"
        >
          Back
        </button>
        <button
          onClick={() => onNext(selected)}
          className="rounded-xl bg-violet-600 px-8 py-3 font-bold text-white transition hover:bg-violet-500 active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
