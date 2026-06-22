# Quest Uncomplete Design

**Date:** 2026-06-22
**Status:** Approved

## Problem

Completed quests cannot be unmarked. An accidental click permanently awards XP, bar points, and career stats with no recourse.

## Approach

Store the actual XP awarded (`xpGained`) on the quest at completion time. Use that stored value to precisely reverse all side effects when uncompleting. This is order-independent — any quest can be uncompleted in any order without corrupting state.

## Data Model

`src/types/index.ts` — add one optional field to `Quest`:

```ts
xpGained?: number  // actual XP awarded (post-sleep-buff); undefined when not yet completed
```

## XP Reversal

`src/lib/xp.ts` — add `reverseXpGain`:

```ts
function reverseXpGain(
  currentXp: number,
  currentLevel: number,
  gainedXp: number
): { xp: number; level: number }
```

Subtracts `gainedXp` from `currentXp`, decrementing level and restoring the level's XP threshold while XP is negative. Floors at `{ xp: 0, level: 1 }`.

## Store

`src/store/index.ts`

**Update `completeQuest`:** after computing `gainedXp` (= `applySleepBuff(rawXp, sleepActive)`), store it on the quest object alongside `completed: true` and `completedAt`.

**Add `uncompleteQuest(questId, tier)`:**
1. Find the quest; guard: return early if not found or not completed.
2. Call `reverseXpGain(player.xp, player.level, quest.xpGained)` to get new XP and level.
3. Subtract `quest.barPoints` from `monthlyBar[quest.stat]` and `player.careerStats[quest.stat]`, flooring each at 0.
4. Mark quest: `completed: false`, `completedAt: null`, `xpGained: undefined`.
5. If `pendingLevelUp` is set and the new level is below `pendingLevelUp`, clear `pendingLevelUp` to null.

Add `uncompleteQuest` to the `AppState` interface.

## UI

`src/components/quests/QuestCard.tsx`

- Remove `disabled={quest.completed}` from the circle button.
- Read `uncompleteQuest` from the store alongside `completeQuest`.
- Button `onClick`: when `quest.completed`, call `uncompleteQuest(quest.id, tier)`; otherwise call `completeQuest(quest.id, tier)`.
- Completed button hover state: swap `✓` for `✕` on hover using a CSS group-hover pattern; border and background shift to `hover:border-red-500 hover:bg-red-900/30`.
- No confirmation dialog — the action is immediately reversible in either direction.

## Edge Cases

- **Multiple uncompletes:** Subtracting stored `xpGained` is additive/subtractive, so uncompleting A then B (or B then A) produces identical final state.
- **Level floor:** `reverseXpGain` never produces level < 1 or xp < 0.
- **Bar floor:** Monthly bar and career stats clamp at 0 to prevent negative values from rounding errors.
- **pendingLevelUp:** Cleared if the post-uncomplete level drops below the pending level notification value.
- **Sleep buff:** Not re-evaluated on uncomplete — the stored `xpGained` already reflects whatever buff was active at completion time.

## Out of Scope

- Undo history / multi-step undo
- Confirmation dialog
- Preventing uncomplete on monthly quests (all tiers are treated identically)
