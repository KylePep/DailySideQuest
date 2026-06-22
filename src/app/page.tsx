'use client'

import { useEffect } from 'react'
import { useStore } from '@/store'
import ClientOnly from '@/components/ClientOnly'
import Onboarding from '@/components/onboarding/Onboarding'
import Dashboard from '@/components/Dashboard'
import SleepCheckInModal from '@/components/modals/SleepCheckInModal'
import { isSleepCheckInDue } from '@/lib/resets'

function App() {
  const onboarding = useStore(s => s.onboarding)
  const sleepBuff = useStore(s => s.sleepBuff)
  const checkAndApplyResets = useStore(s => s.checkAndApplyResets)

  useEffect(() => {
    useStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (onboarding.completed) {
      checkAndApplyResets()
    }
  }, [onboarding.completed, checkAndApplyResets])

  if (!onboarding.completed) {
    return <Onboarding />
  }

  const sleepDue = isSleepCheckInDue(sleepBuff.checkedInDate)

  return (
    <>
      <Dashboard />
      {sleepDue && <SleepCheckInModal />}
    </>
  )
}

export default function Page() {
  return (
    <ClientOnly>
      <App />
    </ClientOnly>
  )
}
