'use client'

interface Props {
  onNext: () => void
  onBack: () => void
}

export default function OnboardingStep4Explain({ onNext, onBack }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="text-2xl font-bold text-white">How It Works</h2>
      <div className="flex flex-col gap-4 w-full max-w-sm text-left">
        <div className="rounded-xl bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">☀️</span>
            <span className="font-bold text-white">Daily Quests</span>
          </div>
          <p className="text-sm text-gray-400">4 new quests every day. Complete them to earn XP and fill your stat bars. Reset at midnight.</p>
        </div>
        <div className="rounded-xl bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">📅</span>
            <span className="font-bold text-white">Weekly Quests</span>
          </div>
          <p className="text-sm text-gray-400">3 bigger quests each week — one for each stat. More XP, more bar points.</p>
        </div>
        <div className="rounded-xl bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🏆</span>
            <span className="font-bold text-white">Monthly Challenge</span>
          </div>
          <p className="text-sm text-gray-400">One big challenge aligned to your class stat. Completing it is the key to filling your primary bar.</p>
        </div>
        <div className="rounded-xl bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">💤</span>
            <span className="font-bold text-white">Sleep Buff</span>
          </div>
          <p className="text-sm text-gray-400">If you slept 6–8 hours, confirm it each morning for +20% XP on all quests that day.</p>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-700 px-6 py-2 text-gray-400 hover:border-gray-500 hover:text-white transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="rounded-xl bg-violet-600 px-8 py-3 font-bold text-white transition hover:bg-violet-500 active:scale-95"
        >
          Let&apos;s Go!
        </button>
      </div>
    </div>
  )
}
