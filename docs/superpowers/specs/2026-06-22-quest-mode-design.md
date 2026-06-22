# Quest Mode — Design Spec

**Date:** 2026-06-22
**Status:** Approved

---

## Overview

Add a **quest mode** setting that determines the flavor of quests assigned to the player. Three modes: Fun, Medium, and Hard. Mode is chosen during onboarding and can be changed at any time post-onboarding, taking effect at the next reset cycle.

The current quest library is "hard" mode. A new "fun" quest library will be written with the same stat/tier structure but quests that feel genuinely enjoyable rather than disciplinary.

---

## Motivation

The existing quest library skews entirely toward self-discipline (no-alcohol weeks, inbox zero, meal prep). Not every player wants that. Fun mode provides quests that are intrinsically rewarding — things you actually want to do, mapped to the same three stats.

---

## Data Model

### New type

```ts
export type QuestMode = 'fun' | 'medium' | 'hard'
```

Add to `src/types/index.ts`.

### Player

```ts
export interface Player {
  name: string
  avatarId: string
  playerClass: PlayerClass
  mode: QuestMode          // NEW
  level: number
  xp: number
  careerStats: PlayerStats
}
```

No other type changes. `QuestTemplate` shape is unchanged — both libraries share it.

---

## Quest Libraries

### Hard pool — `src/lib/questLibrary.ts`

Unchanged. This is the existing library of disciplined self-improvement quests.

### Fun pool — `src/lib/funQuestLibrary.ts`

New file. Exports `FUN_QUEST_LIBRARY: QuestTemplate[]`.

Same approximate counts as the hard library:
- 15 daily templates per stat (45 total)
- 10 weekly templates per stat (30 total)
- 8 monthly templates per stat (24 total)

IDs are prefixed with `f` (e.g., `fhd01`, `fsd01`, `fmd01`) to guarantee no collisions with the hard pool. The `f` prefix is also used at reroll time to detect which pool a quest came from.

**Stat framing for fun quests:**

| Stat | Fun flavor |
|---|---|
| ❤️ Health | Physically playful activities — try a handstand, go for a swim, play a sport with friends, go on a bike ride |
| ⚡ Stamina | Social adventure — host a game night, explore a new neighborhood, go to a show, call someone you miss |
| 🔮 Mana | Creative curiosity — build a fun side project, read a novel you've been excited about, watch a documentary on something you're curious about, learn a magic trick |

---

## Quest Generation

`generateDailyQuests`, `generateWeeklyQuests`, and `generateMonthlyQuest` each gain a `mode: QuestMode` parameter.

| Mode | Pool |
|---|---|
| `'hard'` | Draw exclusively from `QUEST_LIBRARY` |
| `'fun'` | Draw exclusively from `FUN_QUEST_LIBRARY` |
| `'medium'` | Per quest slot, flip a coin (50/50) — draw from either pool |

For medium mode, each slot is decided independently. The exclusion check (no duplicate templates on the active board) applies within each pool separately.

### Reroll behavior

`rerollQuestById` reads `player.mode`. For medium mode, a rerolled quest stays in whatever pool its template ID came from (detected by `id.startsWith('f')`). Fun-pool quests reroll within the fun pool; hard-pool quests reroll within the hard pool.

### Callers that need updating

- `completeOnboarding` in the store — receives mode on the `Player` object, passes to all three generation calls
- `checkAndApplyResets` — reads `player.mode` for all regeneration calls
- `rerollQuestById` — reads `player.mode` and the quest's template ID prefix

---

## Onboarding

### Updated flow

```
0. Name → 1. Avatar → 2. Mode → 3. Class → 4. Explain → Dashboard
```

The progress bar in `Onboarding.tsx` updates from 4 segments to 5.

`Onboarding.tsx` gains a `mode` state variable defaulting to `'hard'`. It is collected at step 2 and passed into `finish()` as part of the `Player` object.

### New component: `OnboardingStep3Mode.tsx`

Three cards in the same visual style as the class selector:

| Mode | Emoji | Label | Description |
|---|---|---|---|
| `fun` | 🎮 | Fun | "Quests that feel genuinely rewarding and enjoyable. Try a handstand. Host a game night. Build something for fun." |
| `medium` | ⚖️ | Medium | "A mix of fun and serious quests. Keep things interesting without going full grind." |
| `hard` | 💀 | Hard | "Disciplined self-improvement. No-alcohol weeks, meal prep, inbox zero." |

Default selection: `'hard'`.

---

## Store

### Updated `completeOnboarding`

Receives `mode` via the `Player` object. Passes `player.mode` to `generateDailyQuests`, `generateWeeklyQuests`, and `generateMonthlyQuest`.

### Updated `checkAndApplyResets`

Reads `state.player.mode` for all regeneration calls instead of implicitly using only the hard pool.

### New action: `setPlayerMode`

```ts
setPlayerMode: (mode: QuestMode) => void
```

Sets `player.mode`. Takes effect at next reset (same behavior as class switching). Does not immediately reroll the current board.

---

## Character Sheet Display

Mode renders as a small colored badge directly after the class badge.

| Mode | Color |
|---|---|
| Fun | Amber |
| Medium | Violet |
| Hard | Slate |

Post-onboarding mode switching surface: `setPlayerMode` is available in the store. The UI surface for switching (settings, character sheet action) is out of scope for this spec — the action just needs to exist.

---

## Out of Scope

- Immediate reroll on mode switch (takes effect at next reset, same as class)
- Per-quest mode tagging or history (which pool a completed quest came from)
- UI surface for post-onboarding mode switching (store action exists; UI is a separate task)
