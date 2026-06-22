'use client'

import { useStore } from '@/store'

export default function LevelUpBanner() {
  const pendingLevelUp = useStore(s => s.pendingLevelUp)
  const dismissLevelUp = useStore(s => s.dismissLevelUp)

  if (!pendingLevelUp) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 max-w-sm rounded-2xl border border-yellow-400/40 bg-gray-900 p-8 text-center shadow-2xl">
        <div className="mb-4 text-6xl">⚔️</div>
        <h2 className="mb-2 text-3xl font-bold text-yellow-400">Level Up!</h2>
        <p className="mb-6 text-xl text-gray-300">
          You reached <span className="font-bold text-white">Level {pendingLevelUp}</span>
        </p>
        <button
          onClick={dismissLevelUp}
          className="rounded-xl bg-yellow-500 px-8 py-3 font-bold text-gray-900 transition hover:bg-yellow-400 active:scale-95"
        >
          Onward!
        </button>
      </div>
    </div>
  )
}
