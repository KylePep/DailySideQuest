'use client'

import { useState } from 'react'
import type { PlayerClass } from '@/types'

interface Props {
  onNext: (playerClass: PlayerClass) => void
  onBack: () => void
}

const CLASSES: { id: PlayerClass; name: string; emoji: string; primary: string; description: string }[] = [
  {
    id: 'knight',
    name: 'Knight',
    emoji: '🛡️',
    primary: 'Health',
    description: 'Disciplined warriors who master their body. Health quests fill your bar faster and your Health bar is full-width.',
  },
  {
    id: 'wizard',
    name: 'Wizard',
    emoji: '🔮',
    primary: 'Mana',
    description: 'Seekers of knowledge and inner power. Mana quests fill your bar faster and your Mana bar is full-width.',
  },
  {
    id: 'bard',
    name: 'Bard',
    emoji: '🎵',
    primary: 'Stamina',
    description: 'Creative souls who outlast any challenge. Stamina quests fill your bar faster and your Stamina bar is full-width.',
  },
]

export default function OnboardingStep3Class({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<PlayerClass>('knight')

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="text-2xl font-bold text-white">Choose Your Class</h2>
      <p className="max-w-xs text-gray-400">Your class determines which stat you level fastest.</p>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {CLASSES.map(cls => (
          <button
            key={cls.id}
            onClick={() => setSelected(cls.id)}
            className={`rounded-xl p-4 text-left transition ${
              selected === cls.id
                ? 'bg-violet-600 ring-2 ring-violet-400'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{cls.emoji}</span>
              <span className="font-bold text-white">{cls.name}</span>
              <span className="ml-auto rounded-md bg-black/30 px-2 py-0.5 text-xs text-gray-300">
                Primary: {cls.primary}
              </span>
            </div>
            <p className="text-sm text-gray-300">{cls.description}</p>
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
