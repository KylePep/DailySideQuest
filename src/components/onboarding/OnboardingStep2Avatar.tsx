'use client'

import { useState } from 'react'
import { AVATARS } from '@/lib/avatars'

interface Props {
  onNext: (avatarId: string) => void
  onBack: () => void
}

export default function OnboardingStep2Avatar({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<string>(AVATARS[0].id)

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="text-2xl font-bold text-white">Choose Your Avatar</h2>
      <p className="max-w-xs text-gray-400">Pick the icon that represents you on your journey.</p>
      <div className="grid grid-cols-4 gap-3">
        {AVATARS.map(avatar => (
          <button
            key={avatar.id}
            onClick={() => setSelected(avatar.id)}
            title={avatar.name}
            className={`flex items-center justify-center rounded-xl p-3 transition ${
              selected === avatar.id
                ? 'bg-violet-600 text-white ring-2 ring-violet-400'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span className="h-10 w-10">{avatar.svg}</span>
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">{AVATARS.find(a => a.id === selected)?.name}</p>
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
