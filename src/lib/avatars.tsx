'use client'

import type { AvatarDefinition } from '@/types'

const size = { width: 64, height: 64 }
const fill = 'currentColor'

function ShieldIcon() {
  return (
    <svg {...size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 6L10 16v16c0 12 10 22 22 26 12-4 22-14 22-26V16L32 6z" fill={fill} opacity="0.9" />
      <path d="M24 32l6 6 10-12" stroke="#0f0f1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StaffIcon() {
  return (
    <svg {...size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="32" y1="8" x2="32" y2="56" stroke={fill} strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="12" r="8" fill={fill} opacity="0.9" />
      <path d="M26 12 Q32 6 38 12" stroke="#0f0f1a" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

function LuteIcon() {
  return (
    <svg {...size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="38" rx="14" ry="18" fill={fill} opacity="0.9" />
      <line x1="30" y1="20" x2="38" y2="8" stroke={fill} strokeWidth="3" strokeLinecap="round" />
      <circle cx="30" cy="38" r="4" fill="#0f0f1a" />
      <line x1="22" y1="34" x2="38" y2="34" stroke="#0f0f1a" strokeWidth="1.5" />
      <line x1="21" y1="40" x2="39" y2="40" stroke="#0f0f1a" strokeWidth="1.5" />
    </svg>
  )
}

function DaggerIcon() {
  return (
    <svg {...size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L28 52h8L32 8z" fill={fill} opacity="0.9" />
      <rect x="22" y="46" width="20" height="5" rx="2" fill={fill} />
      <rect x="28" y="51" width="8" height="8" rx="2" fill={fill} opacity="0.7" />
    </svg>
  )
}

function BowIcon() {
  return (
    <svg {...size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8 Q8 32 16 56" stroke={fill} strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="16" y1="8" x2="16" y2="56" stroke={fill} strokeWidth="2" strokeDasharray="4 3" />
      <line x1="16" y1="32" x2="52" y2="32" stroke={fill} strokeWidth="2" strokeLinecap="round" />
      <polygon points="52,32 44,28 44,36" fill={fill} />
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg {...size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 44L16 20l16 14L48 20l8 24H8z" fill={fill} opacity="0.9" />
      <rect x="8" y="44" width="48" height="8" rx="2" fill={fill} />
      <circle cx="16" cy="20" r="4" fill={fill} />
      <circle cx="32" cy="16" r="4" fill={fill} />
      <circle cx="48" cy="20" r="4" fill={fill} />
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg {...size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8C32 8 20 22 20 36a12 12 0 0 0 24 0C44 28 36 20 32 8z" fill={fill} opacity="0.9" />
      <path d="M32 28C32 28 26 36 26 42a6 6 0 0 0 12 0C38 36 32 28 32 28z" fill="#0f0f1a" opacity="0.4" />
    </svg>
  )
}

function ScrollIcon() {
  return (
    <svg {...size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="12" width="36" height="44" rx="4" fill={fill} opacity="0.9" />
      <rect x="10" y="12" width="8" height="44" rx="4" fill={fill} opacity="0.7" />
      <rect x="46" y="12" width="8" height="44" rx="4" fill={fill} opacity="0.7" />
      <line x1="22" y1="24" x2="42" y2="24" stroke="#0f0f1a" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="32" x2="42" y2="32" stroke="#0f0f1a" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="40" x2="36" y2="40" stroke="#0f0f1a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export const AVATARS: AvatarDefinition[] = [
  { id: 'shield', name: 'Shield Bearer', svg: <ShieldIcon /> },
  { id: 'staff', name: 'Staff Wielder', svg: <StaffIcon /> },
  { id: 'lute', name: 'Lute Player', svg: <LuteIcon /> },
  { id: 'dagger', name: 'Dagger Rogue', svg: <DaggerIcon /> },
  { id: 'bow', name: 'Bow Hunter', svg: <BowIcon /> },
  { id: 'crown', name: 'Crown Bearer', svg: <CrownIcon /> },
  { id: 'flame', name: 'Flame Caster', svg: <FlameIcon /> },
  { id: 'scroll', name: 'Scroll Keeper', svg: <ScrollIcon /> },
]

export function getAvatar(id: string): AvatarDefinition {
  return AVATARS.find(a => a.id === id) ?? AVATARS[0]
}
