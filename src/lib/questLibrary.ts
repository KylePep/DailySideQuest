import type { QuestTemplate } from '@/types'
import { DAILY_BAR_PTS, WEEKLY_BAR_PTS, MONTHLY_BAR_PTS } from '@/lib/barPoints'

const DAILY_XP = 10
const WEEKLY_XP = 40
const MONTHLY_XP = 140

export const QUEST_LIBRARY: QuestTemplate[] = [
  // ─── HEALTH DAILY (15) ───────────────────────────────────────────────────
  { id: 'hd01', title: 'Morning Walk', description: 'Take a 10-minute walk outside to start the day.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd02', title: 'Drink 8 Glasses', description: 'Consume at least 8 glasses of water today.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd03', title: 'Stretch for 5 Minutes', description: 'Do a full-body stretch routine for at least 5 minutes.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd04', title: 'Eat a Vegetable', description: 'Include at least one serving of vegetables in a meal.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd05', title: 'Take Your Vitamins', description: 'Take your daily vitamins or supplements.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd06', title: 'No Junk Food', description: 'Avoid processed snacks and junk food for the day.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd07', title: 'Sleep Check', description: 'Get into bed before midnight tonight.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd08', title: 'Stand Breaks', description: 'Stand up and move around for 2 minutes every hour.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd09', title: 'Posture Check', description: 'Sit with good posture and correct yourself whenever you catch slouching.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd10', title: 'Limit Caffeine', description: 'Keep caffeine intake to 2 or fewer drinks today.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd11', title: 'Cold Rinse', description: 'End your shower with 30 seconds of cold water.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd12', title: 'Mindful Eating', description: 'Eat one meal without screens or distractions.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd13', title: 'Floss Today', description: 'Floss your teeth once today.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd14', title: 'Fresh Air', description: 'Spend at least 15 minutes outside, away from screens.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'hd15', title: 'Evening Wind-Down', description: 'Spend 10 minutes before bed doing a calming activity.', stat: 'health', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },

  // ─── HEALTH WEEKLY (10) ──────────────────────────────────────────────────
  { id: 'hw01', title: 'Workout Session', description: 'Complete a workout of at least 30 minutes this week.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'hw02', title: 'Meal Prep', description: 'Prepare healthy meals in advance for the coming week.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'hw03', title: 'No Alcohol Week', description: 'Abstain from alcohol for the entire week.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'hw04', title: 'Doctor Checkup', description: 'Schedule or attend a health-related appointment.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'hw05', title: '10K Steps Day', description: 'Hit 10,000 steps in a single day this week.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'hw06', title: 'Try a New Sport', description: 'Try a physical activity you haven\'t done before.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'hw07', title: 'Sugar Detox', description: 'Avoid added sugar for three consecutive days this week.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'hw08', title: 'Sleep 8 Hours', description: 'Get at least 8 hours of sleep on two nights this week.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'hw09', title: 'Yoga Session', description: 'Complete a yoga or stretching session of 20 minutes or more.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'hw10', title: 'Cook from Scratch', description: 'Cook a full healthy meal from whole ingredients this week.', stat: 'health', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },

  // ─── HEALTH MONTHLY (8) ──────────────────────────────────────────────────
  { id: 'hm01', title: 'Run a 5K', description: 'Complete a 5-kilometer run this month.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'hm02', title: '30-Day No Soda', description: 'Go the entire month without drinking soda.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'hm03', title: 'Body Transformation', description: 'Complete a structured 30-day fitness challenge.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'hm04', title: 'Medical Milestone', description: 'Get a full health checkup or blood panel done.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'hm05', title: 'Sleep Schedule', description: 'Maintain a consistent sleep and wake time every day for a month.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'hm06', title: 'Dry Month', description: 'Complete a full month without alcohol.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'hm07', title: 'Plant-Based Week', description: 'Eat entirely plant-based for one full week within the month.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'hm08', title: 'Track Every Meal', description: 'Log every meal you eat for the entire month.', stat: 'health', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },

  // ─── STAMINA DAILY (15) ──────────────────────────────────────────────────
  { id: 'sd01', title: 'Inbox Zero', description: 'Clear your email inbox or task list by end of day.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd02', title: 'Pomodoro Session', description: 'Complete at least two 25-minute focused work sessions.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd03', title: 'One Hard Task First', description: 'Tackle your most dreaded task before doing anything else.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd04', title: 'No Social Media', description: 'Avoid all social media platforms for the entire day.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd05', title: 'Make Your Bed', description: 'Make your bed within 30 minutes of waking up.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd06', title: 'Plan Tomorrow', description: 'Write out your top 3 priorities for tomorrow before bed.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd07', title: 'No Snooze', description: 'Get up with your first alarm, no hitting snooze.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd08', title: 'Journal Entry', description: 'Write at least 3 sentences in a journal or notes app.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd09', title: 'Phone-Free Morning', description: 'Keep your phone away for the first 30 minutes after waking.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd10', title: 'Clean One Space', description: 'Tidy up one area of your home or workspace.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd11', title: 'Say No Once', description: 'Decline at least one low-value request or distraction today.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd12', title: 'Batch Tasks', description: 'Group similar tasks together and complete them in one block.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd13', title: 'Single-Tab Focus', description: 'Work with only one browser tab open for at least one hour.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd14', title: 'Finish What You Start', description: 'Complete every task you start today — no leaving things half-done.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'sd15', title: 'Gratitude Note', description: 'Write down three things you are grateful for.', stat: 'stamina', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },

  // ─── STAMINA WEEKLY (10) ─────────────────────────────────────────────────
  { id: 'sw01', title: 'Side Project Hour', description: 'Spend at least one hour on a personal project this week.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'sw02', title: 'Digital Detox Day', description: 'Spend one full day with minimal screen time.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'sw03', title: 'Weekly Review', description: 'Review your goals, habits, and wins from the past week.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'sw04', title: 'Learn Something New', description: 'Spend time learning a skill or topic outside your comfort zone.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'sw05', title: 'Deep Clean', description: 'Do a thorough cleaning of your living or work space.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'sw06', title: 'Reach Out', description: 'Reconnect with someone you haven\'t spoken to in a while.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'sw07', title: 'No News Week', description: 'Avoid news media for the full week.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'sw08', title: 'Budget Review', description: 'Review your spending and update your budget for the week.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'sw09', title: 'Finish a Book Chapter', description: 'Read at least one chapter of a non-fiction book.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'sw10', title: 'Mentor or Be Mentored', description: 'Have a meaningful conversation with a mentor or someone you mentor.', stat: 'stamina', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },

  // ─── STAMINA MONTHLY (8) ─────────────────────────────────────────────────
  { id: 'sm01', title: 'Launch Something', description: 'Ship, publish, or release something you have been working on.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'sm02', title: 'Read a Full Book', description: 'Finish reading an entire book this month.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'sm03', title: 'No-Buy Month', description: 'Avoid all non-essential purchases for the entire month.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'sm04', title: 'Habit Streak', description: 'Maintain one daily habit every single day for the full month.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'sm05', title: 'Learn a Skill', description: 'Complete a course, tutorial series, or structured learning path.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'sm06', title: 'Declutter', description: 'Get rid of at least 30 items you no longer need.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'sm07', title: 'Screen Time Goal', description: 'Keep average daily screen time under 3 hours for the month.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'sm08', title: 'Write Something', description: 'Write and share an essay, blog post, or long-form piece.', stat: 'stamina', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },

  // ─── MANA DAILY (15) ─────────────────────────────────────────────────────
  { id: 'md01', title: 'Meditate', description: 'Practice meditation or mindfulness for at least 5 minutes.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md02', title: 'Create Something', description: 'Spend time on any creative activity: drawing, writing, music, etc.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md03', title: 'Read for 15 Minutes', description: 'Read a physical or digital book for at least 15 minutes.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md04', title: 'Act of Kindness', description: 'Do something kind for someone without being asked.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md05', title: 'Breathwork', description: 'Practice a breathing exercise for 5 minutes.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md06', title: 'Listen Deeply', description: 'Have a real conversation where you focus entirely on listening.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md07', title: 'Visualize Success', description: 'Spend 5 minutes vividly visualizing achieving a current goal.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md08', title: 'Limit Complaining', description: 'Consciously avoid complaining or venting for the entire day.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md09', title: 'Spend Time in Nature', description: 'Sit outside, away from pavement, for at least 10 minutes.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md10', title: 'Digital Gratitude', description: 'Send a genuine thank-you message to someone today.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md11', title: 'Affirmations', description: 'Repeat three positive affirmations about yourself out loud.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md12', title: 'Power Down Early', description: 'Turn off all screens at least one hour before bed.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md13', title: 'Sketch or Doodle', description: 'Draw or doodle freely for 10 minutes without judgment.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md14', title: 'Learn One Fact', description: 'Learn one interesting fact about a topic you know nothing about.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },
  { id: 'md15', title: 'Forgive Someone', description: 'Let go of a grievance and consciously forgive someone today.', stat: 'mana', tier: 'daily', barPoints: DAILY_BAR_PTS, xpValue: DAILY_XP },

  // ─── MANA WEEKLY (10) ────────────────────────────────────────────────────
  { id: 'mw01', title: 'Journaling Session', description: 'Write a reflective journal entry about your week.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'mw02', title: 'Attend an Event', description: 'Go to a cultural, social, or community event this week.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'mw03', title: 'Therapy or Check-in', description: 'Attend a therapy session or have a meaningful mental health check-in.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'mw04', title: 'Create and Share', description: 'Make something creative and share it with at least one person.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'mw05', title: 'Nature Walk', description: 'Take a walk somewhere natural — a park, trail, or forest.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'mw06', title: 'Volunteer', description: 'Give your time to help a cause, neighbor, or organization.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'mw07', title: 'Learn an Idea', description: 'Watch or listen to something educational for at least 30 minutes.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'mw08', title: 'Gratitude Letter', description: 'Write a detailed gratitude letter to someone who has helped you.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'mw09', title: 'Unplug Evening', description: 'Spend one entire evening with no screens — read, cook, or socialize.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },
  { id: 'mw10', title: 'Mind Map a Goal', description: 'Create a mind map or vision board for one of your goals.', stat: 'mana', tier: 'weekly', barPoints: WEEKLY_BAR_PTS, xpValue: WEEKLY_XP },

  // ─── MANA MONTHLY (8) ────────────────────────────────────────────────────
  { id: 'mm01', title: 'Complete a Creative Project', description: 'Finish a creative project you started — art, music, writing, or design.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'mm02', title: 'Meditate Daily for a Month', description: 'Meditate for at least 5 minutes every single day this month.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'mm03', title: 'Gratitude Practice Month', description: 'Write three things you are grateful for every day for the full month.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'mm04', title: 'Mental Detox', description: 'Avoid all news, social media, and negative content for 30 days.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'mm05', title: 'Host a Gathering', description: 'Organize and host a dinner, game night, or social event this month.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'mm06', title: 'Take a Course', description: 'Enroll in and complete an online course in any subject of interest.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'mm07', title: 'Explore a New Place', description: 'Visit a town, neighborhood, or location you have never been to.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
  { id: 'mm08', title: 'Act of Generosity', description: 'Give meaningfully to someone in need — money, time, or resources.', stat: 'mana', tier: 'monthly', barPoints: MONTHLY_BAR_PTS, xpValue: MONTHLY_XP },
]

export function getTemplatesByStatAndTier(
  stat: QuestTemplate['stat'],
  tier: QuestTemplate['tier']
): QuestTemplate[] {
  return QUEST_LIBRARY.filter(t => t.stat === stat && t.tier === tier)
}
