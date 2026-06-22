# SideQuest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build SideQuest — an RPG-inspired habit tracker PWA with Health/Stamina/Mana stats, class-weighted quests, monthly stat bars, and full localStorage persistence via Zustand.

**Architecture:** Next.js 14 App Router, all UI as client components, Zustand persisted to localStorage. A `ClientOnly` wrapper guards against SSR hydration mismatches. Root page gates between onboarding and dashboard. No server-side data fetching.

**Tech Stack:** Next.js 14, TypeScript (strict), Tailwind CSS, Zustand + persist middleware, @ducanh2912/next-pwa, Jest, React Testing Library, uuid

## Global Constraints

- Next.js 14 App Router, `src/` dir, path alias `@/*`
- TypeScript strict mode throughout
- All React components must include `'use client'` at the top
- Zustand localStorage key: `sidequest`
- XP rewards: daily=10, weekly=50, monthly=200
- Sleep buff: binary +20% XP (`Math.floor(base * 1.2)`)
- Bar fill thresholds: preferred stat — max 90, fills at 70; non-preferred — max 46, fills at 40
- Bar points per quest: daily=1, weekly=4, monthly=14
- Quest counts: daily=4 (2 primary, 1 secondary, 1 tertiary), weekly=3 (1 each stat), monthly=1 (primary stat)
- Custom quest limits: title ≤ 80 chars, description ≤ 280 chars (enforced at input + store write)
- Level XP curve: level 1→2 costs 100 XP; each subsequent level costs `Math.round(previous * 1.01)`
- Class primaries: knight=health, wizard=mana, bard=stamina
- No backend, no auth, no external API calls

---

## File Map

| File | Responsibility |
|------|----------------|
| `src/types/index.ts` | All TypeScript interfaces and type aliases |
| `src/lib/xp.ts` | XP reward calc, sleep buff, level-up logic |
| `src/lib/barPoints.ts` | Bar config constants and point calculation |
| `src/lib/questLibrary.ts` | Static `QuestTemplate[]` shipped with the app |
| `src/lib/questGeneration.ts` | Generate and reroll quest instances |
| `src/lib/resets.ts` | Detect daily/weekly/monthly rollovers |
| `src/lib/avatars.ts` | Avatar id list + inline SVG components |
| `src/store/index.ts` | Zustand store — all state + actions, persisted |
| `src/components/ui/ClientOnly.tsx` | SSR hydration guard |
| `src/components/ui/LevelUpBanner.tsx` | Level-up celebration banner |
| `src/components/onboarding/WelcomeStep.tsx` | Step 0 |
| `src/components/onboarding/NameStep.tsx` | Step 1 |
| `src/components/onboarding/AvatarStep.tsx` | Step 2 |
| `src/components/onboarding/ClassStep.tsx` | Step 3 |
| `src/components/onboarding/StatsIntroStep.tsx` | Step 4 |
| `src/components/onboarding/OnboardingFlow.tsx` | Orchestrates all onboarding steps |
| `src/components/dashboard/StatBar.tsx` | Single stat progress bar |
| `src/components/dashboard/CharacterSheet.tsx` | Header: avatar, name, level, stat bars, sleep buff |
| `src/components/dashboard/MonthlyQuestCard.tsx` | Large monthly quest card |
| `src/components/dashboard/WeeklyQuestCard.tsx` | Medium weekly quest card |
| `src/components/dashboard/DailyQuestRow.tsx` | Compact daily checklist row |
| `src/components/dashboard/Dashboard.tsx` | Main layout — assembles all dashboard sections |
| `src/components/modals/SleepCheckInModal.tsx` | Morning sleep check-in modal |
| `src/components/modals/QuestCreationModal.tsx` | Custom quest creation modal |
| `src/app/layout.tsx` | Root layout with PWA meta tags |
| `src/app/page.tsx` | Root page: onboarding vs dashboard gate + reset detection |
| `src/app/globals.css` | Tailwind base styles |
| `public/manifest.json` | PWA manifest |
| `next.config.ts` | Next.js + PWA config |
| `jest.config.ts` | Jest config |
| `jest.setup.ts` | jest-dom import |

---

### Task 1: Project Scaffold & Test Setup

**Files:**
- Create: `next.config.ts`, `jest.config.ts`, `jest.setup.ts`, `public/manifest.json`
- Modify: `package.json`

**Interfaces:** None yet — this task establishes the build environment.

- [ ] **Step 1: Scaffold Next.js project**

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint
```

When prompted: choose "Yes" for TypeScript, Tailwind, App Router, src/ directory.

- [ ] **Step 2: Install runtime dependencies**

```bash
npm install zustand @ducanh2912/next-pwa uuid
npm install --save-dev @types/uuid
```

- [ ] **Step 3: Install test dependencies**

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest
```

- [ ] **Step 4: Write jest.config.ts**

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 5: Write jest.setup.ts**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 7: Write next.config.ts**

```ts
import type { NextConfig } from 'next'
import withPWA from '@ducanh2912/next-pwa'

const nextConfig: NextConfig = {}

export default withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig)
```

- [ ] **Step 8: Write public/manifest.json**

```json
{
  "name": "SideQuest",
  "short_name": "SideQuest",
  "description": "RPG-inspired habit tracker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f0f1a",
  "theme_color": "#7c3aed",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 9: Verify build passes**

```bash
npm run build
```

Expected: build completes with no TypeScript errors. PWA files generated in `public/`.

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 14 project with Tailwind, Zustand, PWA, and Jest"
```

---

### Task 2: TypeScript Types

**Files:**
- Create: `src/types/index.ts`

**Interfaces:** Defines all types consumed by every subsequent task.

- [ ] **Step 1: Write src/types/index.ts**

```ts
export type Stat = 'health' | 'stamina' | 'mana'
export type PlayerClass = 'knight' | 'wizard' | 'bard'
export type QuestTier = 'daily' | 'weekly' | 'monthly'

export interface QuestTemplate {
  id: string
  title: string
  description: string
  stat: Stat
  tier: QuestTier
}

export interface Quest {
  id: string
  title: string
  description: string
  stat: Stat
  tier: QuestTier
  xpReward: number
  isCustom: boolean
  completed: boolean
}

export interface PlayerStats {
  health: number
  stamina: number
  mana: number
}

export interface Player {
  name: string
  avatarId: string
  class: PlayerClass
  level: number
  totalXP: number
  xpToNextLevel: number
  stats: PlayerStats
}

export interface MonthlyBar {
  health: number
  stamina: number
  mana: number
  monthStartDate: string
}

export interface SleepBuff {
  isActive: boolean
  lastCheckedDate: string
}

export interface Onboarding {
  isComplete: boolean
  currentStep: number
}

export interface Resets {
  lastDailyReset: string
  lastWeeklyReset: string
  lastMonthlyReset: string
}

export interface AvatarDefinition {
  id: string
  label: string
  component: React.ComponentType<{ className?: string }>
}
```

- [ ] **Step 2: Verify TypeScript accepts the types**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: XP Utilities (TDD)

**Files:**
- Create: `src/lib/xp.ts`, `src/lib/__tests__/xp.test.ts`

**Interfaces:**
- Consumes: `Player`, `Stat` from `@/types`
- Produces:
  - `xpToNextLevel(level: number): number`
  - `applySleepBuff(baseXp: number, buffActive: boolean): number`
  - `applyXpGain(player: Player, xp: number, stat: Stat): { player: Player; leveledUp: boolean }`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/xp.test.ts`:

```ts
import { xpToNextLevel, applySleepBuff, applyXpGain } from '@/lib/xp'
import type { Player } from '@/types'

const basePlayer: Player = {
  name: 'Test',
  avatarId: 'knight',
  class: 'knight',
  level: 1,
  totalXP: 0,
  xpToNextLevel: 100,
  stats: { health: 0, stamina: 0, mana: 0 },
}

describe('xpToNextLevel', () => {
  it('returns 100 for level 1', () => {
    expect(xpToNextLevel(1)).toBe(100)
  })
  it('returns 101 for level 2', () => {
    expect(xpToNextLevel(2)).toBe(101)
  })
  it('returns 102 for level 3', () => {
    expect(xpToNextLevel(3)).toBe(102)
  })
  it('compounds at higher levels', () => {
    // 100 * 1.01^9 = 109.368... → 109
    expect(xpToNextLevel(10)).toBe(109)
  })
})

describe('applySleepBuff', () => {
  it('returns base XP when buff is inactive', () => {
    expect(applySleepBuff(10, false)).toBe(10)
    expect(applySleepBuff(50, false)).toBe(50)
    expect(applySleepBuff(200, false)).toBe(200)
  })
  it('returns floor(base * 1.2) when buff is active', () => {
    expect(applySleepBuff(10, true)).toBe(12)
    expect(applySleepBuff(50, true)).toBe(60)
    expect(applySleepBuff(200, true)).toBe(240)
  })
})

describe('applyXpGain', () => {
  it('adds XP to totalXP and correct stat', () => {
    const { player } = applyXpGain(basePlayer, 10, 'health')
    expect(player.totalXP).toBe(10)
    expect(player.stats.health).toBe(10)
    expect(player.stats.stamina).toBe(0)
    expect(player.stats.mana).toBe(0)
  })

  it('does not trigger level-up when XP is below threshold', () => {
    const { player, leveledUp } = applyXpGain(basePlayer, 99, 'health')
    expect(player.level).toBe(1)
    expect(leveledUp).toBe(false)
  })

  it('triggers level-up when XP reaches threshold', () => {
    const { player, leveledUp } = applyXpGain(basePlayer, 100, 'health')
    expect(player.level).toBe(2)
    expect(player.xpToNextLevel).toBe(101)
    expect(leveledUp).toBe(true)
  })

  it('can level up multiple times from a single XP gain', () => {
    const { player, leveledUp } = applyXpGain(basePlayer, 250, 'health')
    expect(player.level).toBeGreaterThan(2)
    expect(leveledUp).toBe(true)
  })

  it('preserves existing stat XP', () => {
    const p = { ...basePlayer, stats: { health: 50, stamina: 30, mana: 10 } }
    const { player } = applyXpGain(p, 10, 'stamina')
    expect(player.stats.health).toBe(50)
    expect(player.stats.stamina).toBe(40)
    expect(player.stats.mana).toBe(10)
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm test -- xp.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/xp'"

- [ ] **Step 3: Implement src/lib/xp.ts**

```ts
import type { Player, Stat } from '@/types'

export function xpToNextLevel(level: number): number {
  let xp = 100
  for (let i = 1; i < level; i++) {
    xp = Math.round(xp * 1.01)
  }
  return xp
}

export function applySleepBuff(baseXp: number, buffActive: boolean): number {
  return buffActive ? Math.floor(baseXp * 1.2) : baseXp
}

export function applyXpGain(
  player: Player,
  xp: number,
  stat: Stat
): { player: Player; leveledUp: boolean } {
  let { level, totalXP, xpToNextLevel: threshold } = player
  const newStats = { ...player.stats, [stat]: player.stats[stat] + xp }
  totalXP += xp
  let leveledUp = false

  while (totalXP >= threshold) {
    level += 1
    leveledUp = true
    threshold = xpToNextLevel(level)
  }

  return {
    player: { ...player, level, totalXP, xpToNextLevel: threshold, stats: newStats },
    leveledUp,
  }
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test -- xp.test.ts
```

Expected: PASS — 11 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/xp.ts src/lib/__tests__/xp.test.ts
git commit -m "feat: add XP and level-up utilities"
```

---

### Task 4: Bar Points Utilities (TDD)

**Files:**
- Create: `src/lib/barPoints.ts`, `src/lib/__tests__/barPoints.test.ts`

**Interfaces:**
- Consumes: `Stat`, `PlayerClass` from `@/types`
- Produces:
  - `DAILY_BAR_PTS`, `WEEKLY_BAR_PTS`, `MONTHLY_BAR_PTS` (constants)
  - `isPreferredStat(stat: Stat, playerClass: PlayerClass): boolean`
  - `getBarConfig(stat: Stat, playerClass: PlayerClass): { max: number; fillAt: number }`
  - `getBarPercent(points: number, stat: Stat, playerClass: PlayerClass): number`
  - `getBarWidthClass(stat: Stat, playerClass: PlayerClass): string`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/barPoints.test.ts`:

```ts
import {
  DAILY_BAR_PTS,
  WEEKLY_BAR_PTS,
  MONTHLY_BAR_PTS,
  isPreferredStat,
  getBarConfig,
  getBarPercent,
  getBarWidthClass,
} from '@/lib/barPoints'

describe('constants', () => {
  it('has correct point values', () => {
    expect(DAILY_BAR_PTS).toBe(1)
    expect(WEEKLY_BAR_PTS).toBe(4)
    expect(MONTHLY_BAR_PTS).toBe(14)
  })
})

describe('isPreferredStat', () => {
  it('returns true for knight+health', () => expect(isPreferredStat('health', 'knight')).toBe(true))
  it('returns true for wizard+mana', () => expect(isPreferredStat('mana', 'wizard')).toBe(true))
  it('returns true for bard+stamina', () => expect(isPreferredStat('stamina', 'bard')).toBe(true))
  it('returns false for non-primary', () => {
    expect(isPreferredStat('stamina', 'knight')).toBe(false)
    expect(isPreferredStat('health', 'wizard')).toBe(false)
    expect(isPreferredStat('mana', 'bard')).toBe(false)
  })
})

describe('getBarConfig', () => {
  it('returns preferred config for primary stat', () => {
    expect(getBarConfig('health', 'knight')).toEqual({ max: 90, fillAt: 70 })
    expect(getBarConfig('mana', 'wizard')).toEqual({ max: 90, fillAt: 70 })
  })
  it('returns non-preferred config for secondary/tertiary stats', () => {
    expect(getBarConfig('stamina', 'knight')).toEqual({ max: 46, fillAt: 40 })
    expect(getBarConfig('mana', 'knight')).toEqual({ max: 46, fillAt: 40 })
  })
})

describe('getBarPercent', () => {
  it('returns 0 at 0 points', () => {
    expect(getBarPercent(0, 'health', 'knight')).toBe(0)
  })
  it('returns 100 at fillAt threshold', () => {
    expect(getBarPercent(70, 'health', 'knight')).toBe(100)
    expect(getBarPercent(40, 'stamina', 'knight')).toBe(100)
  })
  it('caps at 100 when over fillAt', () => {
    expect(getBarPercent(90, 'health', 'knight')).toBe(100)
  })
  it('returns correct percentage below fillAt', () => {
    expect(getBarPercent(35, 'health', 'knight')).toBe(50)
    expect(getBarPercent(20, 'stamina', 'knight')).toBe(50)
  })
})

describe('getBarWidthClass', () => {
  it('returns full-width class for preferred stat', () => {
    expect(getBarWidthClass('health', 'knight')).toBe('w-full')
  })
  it('returns partial-width class for non-preferred stat', () => {
    expect(getBarWidthClass('stamina', 'knight')).toBe('w-2/3')
    expect(getBarWidthClass('mana', 'knight')).toBe('w-2/3')
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm test -- barPoints.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/barPoints'"

- [ ] **Step 3: Implement src/lib/barPoints.ts**

```ts
import type { Stat, PlayerClass } from '@/types'

export const DAILY_BAR_PTS = 1
export const WEEKLY_BAR_PTS = 4
export const MONTHLY_BAR_PTS = 14

const CLASS_PRIMARY: Record<PlayerClass, Stat> = {
  knight: 'health',
  wizard: 'mana',
  bard: 'stamina',
}

const PREFERRED_CONFIG = { max: 90, fillAt: 70 }
const NON_PREFERRED_CONFIG = { max: 46, fillAt: 40 }

export function isPreferredStat(stat: Stat, playerClass: PlayerClass): boolean {
  return CLASS_PRIMARY[playerClass] === stat
}

export function getBarConfig(
  stat: Stat,
  playerClass: PlayerClass
): { max: number; fillAt: number } {
  return isPreferredStat(stat, playerClass) ? PREFERRED_CONFIG : NON_PREFERRED_CONFIG
}

export function getBarPercent(
  points: number,
  stat: Stat,
  playerClass: PlayerClass
): number {
  const { fillAt } = getBarConfig(stat, playerClass)
  return Math.min(100, Math.round((points / fillAt) * 100))
}

export function getBarWidthClass(stat: Stat, playerClass: PlayerClass): string {
  return isPreferredStat(stat, playerClass) ? 'w-full' : 'w-2/3'
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test -- barPoints.test.ts
```

Expected: PASS — all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/barPoints.ts src/lib/__tests__/barPoints.test.ts
git commit -m "feat: add stat bar point utilities"
```

---

### Task 5: Quest Library

**Files:**
- Create: `src/lib/questLibrary.ts`, `src/lib/__tests__/questLibrary.test.ts`

**Interfaces:**
- Consumes: `QuestTemplate` from `@/types`
- Produces: `questLibrary: QuestTemplate[]`

- [ ] **Step 1: Write smoke test first**

Create `src/lib/__tests__/questLibrary.test.ts`:

```ts
import { questLibrary } from '@/lib/questLibrary'

describe('questLibrary', () => {
  it('has at least 10 templates per stat per tier combination', () => {
    const stats = ['health', 'stamina', 'mana'] as const
    const tiers = ['daily', 'weekly'] as const
    for (const stat of stats) {
      for (const tier of tiers) {
        const count = questLibrary.filter(t => t.stat === stat && t.tier === tier).length
        expect(count).toBeGreaterThanOrEqual(10)
      }
    }
  })

  it('has at least 5 monthly templates per stat', () => {
    const stats = ['health', 'stamina', 'mana'] as const
    for (const stat of stats) {
      const count = questLibrary.filter(t => t.stat === stat && t.tier === 'monthly').length
      expect(count).toBeGreaterThanOrEqual(5)
    }
  })

  it('all templates have required fields', () => {
    for (const t of questLibrary) {
      expect(t.id).toBeTruthy()
      expect(t.title).toBeTruthy()
      expect(t.description).toBeTruthy()
      expect(['health', 'stamina', 'mana']).toContain(t.stat)
      expect(['daily', 'weekly', 'monthly']).toContain(t.tier)
    }
  })

  it('has no duplicate ids', () => {
    const ids = questLibrary.map(t => t.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })
})
```

- [ ] **Step 2: Run test — confirm it fails**

```bash
npm test -- questLibrary.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/questLibrary'"

- [ ] **Step 3: Write src/lib/questLibrary.ts**

```ts
import type { QuestTemplate } from '@/types'

export const questLibrary: QuestTemplate[] = [
  // ── HEALTH DAILY ──
  { id: 'h-d-01', stat: 'health', tier: 'daily', title: 'Walk for 20 minutes', description: 'Lace up and get moving. A 20-minute walk improves mood, energy, and cardiovascular health.' },
  { id: 'h-d-02', stat: 'health', tier: 'daily', title: 'Drink 8 glasses of water', description: 'Stay hydrated throughout the day. Your body and mind both perform better when fueled with water.' },
  { id: 'h-d-03', stat: 'health', tier: 'daily', title: 'Do 10 push-ups', description: 'Drop and give yourself ten. Bodyweight strength takes minutes but builds lasting power.' },
  { id: 'h-d-04', stat: 'health', tier: 'daily', title: 'Stretch for 5 minutes', description: 'Take five to move through your range of motion. A flexible body is a resilient one.' },
  { id: 'h-d-05', stat: 'health', tier: 'daily', title: 'Get 30 minutes of sunlight', description: 'Step outside and soak it in. Natural light regulates sleep, boosts mood, and resets your internal clock.' },
  { id: 'h-d-06', stat: 'health', tier: 'daily', title: 'Take your vitamins', description: 'A small daily habit with outsized long-term benefits. Supplement what your diet misses.' },
  { id: 'h-d-07', stat: 'health', tier: 'daily', title: 'Cook a healthy meal', description: 'Fuel your body with intention. Cooking at home puts you in control of what goes in.' },
  { id: 'h-d-08', stat: 'health', tier: 'daily', title: 'Be in bed by 11pm', description: 'Your future self will thank you. Sleep is the foundation everything else rests on.' },
  { id: 'h-d-09', stat: 'health', tier: 'daily', title: 'Do 20 minutes of cardio', description: 'Get your heart rate up and your blood moving. Even a light session counts.' },
  { id: 'h-d-10', stat: 'health', tier: 'daily', title: 'Take a cold shower', description: 'End your shower with 30 seconds of cold water. It builds discipline and wakes up your system.' },
  { id: 'h-d-11', stat: 'health', tier: 'daily', title: 'Meditate for 5 minutes', description: 'Sit, breathe, and let thoughts pass. Five minutes of stillness can shift your whole day.' },
  { id: 'h-d-12', stat: 'health', tier: 'daily', title: 'Floss and brush your teeth', description: 'Two minutes, twice a day. Your future teeth will thank you.' },
  { id: 'h-d-13', stat: 'health', tier: 'daily', title: 'Skip fast food today', description: 'One day, one choice. Give your body a break from processed food.' },
  { id: 'h-d-14', stat: 'health', tier: 'daily', title: 'Stand up and move every hour', description: 'Set a reminder. Even a brief walk between desk sessions reduces fatigue and improves focus.' },
  { id: 'h-d-15', stat: 'health', tier: 'daily', title: 'Take the stairs', description: 'Skip the elevator. Small choices compound into big results.' },

  // ── HEALTH WEEKLY ──
  { id: 'h-w-01', stat: 'health', tier: 'weekly', title: 'Hit the gym 3 times', description: 'Three sessions this week. Show up, put in the work, go home.' },
  { id: 'h-w-02', stat: 'health', tier: 'weekly', title: 'Run or walk 5km', description: 'One continuous effort this week. Go at whatever pace works for you.' },
  { id: 'h-w-03', stat: 'health', tier: 'weekly', title: 'Meal prep for the week', description: 'Spend an hour or two setting yourself up. Future you will eat better because of it.' },
  { id: 'h-w-04', stat: 'health', tier: 'weekly', title: 'Sleep 7+ hours every night', description: 'Make sleep the priority for seven days. Track it if it helps.' },
  { id: 'h-w-05', stat: 'health', tier: 'weekly', title: 'Try a new healthy recipe', description: 'Cook something you have never made before. Expanding your cooking expands your health.' },
  { id: 'h-w-06', stat: 'health', tier: 'weekly', title: 'Schedule a medical appointment', description: 'Book that checkup you have been putting off. Preventive care is self-care.' },
  { id: 'h-w-07', stat: 'health', tier: 'weekly', title: 'Do yoga or stretching 3 times', description: 'Three sessions of intentional movement this week. It does not have to be long.' },
  { id: 'h-w-08', stat: 'health', tier: 'weekly', title: 'Go on a hike or long walk', description: 'Get outside for an extended walk or trail. Nature has a way of resetting everything.' },
  { id: 'h-w-09', stat: 'health', tier: 'weekly', title: 'Drink only water for 3 days', description: 'Cut the sugary drinks for three days. Your body will notice.' },
  { id: 'h-w-10', stat: 'health', tier: 'weekly', title: 'Complete 3 workout sessions', description: 'Three workouts, any kind. Consistency over intensity.' },

  // ── HEALTH MONTHLY ──
  { id: 'h-m-01', stat: 'health', tier: 'monthly', title: 'Complete a 30-day fitness challenge', description: 'Pick a challenge and see it through. A month of commitment changes your baseline.' },
  { id: 'h-m-02', stat: 'health', tier: 'monthly', title: 'Schedule and attend a medical checkup', description: 'Your health is your most valuable asset. Invest in knowing where you stand.' },
  { id: 'h-m-03', stat: 'health', tier: 'monthly', title: 'Run 10km without stopping', description: 'Train toward it, then do it. Crossing that finish line is a real milestone.' },
  { id: 'h-m-04', stat: 'health', tier: 'monthly', title: 'Build a consistent sleep schedule', description: 'Same bedtime, same wake time, for 30 days. Your energy levels will transform.' },
  { id: 'h-m-05', stat: 'health', tier: 'monthly', title: 'Go the month without alcohol', description: 'A full reset. See how you feel at the end.' },
  { id: 'h-m-06', stat: 'health', tier: 'monthly', title: 'Cook at home every day this month', description: 'Thirty days of home cooking. You will eat better and spend less.' },
  { id: 'h-m-07', stat: 'health', tier: 'monthly', title: 'Walk 10,000 steps every day', description: 'A classic goal with real results. Get your steps in every single day.' },
  { id: 'h-m-08', stat: 'health', tier: 'monthly', title: 'Keep a nutrition journal for 30 days', description: 'Track what you eat for a month. Awareness is the first step to change.' },

  // ── STAMINA DAILY ──
  { id: 's-d-01', stat: 'stamina', tier: 'daily', title: 'Text a friend you miss', description: 'Reach out to someone. Connection does not maintain itself.' },
  { id: 's-d-02', stat: 'stamina', tier: 'daily', title: 'Call a family member', description: 'Pick up the phone. Five minutes of real connection is worth more than you think.' },
  { id: 's-d-03', stat: 'stamina', tier: 'daily', title: 'Smile and say hello to a stranger', description: 'Make a small human connection. It costs nothing and means more than you would expect.' },
  { id: 's-d-04', stat: 'stamina', tier: 'daily', title: 'Plan something fun for the weekend', description: 'Put something on the calendar. Having something to look forward to changes your week.' },
  { id: 's-d-05', stat: 'stamina', tier: 'daily', title: 'Share a meal with someone', description: 'Sit down and eat with another person. Food tastes better and so does life.' },
  { id: 's-d-06', stat: 'stamina', tier: 'daily', title: 'Compliment someone sincerely', description: 'Tell someone something true and kind about them. It will stick with them.' },
  { id: 's-d-07', stat: 'stamina', tier: 'daily', title: 'Spend 30 minutes outside', description: 'Leave the building. Fresh air and a change of scenery does something nothing else can.' },
  { id: 's-d-08', stat: 'stamina', tier: 'daily', title: 'Visit somewhere new in your city', description: 'Explore a street, cafe, or park you have never been to. Your city has more to offer.' },
  { id: 's-d-09', stat: 'stamina', tier: 'daily', title: 'Say yes to an invitation', description: 'Accept the thing you would normally decline. Show up.' },
  { id: 's-d-10', stat: 'stamina', tier: 'daily', title: 'Send a thank-you message', description: 'Tell someone you appreciate something they did. It strengthens connection.' },
  { id: 's-d-11', stat: 'stamina', tier: 'daily', title: 'Put your phone away for an evening', description: 'Spend a few hours without the screen. Be present wherever you are.' },
  { id: 's-d-12', stat: 'stamina', tier: 'daily', title: 'Write 3 things you are grateful for', description: 'Before bed, write three things. It shifts what you notice during the day.' },
  { id: 's-d-13', stat: 'stamina', tier: 'daily', title: 'Engage with an online community', description: 'Participate in a forum, Discord, or group around something you care about.' },
  { id: 's-d-14', stat: 'stamina', tier: 'daily', title: 'Watch something that makes you laugh', description: 'Laughter is underrated. Find something genuinely funny today.' },
  { id: 's-d-15', stat: 'stamina', tier: 'daily', title: 'Reach out to an old friend', description: 'Think of someone you have lost touch with and send a message.' },

  // ── STAMINA WEEKLY ──
  { id: 's-w-01', stat: 'stamina', tier: 'weekly', title: 'Have coffee with a friend', description: 'Book it, show up, put your phone away. Real time with real people.' },
  { id: 's-w-02', stat: 'stamina', tier: 'weekly', title: 'Attend a local event or meetup', description: 'Find something happening near you and go. Community does not build itself.' },
  { id: 's-w-03', stat: 'stamina', tier: 'weekly', title: 'Call a family member you have not spoken to', description: 'Make the call. Even a short conversation maintains the thread.' },
  { id: 's-w-04', stat: 'stamina', tier: 'weekly', title: 'Go somewhere you have never been', description: 'One new place this week. It does not have to be far.' },
  { id: 's-w-05', stat: 'stamina', tier: 'weekly', title: 'Host a game night or gathering', description: 'Bring people to your space. Being the host changes the energy.' },
  { id: 's-w-06', stat: 'stamina', tier: 'weekly', title: 'Try a new restaurant or cafe', description: 'Break your usual routine. New food, new atmosphere, new conversation.' },
  { id: 's-w-07', stat: 'stamina', tier: 'weekly', title: 'Attend a class or workshop', description: 'Learn something alongside other people. The social aspect of learning is underrated.' },
  { id: 's-w-08', stat: 'stamina', tier: 'weekly', title: 'Go on a day trip', description: 'Pick a destination within a couple hours and go. A day away is worth more than a week of planning.' },
  { id: 's-w-09', stat: 'stamina', tier: 'weekly', title: 'Write a letter or postcard', description: 'Put pen to paper and send something physical. It will be remembered.' },
  { id: 's-w-10', stat: 'stamina', tier: 'weekly', title: 'Volunteer for a cause you care about', description: 'Give a few hours to something bigger than yourself.' },

  // ── STAMINA MONTHLY ──
  { id: 's-m-01', stat: 'stamina', tier: 'monthly', title: 'Plan and take a weekend trip', description: 'Book it, pack a bag, go somewhere. A change of scene recharges everything.' },
  { id: 's-m-02', stat: 'stamina', tier: 'monthly', title: 'Attend a concert, festival, or major event', description: 'Go somewhere that puts you in a crowd of people who love the same thing.' },
  { id: 's-m-03', stat: 'stamina', tier: 'monthly', title: 'Make a genuine new connection', description: 'Meet someone new and follow up. Friendships do not happen without intention.' },
  { id: 's-m-04', stat: 'stamina', tier: 'monthly', title: 'Reconnect with someone from your past', description: 'Reach out to someone you have lost touch with. The door is usually still open.' },
  { id: 's-m-05', stat: 'stamina', tier: 'monthly', title: 'Go camping or spend a night outdoors', description: 'Sleep somewhere that is not your bed. Get under the sky.' },
  { id: 's-m-06', stat: 'stamina', tier: 'monthly', title: 'Take a solo adventure', description: 'Go somewhere alone. Do something on your own terms.' },
  { id: 's-m-07', stat: 'stamina', tier: 'monthly', title: 'Organize a group outing', description: 'Take the initiative. Plan something and invite people. You will be glad you did.' },
  { id: 's-m-08', stat: 'stamina', tier: 'monthly', title: 'Join a club, team, or regular group activity', description: 'Find something that meets regularly. Recurring connection is the most powerful kind.' },

  // ── MANA DAILY ──
  { id: 'm-d-01', stat: 'mana', tier: 'daily', title: 'Read 10 pages', description: 'Open the book. Ten pages a day is a book a month.' },
  { id: 'm-d-02', stat: 'mana', tier: 'daily', title: 'Learn one new thing and write it down', description: 'Find one interesting thing you did not know and record it. Knowledge compounds.' },
  { id: 'm-d-03', stat: 'mana', tier: 'daily', title: 'Work on a personal project for 30 minutes', description: 'Thirty minutes of focused work on something that is yours. It adds up fast.' },
  { id: 'm-d-04', stat: 'mana', tier: 'daily', title: 'Review your finances', description: 'Check your accounts. Awareness is the first step to control.' },
  { id: 'm-d-05', stat: 'mana', tier: 'daily', title: 'Write in a journal', description: 'Spend a few minutes on the page. Writing clarifies thinking like nothing else.' },
  { id: 'm-d-06', stat: 'mana', tier: 'daily', title: 'Watch an educational video', description: 'Find something that teaches you something real. YouTube is a university if you use it that way.' },
  { id: 'm-d-07', stat: 'mana', tier: 'daily', title: 'Practice a skill for 20 minutes', description: 'Deliberate practice on something you want to get better at. Consistency beats intensity.' },
  { id: 'm-d-08', stat: 'mana', tier: 'daily', title: 'Plan tomorrow\'s tasks', description: 'Spend 5 minutes tonight planning tomorrow. Future you will start the day with intention.' },
  { id: 'm-d-09', stat: 'mana', tier: 'daily', title: 'Unsubscribe from one junk email', description: 'Reduce the noise. One at a time, your inbox gets better.' },
  { id: 'm-d-10', stat: 'mana', tier: 'daily', title: 'Listen to a podcast episode', description: 'Learn something during your commute, workout, or chores.' },
  { id: 'm-d-11', stat: 'mana', tier: 'daily', title: 'Write 200 words', description: 'Get words on the page. It can be anything — just write.' },
  { id: 'm-d-12', stat: 'mana', tier: 'daily', title: 'Review your goals', description: 'Read through your goals. What you measure improves.' },
  { id: 'm-d-13', stat: 'mana', tier: 'daily', title: 'Do a brain puzzle or logic game', description: 'Exercise your mind deliberately. Sudoku, chess, puzzles — anything that makes you think.' },
  { id: 'm-d-14', stat: 'mana', tier: 'daily', title: 'Learn 5 new words', description: 'Language is a superpower. Five words a day is over 1,800 a year.' },
  { id: 'm-d-15', stat: 'mana', tier: 'daily', title: 'Review or cancel a subscription', description: 'Check what you are paying for. Cut what you do not use.' },

  // ── MANA WEEKLY ──
  { id: 'm-w-01', stat: 'mana', tier: 'weekly', title: 'Finish a chapter of your book', description: 'Make meaningful progress in what you are reading. Chapters are the unit of momentum.' },
  { id: 'm-w-02', stat: 'mana', tier: 'weekly', title: 'Complete a course module or lesson', description: 'One lesson closer to the skill you are building. Keep the streak alive.' },
  { id: 'm-w-03', stat: 'mana', tier: 'weekly', title: 'Review and update your budget', description: 'Sit down with your numbers once a week. Financial clarity compounds over time.' },
  { id: 'm-w-04', stat: 'mana', tier: 'weekly', title: 'Work on a major project for 3+ hours', description: 'Dedicated, uninterrupted time on the thing that matters most to you.' },
  { id: 'm-w-05', stat: 'mana', tier: 'weekly', title: 'Write a blog post or article', description: 'Share what you know. Writing forces you to understand things more deeply.' },
  { id: 'm-w-06', stat: 'mana', tier: 'weekly', title: 'Apply for a job, grant, or opportunity', description: 'Put yourself out there. One application this week.' },
  { id: 'm-w-07', stat: 'mana', tier: 'weekly', title: 'Clean and organize your workspace', description: 'Your environment shapes your thinking. Spend 30 minutes making your space work for you.' },
  { id: 'm-w-08', stat: 'mana', tier: 'weekly', title: 'Set clear goals for next week', description: 'Before the week starts, decide what matters. Intention creates results.' },
  { id: 'm-w-09', stat: 'mana', tier: 'weekly', title: 'Audit your subscriptions and spending', description: 'Find one thing to cut or optimize. Small recurring savings add up.' },
  { id: 'm-w-10', stat: 'mana', tier: 'weekly', title: 'Complete an online tutorial or workshop', description: 'Build something new. Tutorials are the fast path to new skills.' },

  // ── MANA MONTHLY ──
  { id: 'm-m-01', stat: 'mana', tier: 'monthly', title: 'Finish a book', description: 'See it through to the last page. Finishing is a skill worth practicing.' },
  { id: 'm-m-02', stat: 'mana', tier: 'monthly', title: 'Complete a major project milestone', description: 'Identify the key next milestone in your biggest project and reach it this month.' },
  { id: 'm-m-03', stat: 'mana', tier: 'monthly', title: 'Take an online course', description: 'Start and finish a structured course. The certificate matters less than the knowledge.' },
  { id: 'm-m-04', stat: 'mana', tier: 'monthly', title: 'Build something new', description: 'Ship something — an app, a tool, a prototype. Creation is the highest form of learning.' },
  { id: 'm-m-05', stat: 'mana', tier: 'monthly', title: 'Create and stick to a budget for the month', description: 'Track every dollar for 30 days. Financial awareness is the start of financial power.' },
  { id: 'm-m-06', stat: 'mana', tier: 'monthly', title: 'Learn a new skill from scratch', description: 'Pick something you know nothing about and spend a month on it.' },
  { id: 'm-m-07', stat: 'mana', tier: 'monthly', title: 'Write and publish something', description: 'Put your thinking into the world. A blog post, article, or thread — make it public.' },
  { id: 'm-m-08', stat: 'mana', tier: 'monthly', title: 'Audit your career goals and make a plan', description: 'Where are you going? Spend time this month answering that question with honesty.' },
]
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test -- questLibrary.test.ts
```

Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/questLibrary.ts src/lib/__tests__/questLibrary.test.ts
git commit -m "feat: add quest library with 99 quest templates"
```

---

### Task 6: Quest Generation (TDD)

**Files:**
- Create: `src/lib/questGeneration.ts`, `src/lib/__tests__/questGeneration.test.ts`

**Interfaces:**
- Consumes: `questLibrary` from `@/lib/questLibrary`; `Quest`, `QuestTemplate`, `PlayerClass`, `Stat`, `QuestTier` from `@/types`
- Produces:
  - `generateDailyQuests(playerClass: PlayerClass, excludeIds?: string[]): Quest[]`
  - `generateWeeklyQuests(excludeIds?: string[]): Quest[]`
  - `generateMonthlyQuest(playerClass: PlayerClass, excludeIds?: string[]): Quest | null`
  - `rerollQuest(current: Quest, activeQuestIds: string[]): Quest | null`
  - `createCustomQuest(fields: { title: string; description: string; stat: Stat; tier: QuestTier }): Quest`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/questGeneration.test.ts`:

```ts
import {
  generateDailyQuests,
  generateWeeklyQuests,
  generateMonthlyQuest,
  rerollQuest,
  createCustomQuest,
} from '@/lib/questGeneration'

describe('generateDailyQuests', () => {
  it('returns 4 quests for each class', () => {
    expect(generateDailyQuests('knight').length).toBe(4)
    expect(generateDailyQuests('wizard').length).toBe(4)
    expect(generateDailyQuests('bard').length).toBe(4)
  })

  it('returns 2 health quests for knight', () => {
    const quests = generateDailyQuests('knight')
    const healthCount = quests.filter(q => q.stat === 'health').length
    expect(healthCount).toBe(2)
  })

  it('returns 2 mana quests for wizard', () => {
    const quests = generateDailyQuests('wizard')
    expect(quests.filter(q => q.stat === 'mana').length).toBe(2)
  })

  it('returns 2 stamina quests for bard', () => {
    const quests = generateDailyQuests('bard')
    expect(quests.filter(q => q.stat === 'stamina').length).toBe(2)
  })

  it('returns no duplicate quest ids', () => {
    const quests = generateDailyQuests('knight')
    const ids = quests.map(q => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('sets tier to daily and completed to false', () => {
    const quests = generateDailyQuests('knight')
    for (const q of quests) {
      expect(q.tier).toBe('daily')
      expect(q.completed).toBe(false)
      expect(q.isCustom).toBe(false)
      expect(q.xpReward).toBe(10)
    }
  })
})

describe('generateWeeklyQuests', () => {
  it('returns 3 quests — one per stat', () => {
    const quests = generateWeeklyQuests()
    expect(quests.length).toBe(3)
    expect(quests.filter(q => q.stat === 'health').length).toBe(1)
    expect(quests.filter(q => q.stat === 'stamina').length).toBe(1)
    expect(quests.filter(q => q.stat === 'mana').length).toBe(1)
  })

  it('sets xpReward to 50', () => {
    const quests = generateWeeklyQuests()
    for (const q of quests) expect(q.xpReward).toBe(50)
  })
})

describe('generateMonthlyQuest', () => {
  it('returns a single health quest for knight', () => {
    const quest = generateMonthlyQuest('knight')
    expect(quest).not.toBeNull()
    expect(quest!.stat).toBe('health')
    expect(quest!.tier).toBe('monthly')
    expect(quest!.xpReward).toBe(200)
  })

  it('returns a mana quest for wizard', () => {
    expect(generateMonthlyQuest('wizard')!.stat).toBe('mana')
  })

  it('excludes provided ids', () => {
    const allMonthlyHealth = ['h-m-01','h-m-02','h-m-03','h-m-04','h-m-05','h-m-06','h-m-07']
    const quest = generateMonthlyQuest('knight', allMonthlyHealth)
    // only h-m-08 remains
    expect(quest!.id).toBe('h-m-08')
  })
})

describe('rerollQuest', () => {
  it('returns a different quest with same stat and tier', () => {
    const original = generateDailyQuests('knight').find(q => q.stat === 'health')!
    const rerolled = rerollQuest(original, [original.id])
    expect(rerolled).not.toBeNull()
    expect(rerolled!.stat).toBe('health')
    expect(rerolled!.tier).toBe('daily')
    expect(rerolled!.id).not.toBe(original.id)
  })
})

describe('createCustomQuest', () => {
  it('creates a quest with isCustom=true and a unique id', () => {
    const q = createCustomQuest({ title: 'My Quest', description: 'Do it', stat: 'mana', tier: 'daily' })
    expect(q.isCustom).toBe(true)
    expect(q.completed).toBe(false)
    expect(q.xpReward).toBe(10)
    expect(q.title).toBe('My Quest')
  })
})
```

- [ ] **Step 2: Run — confirm fail**

```bash
npm test -- questGeneration.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement src/lib/questGeneration.ts**

```ts
import { v4 as uuidv4 } from 'uuid'
import { questLibrary } from '@/lib/questLibrary'
import type { Quest, QuestTemplate, PlayerClass, Stat, QuestTier } from '@/types'

const XP_REWARDS: Record<QuestTier, number> = { daily: 10, weekly: 50, monthly: 200 }

const CLASS_PRIMARY: Record<PlayerClass, Stat> = { knight: 'health', wizard: 'mana', bard: 'stamina' }
const CLASS_SECONDARY: Record<PlayerClass, Stat> = { knight: 'stamina', wizard: 'health', bard: 'health' }
const CLASS_TERTIARY: Record<PlayerClass, Stat> = { knight: 'mana', wizard: 'stamina', bard: 'mana' }

function pickRandom(templates: QuestTemplate[], excludeIds: string[]): QuestTemplate | null {
  const available = templates.filter(t => !excludeIds.includes(t.id))
  if (!available.length) return null
  return available[Math.floor(Math.random() * available.length)]
}

function fromTemplate(t: QuestTemplate, tier: QuestTier): Quest {
  return { id: t.id, title: t.title, description: t.description, stat: t.stat, tier, xpReward: XP_REWARDS[tier], isCustom: false, completed: false }
}

export function generateDailyQuests(playerClass: PlayerClass, excludeIds: string[] = []): Quest[] {
  const pool = questLibrary.filter(t => t.tier === 'daily')
  const used = [...excludeIds]
  const slots: Stat[] = [CLASS_PRIMARY[playerClass], CLASS_PRIMARY[playerClass], CLASS_SECONDARY[playerClass], CLASS_TERTIARY[playerClass]]
  const quests: Quest[] = []
  for (const stat of slots) {
    const t = pickRandom(pool.filter(p => p.stat === stat), used)
    if (t) { quests.push(fromTemplate(t, 'daily')); used.push(t.id) }
  }
  return quests
}

export function generateWeeklyQuests(excludeIds: string[] = []): Quest[] {
  const pool = questLibrary.filter(t => t.tier === 'weekly')
  const used = [...excludeIds]
  const quests: Quest[] = []
  for (const stat of ['health', 'stamina', 'mana'] as Stat[]) {
    const t = pickRandom(pool.filter(p => p.stat === stat), used)
    if (t) { quests.push(fromTemplate(t, 'weekly')); used.push(t.id) }
  }
  return quests
}

export function generateMonthlyQuest(playerClass: PlayerClass, excludeIds: string[] = []): Quest | null {
  const stat = CLASS_PRIMARY[playerClass]
  const pool = questLibrary.filter(t => t.tier === 'monthly' && t.stat === stat)
  const t = pickRandom(pool, excludeIds)
  return t ? fromTemplate(t, 'monthly') : null
}

export function rerollQuest(current: Quest, activeQuestIds: string[]): Quest | null {
  const pool = questLibrary.filter(t => t.tier === current.tier && t.stat === current.stat)
  const exclude = activeQuestIds.filter(id => id !== current.id)
  const t = pickRandom(pool, exclude)
  return t ? fromTemplate(t, current.tier) : null
}

export function createCustomQuest(fields: { title: string; description: string; stat: Stat; tier: QuestTier }): Quest {
  return { id: uuidv4(), ...fields, xpReward: XP_REWARDS[fields.tier], isCustom: true, completed: false }
}
```

- [ ] **Step 4: Run — confirm pass**

```bash
npm test -- questGeneration.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/questGeneration.ts src/lib/__tests__/questGeneration.test.ts
git commit -m "feat: add quest generation and reroll logic"
```

---

### Task 7: Reset Logic (TDD)

**Files:**
- Create: `src/lib/resets.ts`, `src/lib/__tests__/resets.test.ts`

**Interfaces:**
- Produces:
  - `isNewDay(lastReset: string, now?: Date): boolean`
  - `isNewWeek(lastReset: string, now?: Date): boolean`
  - `isNewMonth(lastReset: string, now?: Date): boolean`
  - `isSleepCheckInDue(lastCheckedDate: string, now?: Date): boolean`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/resets.test.ts`:

```ts
import { isNewDay, isNewWeek, isNewMonth, isSleepCheckInDue } from '@/lib/resets'

const d = (s: string) => new Date(s)

describe('isNewDay', () => {
  it('returns false same day', () => {
    expect(isNewDay('2026-06-22T08:00:00Z', d('2026-06-22T20:00:00Z'))).toBe(false)
  })
  it('returns true next day', () => {
    expect(isNewDay('2026-06-22T08:00:00Z', d('2026-06-23T08:00:00Z'))).toBe(true)
  })
  it('returns true next month', () => {
    expect(isNewDay('2026-06-30T08:00:00Z', d('2026-07-01T08:00:00Z'))).toBe(true)
  })
})

describe('isNewWeek', () => {
  it('returns false same week (Mon–Sun)', () => {
    // 2026-06-22 is Monday, 2026-06-28 is Sunday
    expect(isNewWeek('2026-06-22T08:00:00Z', d('2026-06-28T08:00:00Z'))).toBe(false)
  })
  it('returns true next Monday', () => {
    expect(isNewWeek('2026-06-22T08:00:00Z', d('2026-06-29T08:00:00Z'))).toBe(true)
  })
})

describe('isNewMonth', () => {
  it('returns false same month', () => {
    expect(isNewMonth('2026-06-01T00:00:00Z', d('2026-06-30T23:59:59Z'))).toBe(false)
  })
  it('returns true next month', () => {
    expect(isNewMonth('2026-06-01T00:00:00Z', d('2026-07-01T00:00:00Z'))).toBe(true)
  })
})

describe('isSleepCheckInDue', () => {
  it('returns true when last checked was yesterday', () => {
    expect(isSleepCheckInDue('2026-06-21', d('2026-06-22T09:00:00Z'))).toBe(true)
  })
  it('returns false when already checked today', () => {
    expect(isSleepCheckInDue('2026-06-22', d('2026-06-22T09:00:00Z'))).toBe(false)
  })
})
```

- [ ] **Step 2: Run — confirm fail**

```bash
npm test -- resets.test.ts
```

- [ ] **Step 3: Implement src/lib/resets.ts**

```ts
function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getMondayOf(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export function isNewDay(lastReset: string, now: Date = new Date()): boolean {
  return !sameDay(new Date(lastReset), now)
}

export function isNewWeek(lastReset: string, now: Date = new Date()): boolean {
  return getMondayOf(now).getTime() > getMondayOf(new Date(lastReset)).getTime()
}

export function isNewMonth(lastReset: string, now: Date = new Date()): boolean {
  const last = new Date(lastReset)
  return now.getFullYear() !== last.getFullYear() || now.getMonth() !== last.getMonth()
}

export function isSleepCheckInDue(lastCheckedDate: string, now: Date = new Date()): boolean {
  return isNewDay(lastCheckedDate, now)
}
```

- [ ] **Step 4: Run — confirm pass**

```bash
npm test -- resets.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/resets.ts src/lib/__tests__/resets.test.ts
git commit -m "feat: add daily/weekly/monthly reset detection"
```

---

### Task 8: Avatars

**Files:**
- Create: `src/lib/avatars.ts`

**Interfaces:**
- Produces: `avatars: AvatarDefinition[]` — list of `{ id, label, component }` used in onboarding and character sheet.

- [ ] **Step 1: Write src/lib/avatars.ts**

```tsx
'use client'
import type { AvatarDefinition } from '@/types'

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4L6 10v12c0 8 6 13 14 16 8-3 14-8 14-16V10L20 4z" fill="currentColor" opacity="0.9"/>
    <path d="M20 4L6 10v12c0 8 6 13 14 16 8-3 14-8 14-16V10L20 4z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5"/>
  </svg>
)

const Staff = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4l-4 4 4 4 4-4-4-4z" fill="currentColor"/>
    <line x1="20" y1="12" x2="20" y2="36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="20" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
  </svg>
)

const Lute = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="26" rx="10" ry="10" fill="currentColor" opacity="0.85"/>
    <path d="M20 16L26 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="26" cy="8" r="2.5" fill="currentColor"/>
    <line x1="14" y1="22" x2="26" y2="30" stroke="white" strokeWidth="0.8" opacity="0.5"/>
  </svg>
)

const Dagger = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 6l-4 20 2 2 2-2L26 6h-4z" fill="currentColor"/>
    <rect x="15" y="24" width="10" height="3" rx="1" fill="currentColor" opacity="0.7"/>
    <rect x="18" y="27" width="4" height="7" rx="1" fill="currentColor" opacity="0.5"/>
  </svg>
)

const Bow = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 8 Q28 20 10 32" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <line x1="10" y1="8" x2="10" y2="32" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" opacity="0.6"/>
    <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <polygon points="30,20 26,18 26,22" fill="currentColor"/>
  </svg>
)

const Crown = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 28h28V32H6z" fill="currentColor" opacity="0.8"/>
    <path d="M6 28L10 14l10 10L20 10l10 14 4-10v14H6z" fill="currentColor" opacity="0.9"/>
    <circle cx="6" cy="14" r="2" fill="currentColor"/>
    <circle cx="34" cy="14" r="2" fill="currentColor"/>
    <circle cx="20" cy="10" r="2" fill="currentColor"/>
  </svg>
)

const Flame = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6c0 0-10 8-10 18a10 10 0 0020 0c0-5-3-8-3-8s0 6-4 8c0 0 4-10-3-18z" fill="currentColor"/>
    <path d="M20 22c0 0-4 2-4 6a4 4 0 008 0c0-3-2-4-2-4s0 3-2 4c0 0 2-5 0-6z" fill="white" opacity="0.4"/>
  </svg>
)

const Scroll = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="8" width="20" height="26" rx="3" fill="currentColor" opacity="0.85"/>
    <rect x="10" y="8" width="20" height="4" rx="2" fill="currentColor"/>
    <rect x="10" y="30" width="20" height="4" rx="2" fill="currentColor"/>
    <line x1="15" y1="16" x2="25" y2="16" stroke="white" strokeWidth="1.2" opacity="0.5"/>
    <line x1="15" y1="20" x2="25" y2="20" stroke="white" strokeWidth="1.2" opacity="0.5"/>
    <line x1="15" y1="24" x2="22" y2="24" stroke="white" strokeWidth="1.2" opacity="0.5"/>
  </svg>
)

export const avatars: AvatarDefinition[] = [
  { id: 'shield',  label: 'Knight',    component: Shield },
  { id: 'staff',   label: 'Wizard',    component: Staff },
  { id: 'lute',    label: 'Bard',      component: Lute },
  { id: 'dagger',  label: 'Rogue',     component: Dagger },
  { id: 'bow',     label: 'Ranger',    component: Bow },
  { id: 'crown',   label: 'Sovereign', component: Crown },
  { id: 'flame',   label: 'Warlock',   component: Flame },
  { id: 'scroll',  label: 'Scholar',   component: Scroll },
]

export function getAvatar(id: string): AvatarDefinition {
  return avatars.find(a => a.id === id) ?? avatars[0]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/avatars.ts
git commit -m "feat: add avatar definitions with inline SVG components"
```

---

### Task 9: Zustand Store

**Files:**
- Create: `src/store/index.ts`

**Interfaces:**
- Consumes: all types from `@/types`; `applyXpGain`, `applySleepBuff` from `@/lib/xp`; generation functions from `@/lib/questGeneration`; bar point constants from `@/lib/barPoints`; reset detectors from `@/lib/resets`; `xpToNextLevel` from `@/lib/xp`
- Produces: `useGameStore` hook — all state and actions consumed by every component

- [ ] **Step 1: Write src/store/index.ts**

```ts
'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Player, Quest, MonthlyBar, SleepBuff, Onboarding, Resets, Stat, QuestTier, PlayerClass } from '@/types'
import { applyXpGain, applySleepBuff, xpToNextLevel } from '@/lib/xp'
import { DAILY_BAR_PTS, WEEKLY_BAR_PTS, MONTHLY_BAR_PTS } from '@/lib/barPoints'
import {
  generateDailyQuests,
  generateWeeklyQuests,
  generateMonthlyQuest,
  rerollQuest as rerollQuestLib,
  createCustomQuest,
} from '@/lib/questGeneration'
import { isNewDay, isNewWeek, isNewMonth, isSleepCheckInDue } from '@/lib/resets'

const NOW = () => new Date().toISOString()

interface GameState {
  player: Player | null
  dailyQuests: Quest[]
  weeklyQuests: Quest[]
  monthlyQuest: Quest | null
  monthlyBar: MonthlyBar
  sleepBuff: SleepBuff
  onboarding: Onboarding
  resets: Resets
  leveledUp: boolean

  // Onboarding
  setOnboardingStep: (step: number) => void
  completeOnboarding: (player: Player) => void

  // Sleep
  activateSleepBuff: () => void
  dismissSleepCheckIn: () => void

  // Quests
  completeQuest: (questId: string, tier: QuestTier) => void
  rerollQuest: (questId: string, tier: QuestTier) => void
  addCustomQuest: (fields: { title: string; description: string; stat: Stat; tier: QuestTier }) => void

  // Player
  setClass: (playerClass: PlayerClass) => void
  dismissLevelUp: () => void

  // Resets
  checkAndApplyResets: () => void
}

const INITIAL_MONTHLY_BAR: MonthlyBar = { health: 0, stamina: 0, mana: 0, monthStartDate: NOW() }
const INITIAL_SLEEP_BUFF: SleepBuff = { isActive: false, lastCheckedDate: '' }
const INITIAL_ONBOARDING: Onboarding = { isComplete: false, currentStep: 0 }
const INITIAL_RESETS: Resets = { lastDailyReset: NOW(), lastWeeklyReset: NOW(), lastMonthlyReset: NOW() }

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: null,
      dailyQuests: [],
      weeklyQuests: [],
      monthlyQuest: null,
      monthlyBar: INITIAL_MONTHLY_BAR,
      sleepBuff: INITIAL_SLEEP_BUFF,
      onboarding: INITIAL_ONBOARDING,
      resets: INITIAL_RESETS,
      leveledUp: false,

      setOnboardingStep: (step) =>
        set(s => ({ onboarding: { ...s.onboarding, currentStep: step } })),

      completeOnboarding: (player) => {
        const daily = generateDailyQuests(player.class)
        const weekly = generateWeeklyQuests()
        const monthly = generateMonthlyQuest(player.class)
        set({
          player,
          dailyQuests: daily,
          weeklyQuests: weekly,
          monthlyQuest: monthly,
          onboarding: { isComplete: true, currentStep: 5 },
          resets: { lastDailyReset: NOW(), lastWeeklyReset: NOW(), lastMonthlyReset: NOW() },
          monthlyBar: { ...INITIAL_MONTHLY_BAR, monthStartDate: NOW() },
        })
      },

      activateSleepBuff: () =>
        set({ sleepBuff: { isActive: true, lastCheckedDate: new Date().toDateString() } }),

      dismissSleepCheckIn: () =>
        set(s => ({ sleepBuff: { ...s.sleepBuff, lastCheckedDate: new Date().toDateString() } })),

      completeQuest: (questId, tier) => {
        const { player, dailyQuests, weeklyQuests, monthlyQuest, monthlyBar, sleepBuff } = get()
        if (!player) return

        let quest: Quest | undefined
        if (tier === 'daily') quest = dailyQuests.find(q => q.id === questId)
        else if (tier === 'weekly') quest = weeklyQuests.find(q => q.id === questId)
        else if (tier === 'monthly') quest = monthlyQuest ?? undefined

        if (!quest || quest.completed) return

        const earnedXp = applySleepBuff(quest.xpReward, sleepBuff.isActive)
        const { player: updatedPlayer, leveledUp } = applyXpGain(player, earnedXp, quest.stat)

        const barPts = tier === 'daily' ? DAILY_BAR_PTS : tier === 'weekly' ? WEEKLY_BAR_PTS : MONTHLY_BAR_PTS
        const updatedBar = { ...monthlyBar, [quest.stat]: monthlyBar[quest.stat] + barPts }

        const markDone = (q: Quest) => q.id === questId ? { ...q, completed: true } : q

        set({
          player: updatedPlayer,
          leveledUp,
          monthlyBar: updatedBar,
          dailyQuests: tier === 'daily' ? dailyQuests.map(markDone) : dailyQuests,
          weeklyQuests: tier === 'weekly' ? weeklyQuests.map(markDone) : weeklyQuests,
          monthlyQuest: tier === 'monthly' && monthlyQuest ? { ...monthlyQuest, completed: true } : monthlyQuest,
        })
      },

      rerollQuest: (questId, tier) => {
        const { dailyQuests, weeklyQuests, monthlyQuest } = get()
        const allActive = [...dailyQuests, ...weeklyQuests, ...(monthlyQuest ? [monthlyQuest] : [])].map(q => q.id)

        let current: Quest | undefined
        if (tier === 'daily') current = dailyQuests.find(q => q.id === questId)
        else if (tier === 'weekly') current = weeklyQuests.find(q => q.id === questId)
        else current = monthlyQuest ?? undefined

        if (!current) return
        const replacement = rerollQuestLib(current, allActive)
        if (!replacement) return

        if (tier === 'daily') set({ dailyQuests: dailyQuests.map(q => q.id === questId ? replacement : q) })
        else if (tier === 'weekly') set({ weeklyQuests: weeklyQuests.map(q => q.id === questId ? replacement : q) })
        else set({ monthlyQuest: replacement })
      },

      addCustomQuest: (fields) => {
        if (fields.title.length > 80 || fields.description.length > 280) return
        const quest = createCustomQuest(fields)
        const { dailyQuests, weeklyQuests, monthlyQuest } = get()
        if (fields.tier === 'daily') set({ dailyQuests: [...dailyQuests, quest] })
        else if (fields.tier === 'weekly') set({ weeklyQuests: [...weeklyQuests, quest] })
        else set({ monthlyQuest: quest })
      },

      setClass: (playerClass) => {
        const { player } = get()
        if (!player) return
        set({ player: { ...player, class: playerClass } })
      },

      dismissLevelUp: () => set({ leveledUp: false }),

      checkAndApplyResets: () => {
        const { resets, player, dailyQuests, weeklyQuests, monthlyBar } = get()
        if (!player) return
        const now = new Date()
        let updates: Partial<GameState> = {}

        if (isNewDay(resets.lastDailyReset, now)) {
          updates.dailyQuests = generateDailyQuests(player.class)
          updates.resets = { ...resets, lastDailyReset: now.toISOString() }
        }

        if (isNewWeek(resets.lastWeeklyReset, now)) {
          updates.weeklyQuests = generateWeeklyQuests()
          updates.resets = { ...(updates.resets ?? resets), lastWeeklyReset: now.toISOString() }
        }

        if (isNewMonth(resets.lastMonthlyReset, now)) {
          updates.monthlyQuest = generateMonthlyQuest(player.class)
          updates.monthlyBar = { health: 0, stamina: 0, mana: 0, monthStartDate: now.toISOString() }
          updates.resets = { ...(updates.resets ?? resets), lastMonthlyReset: now.toISOString() }
        }

        if (Object.keys(updates).length > 0) set(updates as GameState)
      },
    }),
    { name: 'sidequest', skipHydration: true }
  )
)
```

- [ ] **Step 2: Commit**

```bash
git add src/store/index.ts
git commit -m "feat: add Zustand store with all game state and actions"
```

---

### Task 10: ClientOnly & LevelUpBanner

**Files:**
- Create: `src/components/ui/ClientOnly.tsx`, `src/components/ui/LevelUpBanner.tsx`

**Interfaces:**
- `ClientOnly` — renders `children` only after mount (prevents SSR hydration mismatch)
- `LevelUpBanner` — shown briefly when `leveledUp` is true in store; calls `dismissLevelUp` after timeout

- [ ] **Step 1: Write src/components/ui/ClientOnly.tsx**

```tsx
'use client'
import { useEffect, useState } from 'react'

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    useGameStoreHydrate()
    setMounted(true)
  }, [])
  if (!mounted) return null
  return <>{children}</>
}

// Trigger Zustand rehydration from localStorage on first client render
function useGameStoreHydrate() {
  // Import inline to avoid circular issues at module level
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useGameStore } = require('@/store')
  useGameStore.persist.rehydrate()
}
```

- [ ] **Step 2: Write src/components/ui/LevelUpBanner.tsx**

```tsx
'use client'
import { useEffect } from 'react'
import { useGameStore } from '@/store'

export function LevelUpBanner() {
  const leveledUp = useGameStore(s => s.leveledUp)
  const player = useGameStore(s => s.player)
  const dismiss = useGameStore(s => s.dismissLevelUp)

  useEffect(() => {
    if (!leveledUp) return
    const t = setTimeout(dismiss, 3000)
    return () => clearTimeout(t)
  }, [leveledUp, dismiss])

  if (!leveledUp || !player) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-violet-600 text-white px-8 py-6 rounded-2xl shadow-2xl text-center animate-bounce">
        <div className="text-3xl mb-1">⬆️</div>
        <div className="text-xl font-bold">Level Up!</div>
        <div className="text-violet-200 mt-1">You are now level {player.level}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ClientOnly.tsx src/components/ui/LevelUpBanner.tsx
git commit -m "feat: add ClientOnly hydration guard and LevelUpBanner"
```

---

### Task 11: Onboarding Components

**Files:**
- Create: `src/components/onboarding/WelcomeStep.tsx`, `NameStep.tsx`, `AvatarStep.tsx`, `ClassStep.tsx`, `StatsIntroStep.tsx`, `OnboardingFlow.tsx`

**Interfaces:**
- Consumes: `useGameStore` for `setOnboardingStep`, `completeOnboarding`; `avatars` from `@/lib/avatars`
- Produces: `<OnboardingFlow />` — full onboarding experience, self-contained

All onboarding components take `onNext: () => void` and optionally `onBack: () => void`.

- [ ] **Step 1: Write src/components/onboarding/WelcomeStep.tsx**

```tsx
'use client'

interface Props { onNext: () => void }

export function WelcomeStep({ onNext }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white px-6 text-center">
      <div className="text-6xl mb-4">⚔️</div>
      <h1 className="text-4xl font-bold text-violet-400 mb-2">SideQuest</h1>
      <p className="text-gray-400 text-lg mb-8">Your life. Your quest board.</p>
      <button
        onClick={onNext}
        className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-8 rounded-xl text-lg transition-colors"
      >
        Begin your quest
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Write src/components/onboarding/NameStep.tsx**

```tsx
'use client'
import { useState } from 'react'

interface Props { onNext: (name: string) => void; onBack: () => void }

export function NameStep({ onNext, onBack }: Props) {
  const [name, setName] = useState('')
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white px-6">
      <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white">← Back</button>
      <h2 className="text-2xl font-bold mb-2">What is your name, adventurer?</h2>
      <p className="text-gray-400 mb-6">This will appear on your character sheet.</p>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter your name"
        maxLength={30}
        className="bg-gray-800 text-white rounded-xl px-4 py-3 text-lg w-full max-w-sm mb-6 outline-none focus:ring-2 focus:ring-violet-500"
      />
      <button
        onClick={() => name.trim() && onNext(name.trim())}
        disabled={!name.trim()}
        className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold py-3 px-8 rounded-xl text-lg transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Write src/components/onboarding/AvatarStep.tsx**

```tsx
'use client'
import { useState } from 'react'
import { avatars } from '@/lib/avatars'

interface Props { onNext: (avatarId: string) => void; onBack: () => void }

export function AvatarStep({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState(avatars[0].id)
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-white px-6 pt-16">
      <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white">← Back</button>
      <h2 className="text-2xl font-bold mb-2">Choose your avatar</h2>
      <p className="text-gray-400 mb-8">Pick the icon that represents you.</p>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {avatars.map(avatar => {
          const Icon = avatar.component
          return (
            <button
              key={avatar.id}
              onClick={() => setSelected(avatar.id)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                selected === avatar.id
                  ? 'bg-violet-600 ring-2 ring-violet-400'
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-10 h-10 text-white mb-1" />
              <span className="text-xs text-gray-300">{avatar.label}</span>
            </button>
          )
        })}
      </div>
      <button
        onClick={() => onNext(selected)}
        className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-8 rounded-xl text-lg transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
```

- [ ] **Step 4: Write src/components/onboarding/ClassStep.tsx**

```tsx
'use client'
import { useState } from 'react'
import type { PlayerClass } from '@/types'

interface Props { onNext: (cls: PlayerClass) => void; onBack: () => void }

const CLASSES: { id: PlayerClass; name: string; primary: string; flavor: string; icon: string }[] = [
  { id: 'knight', name: 'Knight', primary: '❤️ Health', flavor: 'Forge your body. Health is your foundation.', icon: '🛡️' },
  { id: 'wizard', name: 'Wizard', primary: '🔮 Mana', flavor: 'Knowledge is power. Shape your future.', icon: '🧙' },
  { id: 'bard', name: 'Bard', primary: '⚡ Stamina', flavor: 'Life is lived outward. Connection fuels everything.', icon: '🎵' },
]

export function ClassStep({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<PlayerClass>('knight')
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-white px-6 pt-16">
      <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white">← Back</button>
      <h2 className="text-2xl font-bold mb-2">Choose your class</h2>
      <p className="text-gray-400 mb-8">Your class shapes your quest board. You can change it anytime.</p>
      <div className="flex flex-col gap-4 w-full max-w-sm mb-8">
        {CLASSES.map(cls => (
          <button
            key={cls.id}
            onClick={() => setSelected(cls.id)}
            className={`text-left p-4 rounded-xl transition-all ${
              selected === cls.id ? 'bg-violet-700 ring-2 ring-violet-400' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{cls.icon}</span>
              <span className="font-bold text-lg">{cls.name}</span>
              <span className="ml-auto text-sm text-violet-300">{cls.primary}</span>
            </div>
            <p className="text-gray-400 text-sm italic">{cls.flavor}</p>
          </button>
        ))}
      </div>
      <button
        onClick={() => onNext(selected)}
        className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-8 rounded-xl text-lg transition-colors"
      >
        Continue
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Write src/components/onboarding/StatsIntroStep.tsx**

```tsx
'use client'

interface Props { onNext: () => void; onBack: () => void }

const PANELS = [
  { icon: '❤️', stat: 'Health', description: 'Physical wellbeing — exercise, nutrition, sleep, recovery. The foundation of everything else.' },
  { icon: '⚡', stat: 'Stamina', description: 'Social wellbeing — connection, adventure, relationships, and being present in the world.' },
  { icon: '🔮', stat: 'Mana', description: 'Personal agency — knowledge, skills, finances, and your ability to shape your future.' },
]

export function StatsIntroStep({ onNext, onBack }: Props) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-white px-6 pt-16">
      <button onClick={onBack} className="absolute top-6 left-6 text-gray-400 hover:text-white">← Back</button>
      <h2 className="text-2xl font-bold mb-2">Your three stats</h2>
      <p className="text-gray-400 mb-8">Complete quests to grow them. Your class shapes which quests you see most.</p>
      <div className="flex flex-col gap-4 w-full max-w-sm mb-10">
        {PANELS.map(p => (
          <div key={p.stat} className="bg-gray-800 rounded-xl p-4 flex gap-4">
            <span className="text-3xl">{p.icon}</span>
            <div>
              <div className="font-bold text-lg">{p.stat}</div>
              <p className="text-gray-400 text-sm">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 px-8 rounded-xl text-lg transition-colors"
      >
        Got it — show me my quests
      </button>
    </div>
  )
}
```

- [ ] **Step 6: Write src/components/onboarding/OnboardingFlow.tsx**

```tsx
'use client'
import { useState } from 'react'
import { useGameStore } from '@/store'
import { xpToNextLevel } from '@/lib/xp'
import type { PlayerClass } from '@/types'
import { WelcomeStep } from './WelcomeStep'
import { NameStep } from './NameStep'
import { AvatarStep } from './AvatarStep'
import { ClassStep } from './ClassStep'
import { StatsIntroStep } from './StatsIntroStep'

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [avatarId, setAvatarId] = useState('shield')
  const [playerClass, setPlayerClass] = useState<PlayerClass>('knight')
  const completeOnboarding = useGameStore(s => s.completeOnboarding)

  const finish = () => {
    completeOnboarding({
      name,
      avatarId,
      class: playerClass,
      level: 1,
      totalXP: 0,
      xpToNextLevel: xpToNextLevel(1),
      stats: { health: 0, stamina: 0, mana: 0 },
    })
  }

  if (step === 0) return <WelcomeStep onNext={() => setStep(1)} />
  if (step === 1) return <NameStep onNext={(n) => { setName(n); setStep(2) }} onBack={() => setStep(0)} />
  if (step === 2) return <AvatarStep onNext={(a) => { setAvatarId(a); setStep(3) }} onBack={() => setStep(1)} />
  if (step === 3) return <ClassStep onNext={(c) => { setPlayerClass(c); setStep(4) }} onBack={() => setStep(2)} />
  return <StatsIntroStep onNext={finish} onBack={() => setStep(3)} />
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/onboarding/
git commit -m "feat: add onboarding flow with all 5 steps"
```

---

### Task 12: StatBar Component

**Files:**
- Create: `src/components/dashboard/StatBar.tsx`

**Interfaces:**
- Consumes: `Stat`, `PlayerClass` from `@/types`; `getBarPercent`, `getBarWidthClass` from `@/lib/barPoints`
- Props: `stat: Stat`, `playerClass: PlayerClass`, `points: number`, `careerXp: number`

- [ ] **Step 1: Write src/components/dashboard/StatBar.tsx**

```tsx
'use client'
import { getBarPercent, getBarWidthClass, getBarConfig } from '@/lib/barPoints'
import type { Stat, PlayerClass } from '@/types'

const STAT_META: Record<Stat, { icon: string; label: string; color: string }> = {
  health:  { icon: '❤️', label: 'Health',  color: 'bg-rose-500' },
  stamina: { icon: '⚡', label: 'Stamina', color: 'bg-amber-400' },
  mana:    { icon: '🔮', label: 'Mana',    color: 'bg-violet-500' },
}

interface Props {
  stat: Stat
  playerClass: PlayerClass
  points: number
  careerXp: number
}

export function StatBar({ stat, playerClass, points, careerXp }: Props) {
  const { icon, label, color } = STAT_META[stat]
  const percent = getBarPercent(points, stat, playerClass)
  const widthClass = getBarWidthClass(stat, playerClass)
  const { fillAt } = getBarConfig(stat, playerClass)

  return (
    <div className={`${widthClass}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium flex items-center gap-1">
          <span>{icon}</span>
          <span className="text-gray-300">{label}</span>
        </span>
        <span className="text-xs text-gray-500">{points}/{fillAt}</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-xs text-gray-600 mt-0.5">Career: {careerXp.toLocaleString()} XP</div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/StatBar.tsx
git commit -m "feat: add StatBar component with dynamic width for preferred stat"
```

---

### Task 13: CharacterSheet Component

**Files:**
- Create: `src/components/dashboard/CharacterSheet.tsx`

**Interfaces:**
- Consumes: `useGameStore` (player, monthlyBar, sleepBuff); `StatBar`; `getAvatar` from `@/lib/avatars`

- [ ] **Step 1: Write src/components/dashboard/CharacterSheet.tsx**

```tsx
'use client'
import { useGameStore } from '@/store'
import { StatBar } from './StatBar'
import { getAvatar } from '@/lib/avatars'

export function CharacterSheet() {
  const player = useGameStore(s => s.player)
  const monthlyBar = useGameStore(s => s.monthlyBar)
  const sleepBuff = useGameStore(s => s.sleepBuff)

  if (!player) return null

  const avatar = getAvatar(player.avatarId)
  const AvatarIcon = avatar.component
  const CLASS_LABELS = { knight: 'Knight', wizard: 'Wizard', bard: 'Bard' }

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-4 pt-4 pb-5">
      {/* Identity row */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-violet-400 flex-shrink-0">
          <AvatarIcon className="w-8 h-8" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white truncate">{player.name}</span>
            <span className="text-xs bg-violet-800 text-violet-300 px-2 py-0.5 rounded-full flex-shrink-0">
              {CLASS_LABELS[player.class]}
            </span>
          </div>
          <div className="text-sm text-gray-400">Level {player.level}</div>
        </div>
        {/* Sleep buff */}
        <div
          className={`text-xl transition-opacity ${sleepBuff.isActive ? 'opacity-100' : 'opacity-30'}`}
          title={sleepBuff.isActive ? 'Enlightened: +20% XP' : 'Rest to gain the Enlightened buff'}
        >
          ✨
        </div>
      </div>

      {/* Stat bars */}
      <div className="flex flex-col gap-3">
        {(['health', 'stamina', 'mana'] as const).map(stat => (
          <StatBar
            key={stat}
            stat={stat}
            playerClass={player.class}
            points={monthlyBar[stat]}
            careerXp={player.stats[stat]}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/CharacterSheet.tsx
git commit -m "feat: add CharacterSheet component"
```

---

### Task 14: Quest Cards

**Files:**
- Create: `src/components/dashboard/DailyQuestRow.tsx`, `WeeklyQuestCard.tsx`, `MonthlyQuestCard.tsx`

**Interfaces:**
- All consume `Quest` from `@/types` and call `completeQuest` / `rerollQuest` from `useGameStore`

- [ ] **Step 1: Write src/components/dashboard/DailyQuestRow.tsx**

```tsx
'use client'
import { useGameStore } from '@/store'
import type { Quest } from '@/types'

const STAT_ICONS = { health: '❤️', stamina: '⚡', mana: '🔮' }

interface Props { quest: Quest }

export function DailyQuestRow({ quest }: Props) {
  const complete = useGameStore(s => s.completeQuest)
  const reroll = useGameStore(s => s.rerollQuest)

  return (
    <div className={`flex items-center gap-3 py-3 px-4 rounded-xl ${quest.completed ? 'opacity-50' : 'bg-gray-800'}`}>
      <button
        onClick={() => !quest.completed && complete(quest.id, 'daily')}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          quest.completed ? 'bg-violet-600 border-violet-600' : 'border-gray-500 hover:border-violet-400'
        }`}
      >
        {quest.completed && <span className="text-white text-xs">✓</span>}
      </button>
      <span className="text-base flex-shrink-0">{STAT_ICONS[quest.stat]}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{quest.title}</div>
        <div className="text-xs text-gray-500">+{quest.xpReward} XP</div>
      </div>
      {!quest.completed && (
        <button
          onClick={() => reroll(quest.id, 'daily')}
          className="text-gray-600 hover:text-gray-300 text-lg flex-shrink-0"
          title="Reroll quest"
        >
          🎲
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Write src/components/dashboard/WeeklyQuestCard.tsx**

```tsx
'use client'
import { useGameStore } from '@/store'
import type { Quest } from '@/types'

const STAT_ICONS = { health: '❤️', stamina: '⚡', mana: '🔮' }

interface Props { quest: Quest }

export function WeeklyQuestCard({ quest }: Props) {
  const complete = useGameStore(s => s.completeQuest)
  const reroll = useGameStore(s => s.rerollQuest)

  return (
    <div className={`bg-gray-800 rounded-xl p-4 ${quest.completed ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span>{STAT_ICONS[quest.stat]}</span>
          <span className="font-semibold text-white">{quest.title}</span>
        </div>
        {!quest.completed && (
          <button onClick={() => reroll(quest.id, 'weekly')} className="text-gray-500 hover:text-gray-300 flex-shrink-0" title="Reroll">🎲</button>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-3">{quest.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-violet-400">+{quest.xpReward} XP</span>
        {!quest.completed ? (
          <button onClick={() => complete(quest.id, 'weekly')} className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
            Complete
          </button>
        ) : (
          <span className="text-green-500 text-sm">✓ Done</span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write src/components/dashboard/MonthlyQuestCard.tsx**

```tsx
'use client'
import { useGameStore } from '@/store'

const STAT_ICONS = { health: '❤️', stamina: '⚡', mana: '🔮' }

export function MonthlyQuestCard() {
  const quest = useGameStore(s => s.monthlyQuest)
  const complete = useGameStore(s => s.completeQuest)
  const reroll = useGameStore(s => s.rerollQuest)

  if (!quest) return null

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-2xl p-5 ${quest.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Monthly Quest</span>
        <span className="text-xs text-gray-500">+{quest.xpReward} XP</span>
      </div>
      <div className="flex items-start gap-2 mb-2">
        <span className="text-2xl">{STAT_ICONS[quest.stat]}</span>
        <h3 className="text-lg font-bold text-white leading-snug">{quest.title}</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">{quest.description}</p>
      {/* Progress bar — fills when completed */}
      <div className="h-2 bg-gray-700 rounded-full mb-4">
        <div className={`h-full rounded-full transition-all duration-700 bg-violet-500 ${quest.completed ? 'w-full' : 'w-0'}`} />
      </div>
      <div className="flex gap-3">
        {!quest.completed ? (
          <>
            <button onClick={() => complete(quest.id, 'monthly')} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2 rounded-xl transition-colors">
              Complete
            </button>
            <button onClick={() => reroll(quest.id, 'monthly')} className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-xl transition-colors" title="Reroll">
              🎲
            </button>
          </>
        ) : (
          <div className="flex-1 text-center text-green-500 font-semibold py-2">✓ Quest Complete</div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/DailyQuestRow.tsx src/components/dashboard/WeeklyQuestCard.tsx src/components/dashboard/MonthlyQuestCard.tsx
git commit -m "feat: add daily, weekly, and monthly quest card components"
```

---

### Task 15: Modals

**Files:**
- Create: `src/components/modals/SleepCheckInModal.tsx`, `src/components/modals/QuestCreationModal.tsx`

- [ ] **Step 1: Write src/components/modals/SleepCheckInModal.tsx**

```tsx
'use client'
import { useGameStore } from '@/store'
import { isSleepCheckInDue } from '@/lib/resets'

export function SleepCheckInModal() {
  const sleepBuff = useGameStore(s => s.sleepBuff)
  const activate = useGameStore(s => s.activateSleepBuff)
  const dismiss = useGameStore(s => s.dismissSleepCheckIn)

  const isDue = isSleepCheckInDue(sleepBuff.lastCheckedDate)
  if (!isDue) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 px-6">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">✨</div>
        <h2 className="text-xl font-bold text-white mb-2">Good morning, adventurer</h2>
        <p className="text-gray-400 mb-6">Did you sleep 6–8 hours last night?</p>
        <div className="flex gap-3">
          <button
            onClick={dismiss}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-3 rounded-xl transition-colors"
          >
            No
          </button>
          <button
            onClick={activate}
            className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Yes ✨
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write src/components/modals/QuestCreationModal.tsx**

```tsx
'use client'
import { useState } from 'react'
import { useGameStore } from '@/store'
import type { Stat, QuestTier } from '@/types'

interface Props { onClose: () => void }

export function QuestCreationModal({ onClose }: Props) {
  const addCustomQuest = useGameStore(s => s.addCustomQuest)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stat, setStat] = useState<Stat>('health')
  const [tier, setTier] = useState<QuestTier>('daily')

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return
    addCustomQuest({ title: title.trim(), description: description.trim(), stat, tier })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-40">
      <div className="bg-gray-900 border border-gray-700 rounded-t-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">New Custom Quest</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <label className="block text-sm text-gray-400 mb-1">Quest title <span className="text-gray-600">({title.length}/80)</span></label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={80}
          placeholder="What will you do?"
          className="bg-gray-800 text-white rounded-xl px-4 py-2.5 w-full mb-4 outline-none focus:ring-2 focus:ring-violet-500 text-sm"
        />

        <label className="block text-sm text-gray-400 mb-1">Description <span className="text-gray-600">({description.length}/280)</span></label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={280}
          placeholder="Why does this matter?"
          rows={3}
          className="bg-gray-800 text-white rounded-xl px-4 py-2.5 w-full mb-4 outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none"
        />

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Stat</label>
            <select value={stat} onChange={e => setStat(e.target.value as Stat)} className="bg-gray-800 text-white rounded-xl px-3 py-2.5 w-full text-sm outline-none focus:ring-2 focus:ring-violet-500">
              <option value="health">❤️ Health</option>
              <option value="stamina">⚡ Stamina</option>
              <option value="mana">🔮 Mana</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Tier</label>
            <select value={tier} onChange={e => setTier(e.target.value as QuestTier)} className="bg-gray-800 text-white rounded-xl px-3 py-2.5 w-full text-sm outline-none focus:ring-2 focus:ring-violet-500">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !description.trim()}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          Add Quest
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/modals/
git commit -m "feat: add sleep check-in and quest creation modals"
```

---

### Task 16: Dashboard Assembly

**Files:**
- Create: `src/components/dashboard/Dashboard.tsx`

- [ ] **Step 1: Write src/components/dashboard/Dashboard.tsx**

```tsx
'use client'
import { useState } from 'react'
import { useGameStore } from '@/store'
import { CharacterSheet } from './CharacterSheet'
import { MonthlyQuestCard } from './MonthlyQuestCard'
import { WeeklyQuestCard } from './WeeklyQuestCard'
import { DailyQuestRow } from './DailyQuestRow'
import { SleepCheckInModal } from '@/components/modals/SleepCheckInModal'
import { QuestCreationModal } from '@/components/modals/QuestCreationModal'
import { LevelUpBanner } from '@/components/ui/LevelUpBanner'

export function Dashboard() {
  const dailyQuests = useGameStore(s => s.dailyQuests)
  const weeklyQuests = useGameStore(s => s.weeklyQuests)
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-24">
      <CharacterSheet />

      <div className="px-4 pt-5 flex flex-col gap-5">
        {/* Monthly */}
        <section>
          <MonthlyQuestCard />
        </section>

        {/* Weekly */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Weekly Quests</h2>
          <div className="flex flex-col gap-3">
            {weeklyQuests.map(q => <WeeklyQuestCard key={q.id} quest={q} />)}
          </div>
        </section>

        {/* Daily */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Daily Quests</h2>
          <div className="bg-gray-800 rounded-xl divide-y divide-gray-700">
            {dailyQuests.map(q => <DailyQuestRow key={q.id} quest={q} />)}
          </div>
        </section>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-violet-600 hover:bg-violet-500 rounded-full text-2xl shadow-lg flex items-center justify-center transition-colors z-30"
        title="Add custom quest"
      >
        +
      </button>

      <SleepCheckInModal />
      {showCreateModal && <QuestCreationModal onClose={() => setShowCreateModal(false)} />}
      <LevelUpBanner />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/dashboard/Dashboard.tsx
git commit -m "feat: assemble main dashboard layout"
```

---

### Task 17: Root Page & App Shell

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Write src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 2: Write src/app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SideQuest',
  description: 'Your life. Your quest board.',
  manifest: '/manifest.json',
  themeColor: '#7c3aed',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'SideQuest' },
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1 },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Write src/app/page.tsx**

```tsx
'use client'
import { useEffect } from 'react'
import { useGameStore } from '@/store'
import { ClientOnly } from '@/components/ui/ClientOnly'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'
import { Dashboard } from '@/components/dashboard/Dashboard'

function AppContent() {
  const onboarding = useGameStore(s => s.onboarding)
  const checkAndApplyResets = useGameStore(s => s.checkAndApplyResets)

  useEffect(() => {
    checkAndApplyResets()
  }, [checkAndApplyResets])

  if (!onboarding.isComplete) return <OnboardingFlow />
  return <Dashboard />
}

export default function Page() {
  return (
    <ClientOnly>
      <AppContent />
    </ClientOnly>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: add app shell with PWA metadata and onboarding/dashboard gate"
```

---

### Task 18: PWA Icons

**Files:**
- Create: `public/icons/icon-192.png`, `public/icons/icon-512.png`

- [ ] **Step 1: Generate placeholder icons**

Run this in Node (or use any image editor to create two purple square PNGs):

```bash
node -e "
const { createCanvas } = require('canvas');
// npm install canvas if not available — or use any online tool to create
// a 192x192 and 512x512 purple square PNG with a ⚔️ symbol
// Save to public/icons/icon-192.png and public/icons/icon-512.png
console.log('Create purple square PNGs at public/icons/ — use any image editor')
"
```

The simplest path: use an online favicon generator (e.g., favicon.io) to create two purple square icons with the text "SQ" or a sword icon. Save as `public/icons/icon-192.png` and `public/icons/icon-512.png`.

- [ ] **Step 2: Verify PWA manifest references icons correctly**

`public/manifest.json` already references `/icons/icon-192.png` and `/icons/icon-512.png`. Confirm the files exist at those paths.

- [ ] **Step 3: Build and verify PWA is valid**

```bash
npm run build
```

Expected: Build succeeds. `public/sw.js` and `public/workbox-*.js` are generated by next-pwa.

- [ ] **Step 4: Commit**

```bash
git add public/icons/ public/manifest.json
git commit -m "feat: add PWA icons and manifest"
```

---

### Task 19: Final Verification & Vercel Deploy

**Files:** None — verification and deployment only.

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass. No failures.

- [ ] **Step 2: Run full build**

```bash
npm run build
```

Expected: Build completes with no TypeScript errors.

- [ ] **Step 3: Smoke test locally**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify:
- Onboarding flows through all 5 steps
- Dashboard shows quests, stat bars, character sheet
- Completing a quest adds XP and bar points
- Rerolling replaces the quest
- Sleep check-in modal appears (clear localStorage first to test fresh state)
- Custom quest creation works via the + button
- Level-up banner appears after earning enough XP (set totalXP to 90 in devtools to test)

- [ ] **Step 4: Deploy to Vercel**

```bash
npx vercel
```

Follow prompts. When asked for project settings:
- Framework: Next.js (auto-detected)
- Build command: `npm run build` (default)
- Output directory: `.next` (default)

- [ ] **Step 5: Verify PWA on deployed URL**

Open the Vercel URL on a mobile browser. Verify:
- "Add to Home Screen" prompt appears (Chrome/Safari)
- App loads from home screen without browser UI (standalone mode)
- Offline functionality works (cached by service worker)

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "feat: complete SideQuest v1 PWA"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Three stats (Health, Stamina, Mana) — types + store
- ✅ Three classes (Knight, Wizard, Bard) with primary stat weighting — questGeneration.ts
- ✅ Three quest tiers (daily/weekly/monthly) with correct counts — questGeneration.ts
- ✅ Sleep buff (+20% XP, binary, daily reset) — store + SleepCheckInModal
- ✅ Monthly stat bars (preferred=90max/70fill, non-preferred=46max/40fill, physical width difference) — barPoints.ts + StatBar
- ✅ Cumulative career XP displayed alongside bars — CharacterSheet + StatBar
- ✅ Quest library (99 templates) — questLibrary.ts
- ✅ Free unlimited rerolling — store.rerollQuest
- ✅ Auto-reset daily/weekly/monthly — resets.ts + store.checkAndApplyResets + page.tsx useEffect
- ✅ Custom quest creation (title ≤80, description ≤280) — QuestCreationModal + store.addCustomQuest
- ✅ Onboarding (6 steps: welcome→name→avatar→class→stats intro→dashboard) — OnboardingFlow
- ✅ Level-up curve (base 100, ×1.01 per level) — xp.ts
- ✅ Level-up celebration banner — LevelUpBanner
- ✅ Pre-made avatar sprites — avatars.ts (8 SVG icons)
- ✅ PWA — manifest.json + next.config.ts + @ducanh2912/next-pwa
- ✅ Vercel deployment — Task 19
- ✅ No backend, no auth, no cloud sync — confirmed throughout

