'use client'

import { useState } from 'react'
import { useStore } from '@/store'
import QuestCard from './QuestCard'
import QuestCreationModal from '@/components/modals/QuestCreationModal'

export default function WeeklyQuestList() {
  const weeklyQuests = useStore(s => s.weeklyQuests)
  const [showModal, setShowModal] = useState(false)

  const customCount = weeklyQuests.filter(q => q.isCustom).length
  const canAddCustom = customCount < 2

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Weekly Quests</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">
            {weeklyQuests.filter(q => q.completed).length}/{weeklyQuests.length}
          </span>
          {canAddCustom && (
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-gray-800 px-2.5 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white transition"
            >
              + Custom
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {weeklyQuests.map(quest => (
          <QuestCard key={quest.id} quest={quest} tier="weekly" />
        ))}
      </div>
      {showModal && (
        <QuestCreationModal tier="weekly" onClose={() => setShowModal(false)} />
      )}
    </section>
  )
}
