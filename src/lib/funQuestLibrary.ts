import type { QuestTemplate, Stat, QuestTier } from '@/types'
import { DAILY_BAR_PTS, WEEKLY_BAR_PTS, MONTHLY_BAR_PTS } from '@/lib/barPoints'

const DAILY_XP = 10
const WEEKLY_XP = 40
const MONTHLY_XP = 140
// The fun quests
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
