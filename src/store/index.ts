import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Player,
  PlayerClass,
  Quest,
  MonthlyBar,
  SleepBuff,
  Onboarding,
  Resets,
  Stat,
  QuestMode,
} from '@/types'
import {
  generateDailyQuests,
  generateWeeklyQuests,
  generateMonthlyQuest,
  rerollQuest,
  createCustomQuest,
} from '@/lib/questGeneration'
import { applyXpGain, applySleepBuff, reverseXpGain } from '@/lib/xp'
import { DAILY_BAR_PTS, WEEKLY_BAR_PTS, MONTHLY_BAR_PTS } from '@/lib/barPoints'
import { isNewDay, isNewWeek, isNewMonth, isSleepCheckInDue } from '@/lib/resets'

export interface AppState {
  player: Player | null
  dailyQuests: Quest[]
  weeklyQuests: Quest[]
  monthlyQuest: Quest | null
  monthlyBar: MonthlyBar
  sleepBuff: SleepBuff
  onboarding: Onboarding
  resets: Resets
  pendingLevelUp: number | null

  // Onboarding actions
  completeOnboarding: (player: Player) => void
  setOnboardingStep: (step: number) => void
  setPlayerMode: (mode: QuestMode) => void

  // Sleep buff actions
  acknowledgeSleep: (sleptWell: boolean) => void

  // Quest actions
  completeQuest: (questId: string, tier: 'daily' | 'weekly' | 'monthly') => void
  uncompleteQuest: (questId: string, tier: 'daily' | 'weekly' | 'monthly') => void
  rerollQuestById: (questId: string, tier: 'daily' | 'weekly' | 'monthly') => void
  addCustomQuest: (
    title: string,
    description: string,
    stat: Stat,
    tier: 'daily' | 'weekly' | 'monthly'
  ) => void

  // Reset/refresh actions
  checkAndApplyResets: () => void
  dismissLevelUp: () => void
}

function currentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}`
}

function emptyMonthlyBar(): MonthlyBar {
  return { month: currentMonthKey(), health: 0, stamina: 0, mana: 0 }
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      player: null,
      dailyQuests: [],
      weeklyQuests: [],
      monthlyQuest: null,
      monthlyBar: emptyMonthlyBar(),
      sleepBuff: { active: false, checkedInDate: null },
      onboarding: { completed: false, step: 0 },
      resets: { lastDay: null, lastWeek: null, lastMonth: null },
      pendingLevelUp: null,

      completeOnboarding: (player: Player) => {
        const playerClass = player.playerClass
        const mode = player.mode
        set({
          player,
          onboarding: { completed: true, step: 5 },
          dailyQuests: generateDailyQuests(playerClass, mode),
          weeklyQuests: generateWeeklyQuests(playerClass, mode),
          monthlyQuest: generateMonthlyQuest(playerClass, mode),
          monthlyBar: emptyMonthlyBar(),
          resets: {
            lastDay: new Date().toISOString(),
            lastWeek: new Date().toISOString(),
            lastMonth: new Date().toISOString(),
          },
        })
      },

      setOnboardingStep: (step: number) => {
        set(state => ({ onboarding: { ...state.onboarding, step } }))
      },

      setPlayerMode: (mode: QuestMode) => {
        // mode takes effect at next reset — does not immediately reroll the active board
        set(state => ({
          player: state.player ? { ...state.player, mode } : null,
        }))
      },

      acknowledgeSleep: (sleptWell: boolean) => {
        set({
          sleepBuff: {
            active: sleptWell,
            checkedInDate: new Date().toISOString(),
          },
        })
      },

      completeQuest: (questId: string, tier: 'daily' | 'weekly' | 'monthly') => {
        const state = get()
        if (!state.player) return

        const now = new Date().toISOString()
        const sleepActive = state.sleepBuff.active

        // Phase 1: find the quest
        let completedQuest: Quest | undefined
        if (tier === 'daily') {
          completedQuest = state.dailyQuests.find(q => q.id === questId)
        } else if (tier === 'weekly') {
          completedQuest = state.weeklyQuests.find(q => q.id === questId)
        } else if (tier === 'monthly' && state.monthlyQuest?.id === questId) {
          completedQuest = state.monthlyQuest
        }

        if (!completedQuest || completedQuest.completed) return

        // Phase 2: compute XP (gainedXp must be known before building arrays)
        const rawXp = completedQuest.xpValue
        const gainedXp = applySleepBuff(rawXp, sleepActive)
        const { xp: newXp, level: newLevel } = applyXpGain(
          state.player.xp,
          state.player.level,
          gainedXp
        )

        // Phase 3: build updated quest arrays with xpGained stored
        let updatedDaily = state.dailyQuests
        let updatedWeekly = state.weeklyQuests
        let updatedMonthly = state.monthlyQuest

        if (tier === 'daily') {
          updatedDaily = state.dailyQuests.map(q =>
            q.id === questId ? { ...q, completed: true, completedAt: now, xpGained: gainedXp } : q
          )
        } else if (tier === 'weekly') {
          updatedWeekly = state.weeklyQuests.map(q =>
            q.id === questId ? { ...q, completed: true, completedAt: now, xpGained: gainedXp } : q
          )
        } else {
          updatedMonthly = { ...completedQuest, completed: true, completedAt: now, xpGained: gainedXp }
        }

        const leveled = newLevel > state.player.level
        const barStat = completedQuest.stat as keyof Omit<MonthlyBar, 'month'>
        const updatedBar = {
          ...state.monthlyBar,
          [barStat]: state.monthlyBar[barStat] + completedQuest.barPoints,
        }

        set({
          dailyQuests: updatedDaily,
          weeklyQuests: updatedWeekly,
          monthlyQuest: updatedMonthly,
          monthlyBar: updatedBar,
          player: {
            ...state.player,
            xp: newXp,
            level: newLevel,
            careerStats: {
              ...state.player.careerStats,
              [barStat]: state.player.careerStats[barStat] + completedQuest.barPoints,
            },
          },
          pendingLevelUp: leveled ? newLevel : state.pendingLevelUp,
        })
      },

      uncompleteQuest: (questId: string, tier: 'daily' | 'weekly' | 'monthly') => {
        const state = get()
        if (!state.player) return

        let completedQuest: Quest | undefined
        let updatedDaily = state.dailyQuests
        let updatedWeekly = state.weeklyQuests
        let updatedMonthly = state.monthlyQuest

        if (tier === 'daily') {
          completedQuest = state.dailyQuests.find(q => q.id === questId)
          updatedDaily = state.dailyQuests.map(q =>
            q.id === questId
              ? { ...q, completed: false, completedAt: null, xpGained: undefined }
              : q
          )
        } else if (tier === 'weekly') {
          completedQuest = state.weeklyQuests.find(q => q.id === questId)
          updatedWeekly = state.weeklyQuests.map(q =>
            q.id === questId
              ? { ...q, completed: false, completedAt: null, xpGained: undefined }
              : q
          )
        } else if (tier === 'monthly' && state.monthlyQuest?.id === questId) {
          completedQuest = state.monthlyQuest
          updatedMonthly = {
            ...state.monthlyQuest,
            completed: false,
            completedAt: null,
            xpGained: undefined,
          }
        }

        if (!completedQuest || !completedQuest.completed) return

        const gainedXp = completedQuest.xpGained ?? 0
        const { xp: newXp, level: newLevel } = reverseXpGain(
          state.player.xp,
          state.player.level,
          gainedXp
        )

        const barStat = completedQuest.stat as keyof Omit<MonthlyBar, 'month'>

        set({
          dailyQuests: updatedDaily,
          weeklyQuests: updatedWeekly,
          monthlyQuest: updatedMonthly,
          monthlyBar: {
            ...state.monthlyBar,
            [barStat]: Math.max(0, state.monthlyBar[barStat] - completedQuest.barPoints),
          },
          player: {
            ...state.player,
            xp: newXp,
            level: newLevel,
            careerStats: {
              ...state.player.careerStats,
              [barStat]: Math.max(0, state.player.careerStats[barStat] - completedQuest.barPoints),
            },
          },
          pendingLevelUp:
            state.pendingLevelUp !== null && newLevel < state.pendingLevelUp
              ? null
              : state.pendingLevelUp,
        })
      },

      rerollQuestById: (questId: string, tier: 'daily' | 'weekly' | 'monthly') => {
        const state = get()
        if (!state.player) return

        const allActive = [...state.dailyQuests, ...state.weeklyQuests]
        if (state.monthlyQuest) allActive.push(state.monthlyQuest)

        if (tier === 'daily') {
          const quest = state.dailyQuests.find(q => q.id === questId)
          if (!quest || quest.completed) return
          const rerolled = rerollQuest(quest, allActive)
          set({ dailyQuests: state.dailyQuests.map(q => (q.id === questId ? rerolled : q)) })
        } else if (tier === 'weekly') {
          const quest = state.weeklyQuests.find(q => q.id === questId)
          if (!quest || quest.completed) return
          const rerolled = rerollQuest(quest, allActive)
          set({ weeklyQuests: state.weeklyQuests.map(q => (q.id === questId ? rerolled : q)) })
        } else if (tier === 'monthly' && state.monthlyQuest?.id === questId) {
          if (state.monthlyQuest.completed) return
          const rerolled = rerollQuest(state.monthlyQuest, allActive)
          set({ monthlyQuest: rerolled })
        }
      },

      addCustomQuest: (title, description, stat, tier) => {
        const state = get()
        const quest = createCustomQuest(title, description, stat, tier)
        if (tier === 'daily') {
          set({ dailyQuests: [...state.dailyQuests, quest] })
        } else if (tier === 'weekly') {
          set({ weeklyQuests: [...state.weeklyQuests, quest] })
        } else {
          set({ monthlyQuest: quest })
        }
      },

      checkAndApplyResets: () => {
        const state = get()
        if (!state.player) return

        const { resets } = state
        const playerClass = state.player.playerClass
        const mode = state.player.mode
        let updates: Partial<AppState> = {}

        if (isNewMonth(resets.lastMonth)) {
          updates = {
            ...updates,
            monthlyQuest: generateMonthlyQuest(playerClass, mode),
            monthlyBar: emptyMonthlyBar(),
            resets: {
              ...resets,
              lastMonth: new Date().toISOString(),
            },
          }
        }

        if (isNewWeek(resets.lastWeek)) {
          updates = {
            ...updates,
            weeklyQuests: generateWeeklyQuests(playerClass, mode),
            resets: {
              ...(updates.resets ?? resets),
              lastWeek: new Date().toISOString(),
            },
          }
        }

        if (isNewDay(resets.lastDay)) {
          updates = {
            ...updates,
            dailyQuests: generateDailyQuests(playerClass, mode),
            resets: {
              ...(updates.resets ?? resets),
              lastDay: new Date().toISOString(),
            },
          }
        }

        if (Object.keys(updates).length > 0) {
          set(updates as AppState)
        }
      },

      dismissLevelUp: () => set({ pendingLevelUp: null }),
    }),
    {
      name: 'sidequest',
      skipHydration: true,
    }
  )
)
