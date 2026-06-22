'use client'

import { useState } from 'react'

interface Props {
  onNext: (name: string) => void
}

export default function OnboardingStep1Name({ onNext }: Props) {
  const [name, setName] = useState('')

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="text-5xl">⚔️</div>
      <h1 className="text-3xl font-bold text-white">Welcome to SideQuest</h1>
      <p className="max-w-xs text-gray-400">
        Your life is the adventure. Daily habits are your quests. What is your name, hero?
      </p>
      <input
        type="text"
        maxLength={30}
        placeholder="Enter your name..."
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full max-w-xs rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-center text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none"
      />
      <button
        disabled={!name.trim()}
        onClick={() => onNext(name.trim())}
        className="rounded-xl bg-violet-600 px-8 py-3 font-bold text-white transition hover:bg-violet-500 disabled:opacity-40 active:scale-95"
      >
        Continue
      </button>
    </div>
  )
}
