'use client'

import CharacterSheet from '@/components/CharacterSheet'
import DailyQuestList from '@/components/quests/DailyQuestList'
import WeeklyQuestList from '@/components/quests/WeeklyQuestList'
import MonthlyQuestCard from '@/components/quests/MonthlyQuestCard'
import LevelUpBanner from '@/components/LevelUpBanner'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6">
      <div className="mx-auto max-w-lg flex flex-col gap-6">
        <CharacterSheet />
        <DailyQuestList />
        <WeeklyQuestList />
        <MonthlyQuestCard />
      </div>
      <LevelUpBanner />
    </div>
  )
}
