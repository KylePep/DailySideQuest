# Quest Uncomplete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow players to uncomplete any completed quest, reversing XP, level, bar points, and career stats.

**Architecture:** Store the actual XP awarded (`xpGained`) on the Quest at completion time. A new `reverseXpGain` function mirrors `applyXpGain` to subtract XP and de-level. A new `uncompleteQuest` store action undoes all side effects. `QuestCard` toggles between complete/uncomplete on each click.

**Tech Stack:** TypeScript, React, Zustand (persist middleware), Next.js, Tailwind CSS, Jest

## Global Constraints

- No new dependencies
- All monetary values (XP, bar points, career stats) floor at 0 — never go negative
- Level floors at 1 — never goes below 1
- `xpGained` on Quest is the post-sleep-buff actual XP, not the template `xpValue`
- Follow Zustand `set`/`get` patterns already in `src/store/index.ts`

---

## File Map

| File | Change |
|------|--------|
| `src/types/index.ts` | Add `xpGained?: number` to `Quest` |
| `src/lib/xp.ts` | Add `reverseXpGain` export |
| `src/lib/__tests__/xp.test.ts` | Add tests for `reverseXpGain` |
| `src/store/index.ts` | Add `uncompleteQuest` to interface + implementation; update `completeQuest` to store `xpGained` |
| `src/components/quests/QuestCard.tsx` | Wire uncomplete toggle with hover state |

---

### Task 1: `reverseXpGain` function + Quest type field

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/lib/xp.ts`
- Modify: `src/lib/__tests__/xp.test.ts`

**Interfaces:**
- Produces: `reverseXpGain(currentXp: number, currentLevel: number, gainedXp: number): { xp: number; level: number }` — used by Task 2
- Produces: `Quest.xpGained?: number` field — used by Tasks 2 and 3

- [ ] **Step 1: Add `xpGained` to the Quest type**

In `src/types/index.ts`, add the field to `Quest` after `completedAt`:

```ts
export interface Quest {
  id: string
  templateId: string
  title: string
  description: string
  stat: Stat
  tier: QuestTier
  barPoints: number
  xpValue: number
  completed: boolean
  completedAt: string | null
  xpGained: number | undefined   // actual XP awarded (post-sleep-buff); undefined when incomplete
  isCustom: boolean
}
```

- [ ] **Step 2: Write the failing tests for `reverseXpGain`**

In `src/lib/__tests__/xp.test.ts`, add after the existing `applyXpGain` describe block:

```ts
import { xpToNextLevel, applySleepBuff, applyXpGain, reverseXpGain } from '@/lib/xp'

// (add this describe block at the bottom of the file)
describe('reverseXpGain', () => {
  it('subtracts xp without changing level when result stays positive', () => {
    const result = reverseXpGain(80, 1, 30)
    expect(result.xp).toBe(50)
    expect(result.level).toBe(1)
  })

  it('de-levels and restores xp when subtraction goes negative', () => {
    // at level 2 with 5 xp, undo 50 xp → xp goes to -45, de-level to 1
    // level 1 threshold = 100, so restored xp = 100 - 45 = 55
    const result = reverseXpGain(5, 2, 50)
    expect(result.level).toBe(1)
    expect(result.xp).toBe(xpToNextLevel(1) - 45)
  })

  it('floors at level 1 and xp 0 when gainedXp exceeds all accumulated xp', () => {
    const result = reverseXpGain(0, 1, 999)
    expect(result.level).toBe(1)
    expect(result.xp).toBe(0)
  })

  it('can de-level multiple times', () => {
    // get player to level 3 first, then undo all that xp
    const atLevel3 = applyXpGain(0, 1, 300)
    const reversed = reverseXpGain(atLevel3.xp, atLevel3.level, 300)
    expect(reversed.level).toBe(1)
    expect(reversed.xp).toBe(0)
  })
})
```

- [ ] **Step 3: Run to confirm tests fail**

```
npx jest xp.test --no-coverage
```

Expected: FAIL — `reverseXpGain is not a function`

- [ ] **Step 4: Implement `reverseXpGain` in `src/lib/xp.ts`**

Add after the existing `applyXpGain` function:

```ts
export function reverseXpGain(
  currentXp: number,
  currentLevel: number,
  gainedXp: number
): { xp: number; level: number } {
  let xp = currentXp - gainedXp
  let level = currentLevel

  while (xp < 0 && level > 1) {
    level--
    xp += xpToNextLevel(level)
  }

  if (xp < 0) xp = 0

  return { xp, level }
}
```

- [ ] **Step 5: Run tests to confirm they pass**

```
npx jest xp.test --no-coverage
```

Expected: All `reverseXpGain` tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/lib/xp.ts src/lib/__tests__/xp.test.ts
git commit -m "feat: add xpGained to Quest type and reverseXpGain to xp lib"
```

---

### Task 2: Store — `completeQuest` update + `uncompleteQuest` action

**Files:**
- Modify: `src/store/index.ts`

**Interfaces:**
- Consumes: `reverseXpGain` from `src/lib/xp.ts` (added in Task 1)
- Consumes: `Quest.xpGained` field (added in Task 1)
- Produces: `uncompleteQuest(questId: string, tier: 'daily' | 'weekly' | 'monthly'): void` — used by Task 3

- [ ] **Step 1: Import `reverseXpGain` in the store**

In `src/store/index.ts`, update the import from `@/lib/xp`:

```ts
import { applyXpGain, applySleepBuff, reverseXpGain } from '@/lib/xp'
```

- [ ] **Step 2: Add `uncompleteQuest` to the `AppState` interface**

In `src/store/index.ts`, add to the `AppState` interface after `completeQuest`:

```ts
uncompleteQuest: (questId: string, tier: 'daily' | 'weekly' | 'monthly') => void
```

- [ ] **Step 3: Restructure `completeQuest` to store `xpGained` on the quest**

The original `completeQuest` finds the quest AND builds the updated arrays in one if/else block, then computes `gainedXp` afterward. We need `gainedXp` available when building the arrays, so split the logic: find first, compute XP, then build arrays.

Replace the entire `completeQuest` implementation with:

```ts
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
```

- [ ] **Step 4: Implement `uncompleteQuest` in the store**

Add the following action in the `create` callback, after the `completeQuest` implementation:

```ts
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
```

- [ ] **Step 5: Confirm TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/store/index.ts
git commit -m "feat: add uncompleteQuest store action and persist xpGained on completion"
```

---

### Task 3: QuestCard uncomplete toggle UI

**Files:**
- Modify: `src/components/quests/QuestCard.tsx`

**Interfaces:**
- Consumes: `uncompleteQuest(questId: string, tier: QuestTier): void` from store (Task 2)

- [ ] **Step 1: Read `uncompleteQuest` from the store and wire the button**

Replace the entire `QuestCard` component with:

```tsx
'use client'

import type { Quest, QuestTier } from '@/types'
import { useStore } from '@/store'

interface Props {
  quest: Quest
  tier: QuestTier
  onAddCustom?: () => void
}

const STAT_COLORS: Record<string, string> = {
  health: 'border-rose-800/50 bg-rose-950/20',
  stamina: 'border-emerald-800/50 bg-emerald-950/20',
  mana: 'border-violet-800/50 bg-violet-950/20',
}

const STAT_BADGE: Record<string, string> = {
  health: 'bg-rose-900/60 text-rose-300',
  stamina: 'bg-emerald-900/60 text-emerald-300',
  mana: 'bg-violet-900/60 text-violet-300',
}

const STAT_ICONS: Record<string, string> = {
  health: '❤️',
  stamina: '⚡',
  mana: '🔮',
}

export default function QuestCard({ quest, tier }: Props) {
  const completeQuest = useStore(s => s.completeQuest)
  const uncompleteQuest = useStore(s => s.uncompleteQuest)
  const rerollQuestById = useStore(s => s.rerollQuestById)

  function handleToggle() {
    if (quest.completed) {
      uncompleteQuest(quest.id, tier)
    } else {
      completeQuest(quest.id, tier)
    }
  }

  return (
    <div
      className={`rounded-xl border p-4 transition ${
        quest.completed
          ? 'border-gray-700/50 bg-gray-800/20 opacity-50'
          : STAT_COLORS[quest.stat]
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`group mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 transition ${
            quest.completed
              ? 'border-gray-600 bg-gray-600 hover:border-red-500 hover:bg-red-900/30'
              : 'border-gray-500 hover:border-white hover:bg-white/10'
          }`}
        >
          {quest.completed && (
            <>
              <span className="flex h-full w-full items-center justify-center text-[10px] text-white group-hover:hidden">
                ✓
              </span>
              <span className="hidden h-full w-full items-center justify-center text-[10px] text-red-400 group-hover:flex">
                ✕
              </span>
            </>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${STAT_BADGE[quest.stat]}`}>
              {STAT_ICONS[quest.stat]} {quest.stat}
            </span>
            <span className="text-[10px] text-gray-500">+{quest.barPoints} bar pts · +{quest.xpValue} XP</span>
            {quest.isCustom && (
              <span className="rounded-md bg-yellow-900/40 px-1.5 py-0.5 text-[10px] text-yellow-400">
                custom
              </span>
            )}
          </div>
          <p className={`font-semibold leading-tight ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
            {quest.title}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 leading-snug">{quest.description}</p>
        </div>

        {!quest.completed && !quest.isCustom && (
          <button
            onClick={() => rerollQuestById(quest.id, tier)}
            title="Reroll this quest"
            className="shrink-0 rounded-lg p-1.5 text-gray-600 hover:bg-gray-700 hover:text-gray-300 transition"
          >
            🎲
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Confirm TypeScript compiles**

```
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Run the full test suite**

```
npx jest --no-coverage
```

Expected: All tests pass

- [ ] **Step 4: Manual smoke test**

Start the dev server (`npm run dev`) and verify:
1. Complete a quest → `✓` appears, card dims
2. Hover completed quest circle → `✓` swaps to `✕`, border turns red
3. Click completed quest → quest returns to incomplete, XP decreases in CharacterSheet
4. If the completion caused a level-up, uncompleting de-levels the player
5. Complete the same quest again → XP returns to original value

- [ ] **Step 5: Commit**

```bash
git add src/components/quests/QuestCard.tsx
git commit -m "feat: add uncomplete toggle to QuestCard with hover undo state"
```
