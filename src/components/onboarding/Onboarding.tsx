'use client'

import { useState } from 'react'
import type { PlayerClass, Player } from '@/types'
import { useStore } from '@/store'
import OnboardingStep1Name from './OnboardingStep1Name'
import OnboardingStep2Avatar from './OnboardingStep2Avatar'
import OnboardingStep3Class from './OnboardingStep3Class'
import OnboardingStep4Explain from './OnboardingStep4Explain'

export default function Onboarding() {
  const completeOnboarding = useStore(s => s.completeOnboarding)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [avatarId, setAvatarId] = useState('shield')
  const [playerClass, setPlayerClass] = useState<PlayerClass>('knight')

  function finish() {
    const player: Player = {
      name,
      avatarId,
      playerClass,
      level: 1,
      xp: 0,
      careerStats: { health: 0, stamina: 0, mana: 0 },
    }
    completeOnboarding(player)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        <div className="mb-6 flex gap-1 justify-center">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-violet-500' : 'bg-gray-700'}`}
            />
          ))}
        </div>

        {step === 0 && (
          <OnboardingStep1Name
            onNext={n => {
              setName(n)
              setStep(1)
            }}
          />
        )}
        {step === 1 && (
          <OnboardingStep2Avatar
            onNext={id => {
              setAvatarId(id)
              setStep(2)
            }}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <OnboardingStep3Class
            onNext={cls => {
              setPlayerClass(cls)
              setStep(3)
            }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <OnboardingStep4Explain
            onNext={finish}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  )
}
