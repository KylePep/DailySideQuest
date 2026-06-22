'use client'

import { useState } from 'react'
import { useStore } from '@/store'
import QuestCard from './QuestCard'
import QuestCreationModal from '@/components/modals/QuestCreationModal'

export default function MonthlyQuestCard() {
  const monthlyQuest = useStore(s => s.monthlyQuest)
  const [showModal, setShowModal] = useState(false)

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Monthly Challenge</h3>
        {!monthlyQuest && (
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-gray-800 px-2.5 py-1 text-xs text-gray-400 hover:bg-gray-700 hover:text-white transition"
          >
            + Custom
          </button>
        )}
      </div>
      {monthlyQuest ? (
        <QuestCard quest={monthlyQuest} tier="monthly" />
      ) : (
        <div className="rounded-xl border border-dashed border-gray-700 p-4 text-center text-sm text-gray-600">
          No monthly challenge set.
        </div>
      )}
      {showModal && (
        <QuestCreationModal tier="monthly" onClose={() => setShowModal(false)} />
      )}
    </section>
  )
}
