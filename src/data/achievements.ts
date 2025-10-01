import type { Achievement } from '@/types/achievements';

export const achievements: Achievement[] = [
  // 🏀 Scoring Badges
  {
    id: 'scoring-1k',
    title: '1K Scorer',
    description: 'Reach 1,000 career points',
    category: 'scoring',
    rarity: 'common',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '1,000+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-2-5k',
    title: '2.5K Scorer',
    description: 'Reach 2,500 career points',
    category: 'scoring',
    rarity: 'common',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '2,500+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-5k',
    title: '5K Scorer',
    description: 'Reach 5,000 career points',
    category: 'scoring',
    rarity: 'rare',
    icon: '🏀',
    type: 'Career Milestone',
    requirements: '5,000+ career points',
    badge: 'Career Points Milestones'
  },
  {
    id: 'scoring-40-bomb',
    title: '40 Bomb',
    description: 'Score 40+ in one game',
    category: 'scoring',
    rarity: 'rare',
    icon: '💥',
    type: 'Single Game',
    requirements: '40+ points in a single game',
    badge: 'Single Game'
  },
  {
    id: 'scoring-60-bomb',
    title: '60 Bomb',
    description: 'Score 60+ in one game',
    category: 'scoring',
    rarity: 'epic',
    icon: '💥',
    type: 'Single Game',
    requirements: '60+ points in a single game',
    badge: 'Single Game'
  },
  {
    id: 'scoring-100-club',
    title: '100 Club',
    description: 'Score 100+ in one game',
    category: 'scoring',
    rarity: 'legendary',
    icon: '💯',
    type: 'Single Game',
    requirements: '100+ points in a single game',
    badge: 'Single Game'
  },
  // 🎯 Assists Badges
  {
    id: 'assists-1k-dimes',
    title: '1K Dimes',
    description: '1,000 career assists',
    category: 'assists',
    rarity: 'common',
    icon: '🎯',
    type: 'Career Milestone',
    requirements: '1,000+ career assists',
    badge: 'Career Milestones'
  },
  {
    id: 'assists-double-dimes',
    title: 'Double Dimes',
    description: '20+ assists in a game',
    category: 'assists',
    rarity: 'epic',
    icon: '🎯',
    type: 'Single Game',
    requirements: '20+ assists in a single game',
    badge: 'Single Game'
  },
  // 🛡️ Defense Badges
  {
    id: 'defense-pickpocket',
    title: 'Pickpocket',
    description: '10+ steals in a game',
    category: 'defense',
    rarity: 'epic',
    icon: '🛡️',
    type: 'Steals',
    requirements: '10+ steals in a single game',
    badge: 'Steals'
  },
  {
    id: 'defense-shot-block-party',
    title: 'Shot Block Party',
    description: '8+ blocks in a game',
    category: 'defense',
    rarity: 'epic',
    icon: '🛡️',
    type: 'Blocks',
    requirements: '8+ blocks in a single game',
    badge: 'Blocks'
  },
  // 🪣 Rebounding Badges
  {
    id: 'rebounding-glass-cleaner',
    title: 'Glass Cleaner',
    description: '20+ rebounds in a game',
    category: 'rebounding',
    rarity: 'epic',
    icon: '🪣',
    type: 'Single Game',
    requirements: '20+ rebounds in a single game',
    badge: 'Single Game'
  },
  // 📊 Mixed Stat Badges
  {
    id: 'mixed-triple-double-machine',
    title: 'Triple-Double Machine',
    description: 'Triple-double in a game',
    category: 'mixed',
    rarity: 'legendary',
    icon: '📊',
    type: 'Mixed Stats',
    requirements: 'Triple-double in a single game',
    badge: 'Mixed Stat Badges'
  },
  // 🔥 Streak & Longevity Badges
  {
    id: 'streak-hot-streak',
    title: 'Hot Streak',
    description: '5 straight 20+ point games',
    category: 'streak',
    rarity: 'rare',
    icon: '🔥',
    type: 'Streak',
    requirements: '5 consecutive games with 20+ points',
    badge: 'Streak & Longevity'
  },
  // 🌟 Legendary / Rare Badges
  {
    id: 'legendary-perfect-game',
    title: 'Perfect Game',
    description: 'No turnovers, 100% FG, 10+ attempts',
    category: 'legendary',
    rarity: 'legendary',
    icon: '🌟',
    type: 'Legendary',
    requirements: 'No turnovers, 100% field goal percentage with 10+ attempts',
    badge: 'Legendary / Rare'
  }
];
