# SideQuest — Design Spec

**Date:** 2026-06-22
**Status:** Approved

---

## Overview

SideQuest is a mobile-first, RPG-inspired habit and self-improvement PWA. It presents real-world growth tasks as quests on a quest board rather than a traditional to-do list. The initial version requires no backend — all state lives in localStorage. Deployable to Vercel.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand with `persist` middleware |
| Storage | localStorage (via Zustand persist, single `sidequest` key) |
| PWA | next-pwa |
| Deployment | Vercel |

All game logic runs client-side. Next.js is used for its build tooling, Vercel integration, and PWA support. No server-side data fetching is required.

---

## File Structure

```
src/
  app/           # Next.js App Router shell (layout, page)
  components/    # UI components (dashboard, quest cards, character sheet, onboarding, modals)
  store/         # Zustand store + slice definitions
  lib/           # Quest library data, XP utilities, reset logic
  types/         # TypeScript interfaces
docs/
  superpowers/
    specs/       # Design documents
```

---

## Data Model

### QuestTemplate (static, lives in repo)

Authored by developers and shipped as a static TypeScript array in `src/lib/questLibrary.ts`. Never persisted to localStorage.

```ts
interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  stat: 'health' | 'stamina' | 'mana';
  tier: 'daily' | 'weekly' | 'monthly';
}
```

### Quest (runtime, persisted in localStorage)

Instantiated from a QuestTemplate when assigned to the player's board. Custom quests are created directly as Quest objects with `isCustom: true`.

```ts
interface Quest {
  id: string;           // copied from template, or uuid for custom quests
  title: string;        // copied from template, editable for custom quests
  description: string;  // copied from template, editable for custom quests
  stat: 'health' | 'stamina' | 'mana';
  tier: 'daily' | 'weekly' | 'monthly';
  xpReward: number;     // daily: 10, weekly: 50, monthly: 200
  isCustom: boolean;
  completed: boolean;
}
```

### Zustand Store — 5 Slices

All slices are persisted together in a single localStorage key: `sidequest`.

#### `player`
```ts
{
  name: string;
  avatarId: string;          // key referencing a pre-made sprite
  class: 'knight' | 'wizard' | 'bard';
  level: number;
  totalXP: number;           // global cumulative XP (all stats combined)
  xpToNextLevel: number;     // recalculated on level-up
  stats: {
    health: number;          // cumulative career XP earned in this stat (never resets)
    stamina: number;
    mana: number;
  };
}
```

#### `quests`
```ts
{
  daily: Quest[];            // 4 quests
  weekly: Quest[];           // 3 quests
  monthly: Quest[];          // 1 quest
}
```

#### `monthlyBar`
```ts
{
  // Monthly bar progress (resets when new monthly quest is assigned)
  health: number;
  stamina: number;
  mana: number;
  monthStartDate: string;    // ISO date — used to detect monthly rollover
}
```

#### `sleepBuff`
```ts
{
  isActive: boolean;
  lastCheckedDate: string;   // ISO date string — one check-in allowed per calendar day
}
```

#### `onboarding`
```ts
{
  isComplete: boolean;
  currentStep: number;       // 0–5
}
```

#### `resets`
```ts
{
  lastDailyReset: string;    // ISO date
  lastWeeklyReset: string;   // ISO date (Monday)
  lastMonthlyReset: string;  // ISO date (1st of month)
}
```

---

## Quest Library

`src/lib/questLibrary.ts` exports a static `QuestTemplate[]` array, organized by stat and tier. The library ships with the app and is the source for all quest generation.

Approximate library size targets:
- ~15 daily templates per stat (45 total daily)
- ~10 weekly templates per stat (30 total weekly)
- ~8 monthly templates per stat (24 total monthly)

---

## Quest Generation

### Class Stat Weighting

| Class | Primary (×2 daily) | Secondary | Tertiary |
|---|---|---|---|
| Knight | Health | Stamina | Mana |
| Wizard | Mana | Health | Stamina |
| Bard | Stamina | Health | Mana |

### Quest Counts Per Tier

| Tier | Count | Notes |
|---|---|---|
| Daily | 4 | 2 primary stat, 1 secondary, 1 tertiary — class weighted |
| Weekly | 3 | 1 of each stat — balanced, no class weighting |
| Monthly | 1 | Always primary stat |

Weekly quests are intentionally balanced across all three stats. Your class focus shows up in your daily habits and monthly objective, not your weekly goals.

### Generation Algorithm

1. Determine stat slots needed based on class and tier
2. For each stat slot, filter `questLibrary` by `tier` + `stat`
3. Pick randomly from filtered pool, no duplicates within active board
4. Instantiate as `Quest` objects (copy template fields, set `xpReward`, `isCustom: false`, `completed: false`)
5. Write to `quests` store slice

### Reroll Algorithm

1. Note the `stat` and `tier` of the quest being rerolled
2. Filter library by same `stat` + `tier`, exclude templates with IDs already active on the board
3. Pick randomly, instantiate new `Quest`, replace in store

Rerolling is free and unlimited.

### Reset Algorithm

Checked on every app load by comparing current date to `resets` timestamps:

- If calendar day changed → regenerate all daily quests, reset daily bar points
- If Monday passed → regenerate all weekly quests, reset weekly bar points
- If month changed → regenerate monthly quest, reset all `monthlyBar` values and update `monthStartDate`

---

## Stat Bars

Bars are a **monthly completion tracker** that reset when the monthly quest regenerates. They are separate from cumulative career XP, which never resets.

### Bar Dimensions

| Stat Type | Visual Width | Max Possible Points | Fills At (100%) |
|---|---|---|---|
| Preferred | Full width | 90 | 70 |
| Non-preferred | ~2/3 width | 46 | 40 |

The preferred stat bar is physically wider on screen, reinforcing the RPG feel of a primary stat.

### Bar Point Values Per Quest

| Quest | Bar Points |
|---|---|
| Daily (non-preferred stat, 1/day) | 1 pt |
| Daily (preferred stat, 2/day) | 1 pt each |
| Weekly (any stat) | 4 pts |
| Monthly (preferred stat only) | 14 pts |

### Monthly Point Breakdown

| | Daily | Weekly | Monthly | Max Possible | Fills At |
|---|---|---|---|---|---|
| Non-preferred | 30 (1×30 days) | 16 (4×4 weeks) | — | 46 | 40 |
| Preferred | 60 (2×30 days) | 16 (4×4 weeks) | 14 | 90 | 70 |

The monthly quest is required to fill the preferred bar — dailies and weeklies alone max out at 76, below the 70 fill threshold only if some are missed. This ensures monthly quests feel impactful.

Bars reset on calendar month rollover (1st of the month, detected on app load), not on monthly quest completion. Completing the monthly quest mid-month simply adds its 14 bar points; the bar continues filling from daily/weekly completions until the month ends.

### Display

Each stat bar on the character sheet shows:
- Stat icon + name
- Progress bar (capped visually at 100% even if overflowing)
- Career XP total beneath the bar

Example (Knight):
```
❤️ Health  [████████████████████] 72/70   Career: 1,240 XP
⚡ Stamina [████████████░░]  31/40        Career: 580 XP
🔮 Mana    [██████████░░░░]  24/40        Career: 390 XP
```

---

## XP & Progression

### XP Rewards

| Tier | Base XP | With Sleep Buff (+20%) |
|---|---|---|
| Daily | 10 | 12 |
| Weekly | 50 | 60 |
| Monthly | 200 | 240 |

### Stat XP

Each quest's XP is added to both:
1. The corresponding stat's career total (`player.stats.health/stamina/mana`) — cumulative, never resets
2. The player's `totalXP` — used for level calculation

### Player Level

- Level 1 starts with 100 XP required to reach Level 2
- Each subsequent level: `xpToNextLevel = Math.round(previous * 1.01)`
- Example: Lv1→2: 100, Lv2→3: 101, Lv3→4: 102...
- Level-up is checked after every XP gain
- Level-up triggers a brief on-screen celebration (banner or animation) without leaving the dashboard

### Sleep Buff

- Binary: active or inactive
- Grants +20% XP on all quest completions while active
- Activated via morning check-in modal (see below)
- Resets each calendar day (checked via `sleepBuff.lastCheckedDate`)

**Future consideration:** "Better luck next time" — if a monthly quest resets while incomplete, apply a +10% XP bonus to the next successful monthly completion. Not in scope for v1.

---

## Sleep Check-In

A modal that appears on the first app open of each calendar day if the sleep buff is not yet active.

**Prompt:** *"Did you sleep 6–8 hours?"*
- **Yes** → `sleepBuff.isActive = true`, `lastCheckedDate = today`
- **No** → modal dismissed, no buff, `lastCheckedDate = today` (won't ask again today)

---

## Onboarding Flow

Shown only on first run. `onboarding.isComplete` gates it — once true, app goes straight to dashboard.

| Step | Content |
|---|---|
| 0. Welcome | App name, tagline, "Begin your quest" CTA |
| 1. Name | Text input for character name. Validates non-empty. |
| 2. Avatar | Grid of ~8–12 pre-made RPG-style sprite icons. Tap to select. |
| 3. Class | Three cards: Knight / Wizard / Bard. Each shows class name, primary stat, flavor text. |
| 4. Stats intro | 3-panel explanation of Health, Stamina, Mana with icons and example quests. "Got it" to dismiss. |
| 5. Dashboard | Onboarding marked complete, quests generated for chosen class, player lands on quest board. |

Navigation: forward-only with a back button on each step (except Welcome). Step progress indicator shown throughout.

---

## Dashboard Layout

Single-screen, mobile-first. Vertical scroll permitted but key elements visible above the fold.

### Character Sheet (top / fixed header)
- Avatar sprite · Player name · Class badge · Level
- Three stat bars (preferred full-width, others 2/3 width)
- Sleep buff indicator (glowing when active, greyed when not)

### Monthly Quest (large card)
- Full-width card, most visual weight
- Quest title + description
- Stat icon + XP reward badge
- Progress bar (0–100%)
- Complete / Reroll actions

### Weekly Quests (medium cards)
- 3 cards in vertical stack
- Quest title + description + stat icon
- Complete / Reroll per card

### Daily Quests (compact checklist)
- 4 compact rows
- Quest title + stat icon + XP reward
- Tap to complete (checkbox-style)
- Reroll via small icon button

### Modals
- **Sleep check-in** — appears on first open of the day
- **Quest creation** — triggered by floating "+" button. Fields: title, description, stat, tier.

### Custom Quest Input Limits

| Field | Max Length |
|---|---|
| Title | 80 characters |
| Description | 280 characters |

Enforced at the UI level (maxLength on inputs) and validated before writing to the store. No other quest fields are user-editable.

---

## Avatars

A curated set of ~8–12 pre-made RPG-style sprite icons (knight, wizard, bard, rogue silhouettes, etc.) stored in the repo. Referenced by `player.avatarId`.

---

## Classes

| Class | Primary Stat | Flavor |
|---|---|---|
| Knight | Health | *"Forge your body. Health is your foundation."* |
| Wizard | Mana | *"Knowledge is power. Shape your future."* |
| Bard | Stamina | *"Life is lived outward. Connection fuels everything."* |

Players may switch classes at any time (settings or character sheet). Switching class changes quest weighting at next reset but does not reroll current quests immediately.

---

## Out of Scope (v1)

- Authentication
- Cloud sync
- Push notifications
- "Better luck next time" monthly bonus
- Quest history / completion log
- Social features
- Multiple profiles
