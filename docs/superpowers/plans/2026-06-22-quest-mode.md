# Quest Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three quest modes (Fun / Medium / Hard) that control which quest library is used, selectable during onboarding and switchable at any time.

**Architecture:** A new `QuestMode` type is added to Player. Two quest libraries (hard = existing, fun = new) are selected at generation time based on mode. Medium flips a coin per slot. A new onboarding step (step index 2) captures the choice before class selection.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Zustand, Jest + React Testing Library.

## Global Constraints

- All quest template IDs in the fun library must start with `f` (e.g. `fhd01`) — used at reroll time to detect pool
- Fun quests map to the same three stats (health / stamina / mana) using the same stat framing as the hard library
- Mode takes effect at next reset (does not immediately reroll the active board)
- Progress bar in Onboarding.tsx shows 5 segments (was 4)
- Mode badge color: Fun = amber, Medium = violet, Hard = slate

---

## File Map

| Action | Path |
|---|---|
| Modify | `src/types/index.ts` |
| Create | `src/lib/funQuestLibrary.ts` |
| Create | `src/lib/__tests__/funQuestLibrary.test.ts` |
| Modify | `src/lib/questGeneration.ts` |
| Modify | `src/lib/__tests__/questGeneration.test.ts` |
| Modify | `src/store/index.ts` |
| Rename | `src/components/onboarding/OnboardingStep3Class.tsx` → `OnboardingStep4Class.tsx` |
| Rename | `src/components/onboarding/OnboardingStep4Explain.tsx` → `OnboardingStep5Explain.tsx` |
| Create | `src/components/onboarding/OnboardingStep3Mode.tsx` |
| Modify | `src/components/onboarding/Onboarding.tsx` |
| Modify | `src/components/CharacterSheet.tsx` |

---

### Task 1: Add QuestMode type and update Player

**Files:**
- Modify: `src/types/index.ts`

**Interfaces:**
- Produces: `QuestMode = 'fun' | 'medium' | 'hard'` — used by Tasks 2, 3, 4, 5, 6

- [ ] **Step 1: Add QuestMode and update Player in `src/types/index.ts`**

Add `QuestMode` after the existing type aliases and add `mode` to the `Player` interface:

```ts
export type QuestMode = 'fun' | 'medium' | 'hard'
```

Update `Player`:
```ts
export interface Player {
  name: string
  avatarId: string
  playerClass: PlayerClass
  mode: QuestMode          // add this line
  level: number
  xp: number
  careerStats: PlayerStats
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: Errors on callers that construct `Player` without `mode` — that is fine for now, Task 4 will fix the store. If the only errors are about missing `mode` on Player literals in the store, proceed.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add QuestMode type and mode field to Player"
```

---

### Task 2: Write fun quest library and tests

**Files:**
- Create: `src/lib/funQuestLibrary.ts`
- Create: `src/lib/__tests__/funQuestLibrary.test.ts`

**Interfaces:**
- Consumes: `QuestTemplate`, `Stat`, `QuestTier` from `@/types`; `DAILY_BAR_PTS`, `WEEKLY_BAR_PTS`, `MONTHLY_BAR_PTS` from `@/lib/barPoints`
- Produces: `FUN_QUEST_LIBRARY: QuestTemplate[]`, `getFunTemplatesByStatAndTier(stat, tier): QuestTemplate[]` — used by Task 3

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/funQuestLibrary.test.ts`:

```ts
import { FUN_QUEST_LIBRARY, getFunTemplatesByStatAndTier } from '@/lib/funQuestLibrary'
import { QUEST_LIBRARY } from '@/lib/questLibrary'

describe('FUN_QUEST_LIBRARY', () => {
  it('all IDs start with f', () => {
    FUN_QUEST_LIBRARY.forEach(t => expect(t.id.startsWith('f')).toBe(true))
  })

  it('no ID collisions with hard library', () => {
    const hardIds = new Set(QUEST_LIBRARY.map(t => t.id))
    FUN_QUEST_LIBRARY.forEach(t => expect(hardIds.has(t.id)).toBe(false))
  })

  it('all entries have required fields', () => {
    FUN_QUEST_LIBRARY.forEach(t => {
      expect(t.id).toBeTruthy()
      expect(t.title).toBeTruthy()
      expect(t.description).toBeTruthy()
      expect(['health', 'stamina', 'mana']).toContain(t.stat)
      expect(['daily', 'weekly', 'monthly']).toContain(t.tier)
    })
  })
})

describe('getFunTemplatesByStatAndTier', () => {
  it('returns 15 health daily templates', () => {
    expect(getFunTemplatesByStatAndTier('health', 'daily')).toHaveLength(15)
  })

  it('returns 15 stamina daily templates', () => {
    expect(getFunTemplatesByStatAndTier('stamina', 'daily')).toHaveLength(15)
  })

  it('returns 15 mana daily templates', () => {
    expect(getFunTemplatesByStatAndTier('mana', 'daily')).toHaveLength(15)
  })

  it('returns 10 health weekly templates', () => {
    expect(getFunTemplatesByStatAndTier('health', 'weekly')).toHaveLength(10)
  })

  it('returns 10 stamina weekly templates', () => {
    expect(getFunTemplatesByStatAndTier('stamina', 'weekly')).toHaveLength(10)
  })

  it('returns 10 mana weekly templates', () => {
    expect(getFunTemplatesByStatAndTier('mana', 'weekly')).toHaveLength(10)
  })

  it('returns 8 health monthly templates', () => {
    expect(getFunTemplatesByStatAndTier('health', 'monthly')).toHaveLength(8)
  })

  it('returns 8 stamina monthly templates', () => {
    expect(getFunTemplatesByStatAndTier('stamina', 'monthly')).toHaveLength(8)
  })

  it('returns 8 mana monthly templates', () => {
    expect(getFunTemplatesByStatAndTier('mana', 'monthly')).toHaveLength(8)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest funQuestLibrary --no-coverage`

Expected: FAIL with "Cannot find module '@/lib/funQuestLibrary'"

- [ ] **Step 3: Create `src/lib/funQuestLibrary.ts`**

```ts
import type { QuestTemplate, Stat, QuestTier } from '@/types'
import { DAILY_BAR_PTS, WEEKLY_BAR_PTS, MONTHLY_BAR_PTS } from '@/lib/barPoints'

const DAILY_XP = 10
const WEEKLY_XP = 40
const MONTHLY_XP = 140

export const FUN_QUEST_LIBRARY: QuestTemplate[] = [
  // ─── HEALTH DAILY (15) ───────────────────────────────────────────────────
  { id: 'fhd01', title: 'Try a Handstand', description: 'Find a wall and practice a handstand, or work toward one from where you are.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd02', title: 'Go for a Swim', description: 'Get in a pool, lake, or ocean and swim for at least 15 minutes.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd03', title: 'Backyard Dance Party', description: 'Put on your favorite playlist and dance for 10 minutes. No audience required.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd04', title: 'Try a Cartwheel', description: 'Attempt a cartwheel, roundoff, or any tumbling move. Falling counts.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd05', title: 'Jump Rope for 5 Minutes', description: 'Grab a jump rope and keep going for at least 5 minutes straight.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd06', title: 'Play with a Dog', description: 'Spend 20 minutes playing fetch, tug, or just running around with a dog.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd07', title: 'Take the Scenic Route', description: 'Walk somewhere you have to go, but take a longer or more interesting path.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd08', title: 'Do Something Upside Down', description: 'Hang from a bar, do a headstand, or try a bridge pose.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd09', title: 'Walk Barefoot Outside', description: 'Spend 15 minutes walking on grass, sand, or dirt without shoes.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd10', title: 'Play a Pickup Game', description: 'Join or organize a casual game of basketball, soccer, frisbee, or tag.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd11', title: 'Follow a Fun Workout Video', description: 'Search "fun 10 minute workout" on YouTube and follow along with one.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd12', title: 'Climb Something', description: 'Find a climbing wall, a tree, a boulder, or a playground structure and scramble up.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd13', title: 'Water Fight', description: 'Fill water balloons, grab a hose, or get a squirt gun. Get wet.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd14', title: 'Play Frisbee', description: 'Toss a frisbee with someone or head to a park and practice throwing on your own.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fhd15', title: 'Yoga Flow', description: 'Follow a 15-minute beginner yoga video — pick something that looks enjoyable, not punishing.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },

  // ─── HEALTH WEEKLY (10) ──────────────────────────────────────────────────
  { id: 'fhw01', title: 'Try a New Sport', description: 'Play a sport you have never tried before — find a pickup game, class, or just go for it.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fhw02', title: 'Bike Ride Adventure', description: 'Take a bike ride to somewhere you have not been before. Distance does not matter.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fhw03', title: 'Go Hiking', description: 'Find a trail and hike it this week. Any length counts.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fhw04', title: 'Skate or Rollerblade', description: 'Dig out the skates or rent a pair and get rolling for at least 30 minutes.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fhw05', title: 'Bowling Night', description: 'Head to a bowling alley and play at least one game.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fhw06', title: 'Mini-Golf', description: 'Find a mini-golf course and play 18 holes.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fhw07', title: 'Rock Climbing Gym', description: 'Visit a climbing gym and spend an hour on the wall.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fhw08', title: 'Dance Class', description: 'Take any dance class this week — salsa, hip hop, swing, it does not matter.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fhw09', title: 'Kayak or Canoe', description: 'Rent a kayak or canoe and paddle for at least 30 minutes.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fhw10', title: 'Open Water Swim', description: 'Get in the water — lake, ocean, river — and swim for at least 20 minutes.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },

  // ─── HEALTH MONTHLY (8) ──────────────────────────────────────────────────
  { id: 'fhm01', title: 'Learn to Juggle', description: 'Practice juggling every day this month until you can keep 3 balls in the air.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fhm02', title: 'Do a Fun Race', description: 'Sign up for and complete a 5K fun run, color run, or obstacle course race.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fhm03', title: 'Master a Physical Trick', description: 'Pick one physical trick (skateboard move, gymnastics pose, balance challenge) and learn it this month.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fhm04', title: 'Four Outdoor Adventures', description: 'Complete one outdoor physical adventure per week this month — hike, swim, climb, bike, or anything active outside.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fhm05', title: 'Learn a Martial Art', description: 'Take at least 4 martial arts classes this month.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fhm06', title: 'Try a Board Sport', description: 'Take beginner lessons for a board sport you have never tried — surfing, snowboarding, skateboarding.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fhm07', title: 'Complete a YouTube Challenge', description: 'Pick a physical challenge from YouTube and see it through this month.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fhm08', title: 'Move Every Day', description: 'Do something physical every single day this month — it just has to be intentional and enjoyable.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },

  // ─── STAMINA DAILY (15) ──────────────────────────────────────────────────
  { id: 'fsd01', title: 'Call Someone You Miss', description: 'Call a friend or family member you have not spoken to in a while.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd02', title: 'Say Yes to Plans', description: 'Accept the next social invite you would normally pass on.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd03', title: 'Strike Up a Conversation', description: 'Have a genuine conversation with someone you do not know well today.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd04', title: 'Send a Meme', description: 'Send something funny to a friend just to make them laugh. That is it.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd05', title: 'Explore a New Block', description: 'Walk down a street in your neighborhood you have never been on before.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd06', title: 'Try a New Coffee Shop', description: 'Visit a café you have never been to and stay for at least 20 minutes.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd07', title: 'People Watch', description: 'Sit somewhere busy — a park, plaza, or café — and just observe for 15 minutes.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd08', title: 'Send a Real Compliment', description: 'Text or tell someone a genuine compliment today — something specific, not a throw-away.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd09', title: 'Find Something Free Nearby', description: 'Discover a free event, exhibit, or activity happening near you today or this week.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd10', title: 'Voice Note a Friend', description: 'Send a voice message to a friend instead of texting. Say something real.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd11', title: 'Wander Without a Destination', description: 'Take a walk with no specific destination for at least 20 minutes.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd12', title: 'Try the Local Special', description: 'Order whatever the local specialty or recommended dish is at a nearby restaurant.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd13', title: 'Share a Story', description: 'Tell someone a funny or interesting story from your life today.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd14', title: 'Random Act of Kindness', description: 'Do something unexpectedly kind for a stranger or friend today.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fsd15', title: 'Introduce Yourself', description: 'Introduce yourself to a neighbor, coworker, or someone new today.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },

  // ─── STAMINA WEEKLY (10) ─────────────────────────────────────────────────
  { id: 'fsw01', title: 'Host a Game Night', description: 'Invite people over for board games, card games, or video games.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fsw02', title: 'Go to a Show', description: 'Attend a live music show, comedy night, or performance this week.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fsw03', title: 'Plan and Execute a Hangout', description: 'Organize a hangout with two or more friends and actually make it happen.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fsw04', title: 'Explore a New Neighborhood', description: 'Visit a part of your city you have never spent real time in.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fsw05', title: 'Attend a Local Event', description: 'Go to a farmers market, festival, art show, or community event this week.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fsw06', title: 'Try a New Restaurant', description: 'Eat somewhere you have never been — ideally a local spot, not a chain.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fsw07', title: 'Cook for Someone', description: 'Make a meal and share it with at least one other person.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fsw08', title: 'Take a Day Trip', description: 'Go somewhere at least 30 minutes away from home for the day — just to see it.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fsw09', title: 'See a Movie in Theaters', description: 'Catch a film on the big screen, ideally with someone.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fsw10', title: 'Try Karaoke', description: 'Go to karaoke with friends or find a karaoke bar and actually sing.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },

  // ─── STAMINA MONTHLY (8) ─────────────────────────────────────────────────
  { id: 'fsm01', title: 'Plan and Take a Trip', description: 'Research, plan, and book a trip — even just a weekend away somewhere new.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fsm02', title: 'Host a Dinner Party', description: 'Invite friends over for a dinner you cook yourself. Theme it if you want.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fsm03', title: 'Explore a New City', description: 'Spend a full day exploring a city you have never visited.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fsm04', title: 'Join a Club or Group', description: 'Sign up for a recurring club, class, or group activity and attend this month.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fsm05', title: 'Four Social Events', description: 'Organize or attend 4 social events this month — one per week.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fsm06', title: 'Write Handwritten Letters', description: 'Write handwritten letters to 3 people you care about and actually mail them.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fsm07', title: 'Volunteer Somewhere', description: 'Spend at least 4 hours volunteering with an organization you believe in.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fsm08', title: 'Make Three New Friends', description: 'Have genuine, meaningful conversations with 3 people you did not know well before.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },

  // ─── MANA DAILY (15) ─────────────────────────────────────────────────────
  { id: 'fmd01', title: 'Learn One New Thing', description: 'Look up one thing you have always been curious about and actually learn it today.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd02', title: 'Watch a Documentary', description: 'Watch a documentary on a subject you know nothing about.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd03', title: 'Read for Pleasure', description: 'Read anything you actually enjoy — a novel, magazine, comic, or article — for 20 minutes.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd04', title: 'Doodle Something', description: 'Spend 10 minutes drawing or doodling with zero pressure to be good.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd05', title: 'Learn a Card Trick', description: 'Find a beginner card trick online and learn it well enough to show someone.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd06', title: 'Write Something', description: 'Write anything — a short story opener, a poem, a joke, a list of ideas.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd07', title: 'Teach Something', description: 'Explain something you know well to someone else today — anything counts.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd08', title: 'Do a Puzzle', description: 'Work on a crossword, Sudoku, jigsaw, or logic puzzle for at least 20 minutes.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd09', title: 'Make Something', description: 'Create any physical or digital object today — origami, a doodle, a playlist, a recipe.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd10', title: 'Listen to a Curiosity Podcast', description: 'Listen to one podcast episode on a topic you are genuinely curious about.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd11', title: 'Weird Brainstorm', description: 'Pick a weird question and brainstorm 10 answers. No wrong answers allowed.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd12', title: 'Watch a Tutorial', description: 'Learn one specific skill on YouTube today — magic trick, knot, recipe, phrase in another language.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd13', title: 'Find a New Artist', description: 'Discover one musician or band you have never listened to and hear a full song.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd14', title: 'Change Your Route', description: 'Take a completely different route somewhere today and notice what is different.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'fmd15', title: 'Research Something Random', description: 'Open Wikipedia and fall down a rabbit hole on whatever catches your eye.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },

  // ─── MANA WEEKLY (10) ────────────────────────────────────────────────────
  { id: 'fmw01', title: 'Build a Fun Side Project', description: 'Spend 2+ hours on a creative or technical project purely for the joy of it.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fmw02', title: 'Read a Book Chapter', description: 'Read at least one chapter of a book you have been meaning to start.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fmw03', title: 'Take an Online Course', description: 'Find a free course or tutorial on something you are genuinely excited to learn.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fmw04', title: 'Write a Short Story', description: 'Write a short story of at least 300 words this week. It can be terrible.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fmw05', title: 'Cook a Recipe You Have Never Made', description: 'Find a recipe that excites you and actually cook it this week.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fmw06', title: 'Learn 10 Words in Another Language', description: 'Pick any language and learn 10 words well enough to use them in a sentence.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fmw07', title: 'Pick Up an Old Hobby', description: 'Return to a hobby you have not done in at least 6 months.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fmw08', title: 'Solve a Hard Puzzle', description: 'Complete a logic puzzle, escape room puzzle, or expert-level Sudoku this week.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fmw09', title: 'Learn a Song', description: 'Learn to play, sing, or hum a song you have always liked.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'fmw10', title: 'Redesign Something for Fun', description: 'Redesign a room layout, a workflow, or a system — just to see what you come up with.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },

  // ─── MANA MONTHLY (8) ────────────────────────────────────────────────────
  { id: 'fmm01', title: 'Start a Creative Project', description: 'Start something creative this month and make real progress on it — not just planning.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fmm02', title: 'Read a Complete Book', description: 'Read one complete book this month — fiction, non-fiction, anything you genuinely enjoy.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fmm03', title: 'Learn a Magic Trick', description: 'Learn a magic trick well enough to fool someone. Practice it every day this month.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fmm04', title: 'Complete an Online Course', description: 'Start and finish a free online course on a topic you are excited about.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fmm05', title: 'Build Something Digital', description: 'Build or launch a small digital project — a website, app, game, tool, or anything that runs.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fmm06', title: 'Keep a Learning Log', description: 'Write down one new thing you learned every day for the whole month.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fmm07', title: 'Learn Language Basics', description: 'Spend 15 minutes a day learning a new language — aim to have a simple conversation by month end.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'fmm08', title: 'Document Something', description: 'Create a photo journal, video diary, or written record of something in your life this month.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
]

export function getFunTemplatesByStatAndTier(stat: Stat, tier: QuestTier): QuestTemplate[] {
  return FUN_QUEST_LIBRARY.filter(t => t.stat === stat && t.tier === tier)
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest funQuestLibrary --no-coverage`

Expected: PASS — all 9 tests green

- [ ] **Step 5: Commit**

```bash
git add src/lib/funQuestLibrary.ts src/lib/__tests__/funQuestLibrary.test.ts
git commit -m "feat: add fun quest library with 99 templates"
```

---

### Task 3: Update quest generation for mode

**Files:**
- Modify: `src/lib/questGeneration.ts`
- Modify: `src/lib/__tests__/questGeneration.test.ts`

**Interfaces:**
- Consumes: `QuestMode` from `@/types`; `FUN_QUEST_LIBRARY`, `getFunTemplatesByStatAndTier` from `@/lib/funQuestLibrary`
- Produces: `generateDailyQuests(playerClass, mode?)`, `generateWeeklyQuests(playerClass, mode?)`, `generateMonthlyQuest(playerClass, mode?)`, `rerollQuest(quest, activeQuests)` — same names, updated signatures

- [ ] **Step 1: Write failing tests**

Add to the bottom of `src/lib/__tests__/questGeneration.test.ts`:

```ts
describe('generateDailyQuests — mode', () => {
  it('fun mode: all templateIds start with f', () => {
    const quests = generateDailyQuests('knight', 'fun')
    quests.forEach(q => expect(q.templateId.startsWith('f')).toBe(true))
  })

  it('hard mode: no templateIds start with f', () => {
    const quests = generateDailyQuests('knight', 'hard')
    quests.forEach(q => expect(q.templateId.startsWith('f')).toBe(false))
  })

  it('medium mode: returns 4 quests', () => {
    const quests = generateDailyQuests('knight', 'medium')
    expect(quests).toHaveLength(4)
  })
})

describe('generateWeeklyQuests — mode', () => {
  it('fun mode: all templateIds start with f', () => {
    const quests = generateWeeklyQuests('knight', 'fun')
    quests.forEach(q => expect(q.templateId.startsWith('f')).toBe(true))
  })

  it('hard mode: no templateIds start with f', () => {
    const quests = generateWeeklyQuests('knight', 'hard')
    quests.forEach(q => expect(q.templateId.startsWith('f')).toBe(false))
  })
})

describe('generateMonthlyQuest — mode', () => {
  it('fun mode: templateId starts with f', () => {
    const quest = generateMonthlyQuest('knight', 'fun')
    expect(quest.templateId.startsWith('f')).toBe(true)
  })

  it('hard mode: templateId does not start with f', () => {
    const quest = generateMonthlyQuest('knight', 'hard')
    expect(quest.templateId.startsWith('f')).toBe(false)
  })
})

describe('rerollQuest — pool detection', () => {
  it('rerolls a fun quest within the fun pool', () => {
    const quests = generateDailyQuests('knight', 'fun')
    const original = quests[0]
    const rerolled = rerollQuest(original, quests)
    expect(rerolled.templateId.startsWith('f')).toBe(true)
  })

  it('rerolls a hard quest within the hard pool', () => {
    const quests = generateDailyQuests('knight', 'hard')
    const original = quests[0]
    const rerolled = rerollQuest(original, quests)
    expect(rerolled.templateId.startsWith('f')).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest questGeneration --no-coverage`

Expected: new tests FAIL, existing tests PASS (existing tests call functions without mode and should still work after we add default params)

- [ ] **Step 3: Update `src/lib/questGeneration.ts`**

Replace the full file with:

```ts
import { v4 as uuidv4 } from 'uuid'
import type { PlayerClass, Quest, QuestTemplate, Stat, QuestTier, QuestMode } from '@/types'
import { getTemplatesByStatAndTier, QUEST_LIBRARY } from '@/lib/questLibrary'
import { getFunTemplatesByStatAndTier, FUN_QUEST_LIBRARY } from '@/lib/funQuestLibrary'
import { DAILY_BAR_PTS, WEEKLY_BAR_PTS, MONTHLY_BAR_PTS } from '@/lib/barPoints'

const CLASS_PRIMARY: Record<PlayerClass, Stat> = {
  knight: 'health',
  wizard: 'mana',
  bard: 'stamina',
}

const ALL_STATS: Stat[] = ['health', 'stamina', 'mana']

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function templateToQuest(template: QuestTemplate): Quest {
  return {
    id: uuidv4(),
    templateId: template.id,
    title: template.title,
    description: template.description,
    stat: template.stat,
    tier: template.tier,
    barPoints: template.barPoints,
    xpValue: template.xpValue,
    completed: false,
    completedAt: null,
    isCustom: false,
    xpGained: undefined,
  }
}

function secondaryStat(primary: Stat): Stat {
  const others = ALL_STATS.filter(s => s !== primary)
  return pickRandom(others)
}

function getPool(mode: QuestMode, stat: Stat, tier: QuestTier): QuestTemplate[] {
  if (mode === 'fun') return getFunTemplatesByStatAndTier(stat, tier)
  if (mode === 'hard') return getTemplatesByStatAndTier(stat, tier)
  // medium: 50/50 coin flip per slot
  return Math.random() < 0.5
    ? getTemplatesByStatAndTier(stat, tier)
    : getFunTemplatesByStatAndTier(stat, tier)
}

export function generateDailyQuests(playerClass: PlayerClass, mode: QuestMode = 'hard'): Quest[] {
  const primary = CLASS_PRIMARY[playerClass]
  const secondary = secondaryStat(primary)
  const tertiary = ALL_STATS.find(s => s !== primary && s !== secondary)!

  const chosen: QuestTemplate[] = []

  const p1Pool = getPool(mode, primary, 'daily')
  const p1 = pickRandom(p1Pool)
  chosen.push(p1)

  const p2Pool = getPool(mode, primary, 'daily').filter(t => t.id !== p1.id)
  chosen.push(pickRandom(p2Pool))
  chosen.push(pickRandom(getPool(mode, secondary, 'daily')))
  chosen.push(pickRandom(getPool(mode, tertiary, 'daily')))

  return chosen.map(templateToQuest)
}

export function generateWeeklyQuests(playerClass: PlayerClass, mode: QuestMode = 'hard'): Quest[] {
  return ALL_STATS.map(stat => {
    const pool = getPool(mode, stat, 'weekly')
    return templateToQuest(pickRandom(pool))
  })
}

export function generateMonthlyQuest(playerClass: PlayerClass, mode: QuestMode = 'hard'): Quest {
  const primary = CLASS_PRIMARY[playerClass]
  const pool = getPool(mode, primary, 'monthly')
  return templateToQuest(pickRandom(pool))
}

export function rerollQuest(quest: Quest, activeQuests: Quest[]): Quest {
  const activeTemplateIds = new Set(activeQuests.map(q => q.templateId))
  const isFunQuest = quest.templateId.startsWith('f')
  const source = isFunQuest ? FUN_QUEST_LIBRARY : QUEST_LIBRARY

  const pool = source.filter(
    t => t.tier === quest.tier && t.stat === quest.stat && !activeTemplateIds.has(t.id)
  )

  if (pool.length === 0) {
    const fallback = source.filter(
      t => t.tier === quest.tier && t.stat === quest.stat && t.id !== quest.templateId
    )
    return templateToQuest(
      pickRandom(fallback.length > 0 ? fallback : source.filter(t => t.tier === quest.tier))
    )
  }

  return templateToQuest(pickRandom(pool))
}

export function createCustomQuest(
  title: string,
  description: string,
  stat: Stat,
  tier: QuestTier
): Quest {
  const barPointsMap: Record<QuestTier, number> = {
    daily: DAILY_BAR_PTS,
    weekly: WEEKLY_BAR_PTS,
    monthly: MONTHLY_BAR_PTS,
  }
  const xpMap: Record<QuestTier, number> = {
    daily: 10,
    weekly: 40,
    monthly: 140,
  }

  return {
    id: uuidv4(),
    templateId: `custom-${uuidv4()}`,
    title: title.slice(0, 80),
    description: description.slice(0, 280),
    stat,
    tier,
    barPoints: barPointsMap[tier],
    xpValue: xpMap[tier],
    completed: false,
    completedAt: null,
    isCustom: true,
    xpGained: undefined,
  }
}
```

- [ ] **Step 4: Run all quest generation tests**

Run: `npx jest questGeneration --no-coverage`

Expected: PASS — all existing tests plus all new mode/reroll tests

- [ ] **Step 5: Run full test suite**

Run: `npx jest --no-coverage`

Expected: PASS — all tests green

- [ ] **Step 6: Commit**

```bash
git add src/lib/questGeneration.ts src/lib/__tests__/questGeneration.test.ts
git commit -m "feat: add mode param to quest generation functions"
```

---

### Task 4: Update the store

**Files:**
- Modify: `src/store/index.ts`

**Interfaces:**
- Consumes: `QuestMode` from `@/types`; updated `generateDailyQuests`, `generateWeeklyQuests`, `generateMonthlyQuest` signatures from Task 3
- Produces: `setPlayerMode(mode: QuestMode)` action; `completeOnboarding` now reads `player.mode`

- [ ] **Step 1: Update `src/store/index.ts`**

Add `QuestMode` to the import from `@/types`:

```ts
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
```

Add `setPlayerMode` to the `AppState` interface (after the existing onboarding actions):

```ts
setPlayerMode: (mode: QuestMode) => void
```

Update `completeOnboarding` inside the store implementation — change the generation calls to pass `player.mode`:

```ts
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
```

Update `checkAndApplyResets` to read mode from player:

```ts
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
```

Add `setPlayerMode` implementation inside the store (after `setOnboardingStep`):

```ts
setPlayerMode: (mode: QuestMode) => {
  set(state => ({
    player: state.player ? { ...state.player, mode } : null,
  }))
},
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors. (If `Player` construction in Onboarding.tsx is missing `mode`, that is fine — Task 5 fixes it.)

- [ ] **Step 3: Commit**

```bash
git add src/store/index.ts
git commit -m "feat: wire store to use player mode for quest generation"
```

---

### Task 5: Add onboarding mode step

**Files:**
- Rename: `src/components/onboarding/OnboardingStep3Class.tsx` → `OnboardingStep4Class.tsx`
- Rename: `src/components/onboarding/OnboardingStep4Explain.tsx` → `OnboardingStep5Explain.tsx`
- Create: `src/components/onboarding/OnboardingStep3Mode.tsx`
- Modify: `src/components/onboarding/Onboarding.tsx`

**Interfaces:**
- Produces: `<OnboardingStep3Mode onNext={(mode) => void} onBack={() => void} />`

- [ ] **Step 1: Rename existing onboarding files**

```bash
git mv src/components/onboarding/OnboardingStep3Class.tsx src/components/onboarding/OnboardingStep4Class.tsx
git mv src/components/onboarding/OnboardingStep4Explain.tsx src/components/onboarding/OnboardingStep5Explain.tsx
```

- [ ] **Step 2: Create `src/components/onboarding/OnboardingStep3Mode.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { QuestMode } from '@/types'

interface Props {
  onNext: (mode: QuestMode) => void
  onBack: () => void
}

const MODES: { id: QuestMode; emoji: string; name: string; description: string }[] = [
  {
    id: 'fun',
    emoji: '🎮',
    name: 'Fun',
    description: 'Quests that feel genuinely rewarding and enjoyable. Try a handstand. Host a game night. Build something for fun.',
  },
  {
    id: 'medium',
    emoji: '⚖️',
    name: 'Medium',
    description: 'A mix of fun and serious quests. Keep things interesting without going full grind.',
  },
  {
    id: 'hard',
    emoji: '💀',
    name: 'Hard',
    description: 'Disciplined self-improvement. No-alcohol weeks, meal prep, inbox zero.',
  },
]

export default function OnboardingStep3Mode({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<QuestMode>('hard')

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="text-2xl font-bold text-white">Choose Your Mode</h2>
      <p className="max-w-xs text-gray-400">This determines the flavor of quests you receive. You can change it any time.</p>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => setSelected(mode.id)}
            className={`rounded-xl p-4 text-left transition ${
              selected === mode.id
                ? 'bg-violet-600 ring-2 ring-violet-400'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{mode.emoji}</span>
              <span className="font-bold text-white">{mode.name}</span>
            </div>
            <p className="text-sm text-gray-300">{mode.description}</p>
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-700 px-6 py-2 text-gray-400 hover:border-gray-500 hover:text-white transition"
        >
          Back
        </button>
        <button
          onClick={() => onNext(selected)}
          className="rounded-xl bg-violet-600 px-8 py-3 font-bold text-white transition hover:bg-violet-500 active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update `src/components/onboarding/Onboarding.tsx`**

Replace the full file with:

```tsx
'use client'

import { useState } from 'react'
import type { PlayerClass, QuestMode, Player } from '@/types'
import { useStore } from '@/store'
import OnboardingStep1Name from './OnboardingStep1Name'
import OnboardingStep2Avatar from './OnboardingStep2Avatar'
import OnboardingStep3Mode from './OnboardingStep3Mode'
import OnboardingStep4Class from './OnboardingStep4Class'
import OnboardingStep5Explain from './OnboardingStep5Explain'

export default function Onboarding() {
  const completeOnboarding = useStore(s => s.completeOnboarding)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [avatarId, setAvatarId] = useState('shield')
  const [mode, setMode] = useState<QuestMode>('hard')
  const [playerClass, setPlayerClass] = useState<PlayerClass>('knight')

  function finish() {
    const player: Player = {
      name,
      avatarId,
      playerClass,
      mode,
      level: 1,
      xp: 0,
      careerStats: { health: 0, stamina: 0, mana: 0 },
    }
    completeOnboarding(player)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        <div className="mb-6 flex gap-1 justify-center">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-violet-500' : 'bg-gray-700'}`}
            />
          ))}
        </div>

        {step === 0 && (
          <OnboardingStep1Name
            onNext={n => {
              setName(n)
              setStep(1)
            }}
          />
        )}
        {step === 1 && (
          <OnboardingStep2Avatar
            onNext={id => {
              setAvatarId(id)
              setStep(2)
            }}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && (
          <OnboardingStep3Mode
            onNext={m => {
              setMode(m)
              setStep(3)
            }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <OnboardingStep4Class
            onNext={cls => {
              setPlayerClass(cls)
              setStep(4)
            }}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <OnboardingStep5Explain
            onNext={finish}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors

- [ ] **Step 5: Run full test suite**

Run: `npx jest --no-coverage`

Expected: PASS — all tests green

- [ ] **Step 6: Manually verify onboarding flow**

Start the dev server: `npm run dev`

Open `http://localhost:3000`, clear localStorage if needed (DevTools → Application → Clear storage), then:
1. Confirm 5-segment progress bar is visible
2. Step through Name → Avatar → Mode (3 cards visible, Fun/Medium/Hard, default Hard selected)
3. Confirm Back button on Mode returns to Avatar
4. Confirm Continue on Mode advances to Class
5. Complete onboarding and confirm you land on the dashboard

- [ ] **Step 7: Commit**

```bash
git add src/components/onboarding/
git commit -m "feat: add mode selection step to onboarding"
```

---

### Task 6: Add mode badge to CharacterSheet

**Files:**
- Modify: `src/components/CharacterSheet.tsx`

**Interfaces:**
- Consumes: `player.mode: QuestMode` from store

- [ ] **Step 1: Update `src/components/CharacterSheet.tsx`**

Add a `MODE_LABELS` map and `MODE_COLORS` map, then render the badge after the class/level line.

Add these constants near the top of the component (after `CLASS_NAMES`):

```ts
const MODE_LABELS: Record<string, string> = {
  fun: '🎮 Fun',
  medium: '⚖️ Medium',
  hard: '💀 Hard',
}

const MODE_COLORS: Record<string, string> = {
  fun: 'bg-amber-900/60 text-amber-300',
  medium: 'bg-violet-900/60 text-violet-300',
  hard: 'bg-slate-800 text-slate-300',
}
```

Replace the existing class/level line:

```tsx
<div className="text-sm text-gray-400">
  {CLASS_NAMES[player.playerClass]} · Level {player.level}
</div>
```

With:

```tsx
<div className="flex items-center gap-2 flex-wrap">
  <span className="text-sm text-gray-400">
    {CLASS_NAMES[player.playerClass]} · Level {player.level}
  </span>
  <span className={`rounded-md px-2 py-0.5 text-xs ${MODE_COLORS[player.mode]}`}>
    {MODE_LABELS[player.mode]}
  </span>
</div>
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors

- [ ] **Step 3: Manually verify badge**

With the dev server running (`npm run dev`), open the dashboard and confirm:
- Mode badge appears after the class/level line
- Fun mode shows amber badge, Medium shows violet, Hard shows slate
- Badge renders correctly on mobile widths (use DevTools device emulation)

- [ ] **Step 4: Run full test suite**

Run: `npx jest --no-coverage`

Expected: PASS — all tests green

- [ ] **Step 5: Commit**

```bash
git add src/components/CharacterSheet.tsx
git commit -m "feat: display mode badge in character sheet"
```
