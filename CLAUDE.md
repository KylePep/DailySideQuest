# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run test         # Run Jest suite once
npm run test:watch   # Jest in watch mode
```

To run a single test file:
```bash
npx jest src/lib/__tests__/xp.test.ts
```

## Architecture

**Stack**: Next.js 14 (App Router) + React 18 + TypeScript + Zustand + Tailwind CSS

Single-page app — the root `/` renders either the onboarding wizard or the dashboard based on `onboarding.completed` in Zustand state.

### State Management

All app state lives in a single Zustand store at [src/store/index.ts](src/store/index.ts), persisted to localStorage under the key `'sidequest'`. The store owns:

- Player data (name, avatar, class, mode, level, xp, career stats)
- Active quest boards: `dailyQuests` (4), `weeklyQuests` (3), `monthlyQuests` (1)
- Monthly bar progress (`MonthlyBar`) — keyed by `"YYYY-M"` format
- Sleep buff state (once-per-calendar-day 20% XP bonus)
- Onboarding step/completion flags
- ISO timestamps for last daily/weekly/monthly reset

Use `useStore(s => s.property)` selector pattern everywhere. The `checkAndApplyResets()` action runs on page load via `useEffect` in the root page to handle calendar-based refreshes.

### Key Data Flows

**Quest completion** → `completeQuest(id, tier)` in store:
- Calculates XP (with sleep buff if active), stores `xpGained` on the quest object for undo support
- Calls `applyXpGain()` which handles multi-level leveling in one pass
- Updates `MonthlyBar` via `barPoints` calculation

**Uncomplete** → `uncompleteQuest(id, tier)` reverses XP using stored `xpGained`, may de-level.

**Quest generation** ([src/lib/questGeneration.ts](src/lib/questGeneration.ts)):
- Daily: 2 primary stat + 1 secondary + 1 tertiary
- Weekly: 1 per stat (3 total); Monthly: 1 for primary stat
- Mode `'fun'` → FUN_QUEST_LIBRARY; `'hard'` → QUEST_LIBRARY; `'medium'` → 50/50 per slot
- Reroll filters out currently active template IDs to prevent duplicates

### Core Types (`src/types/index.ts`)

```typescript
type Stat = 'health' | 'stamina' | 'mana'
type PlayerClass = 'knight' | 'wizard' | 'bard'   // knight→health, bard→stamina, wizard→mana
type QuestTier = 'daily' | 'weekly' | 'monthly'
type QuestMode = 'fun' | 'medium' | 'hard'

interface Quest {
  id, templateId, title, description, stat, tier
  barPoints, xpValue
  completed, completedAt
  xpGained   // stored at completion time (post sleep-buff) for accurate undo
  isCustom
}
```

### XP & Leveling (`src/lib/xp.ts`)

Level cost formula: `xpToNextLevel(level) = Math.round(100 * 1.01^(level-1))`

Sleep buff multiplies by 1.2 using `Math.floor()`. XP values use `Math.round()` for level costs. `applyXpGain()` handles multi-level advances in a single call; `reverseXpGain()` is its inverse.

### Monthly Bar (`src/lib/barPoints.ts`)

Points per completion: daily=1, weekly=4, monthly=14. Targets ~90 points by month-end. Visual fill uses different thresholds for primary stat (70–90 points = 100% width) vs others (40–46 points = 66% width).

### Reset Logic (`src/lib/resets.ts`)

- Daily: calendar date change
- Weekly: 7 days elapsed
- Monthly: calendar month change (`"YYYY-M"` key)
- Sleep check-in: once per calendar date (not timestamp)

## Component Conventions

- All interactive components require `'use client'` directive
- Hydration-sensitive renders are wrapped in `ClientOnly`
- Modals render conditionally based on store state flags (not router)
- Components live in `src/components/` organized by feature area

## Testing

Jest + jsdom + `@testing-library/react`. Tests live in `src/lib/__tests__/` and cover xp calculations, bar points, reset detection, and quest generation. Module alias `@/*` maps to `src/*`.
