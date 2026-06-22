'use client'

import { useStore } from '@/store'

export default function SleepCheckInModal() {
  const acknowledgeSleep = useStore(s => s.acknowledgeSleep)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center shadow-2xl">
        <div className="mb-4 text-5xl">💤</div>
        <h2 className="mb-2 text-2xl font-bold text-white">Morning Check-In</h2>
        <p className="mb-6 text-gray-400">
          Did you sleep 6–8 hours last night? A good night&apos;s rest grants you{' '}
          <span className="font-semibold text-blue-400">+20% XP</span> on all quests today.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => acknowledgeSleep(true)}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-500 active:scale-95"
          >
            Yes, I slept well ✨
          </button>
          <button
            onClick={() => acknowledgeSleep(false)}
            className="w-full rounded-xl border border-gray-700 py-3 text-gray-400 transition hover:border-gray-500 hover:text-white"
          >
            No, not quite
          </button>
        </div>
      </div>
    </div>
  )
}
