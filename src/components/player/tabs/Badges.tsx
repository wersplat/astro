'use client';

import { useState, useEffect } from 'react';

type BadgesProps = {
  player: any;
  playerId: string;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
};

export default function Badges({ player, playerId }: BadgesProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        setError(null);

        // This would typically be an API call to get player badges
        // For now, we'll use mock data
        const mockBadges: Badge[] = [
          {
            id: '1',
            name: 'First Game',
            description: 'Play your first game',
            icon: '🎮',
            category: 'Milestone',
            rarity: 'common',
            unlocked: true,
            unlockedAt: '2024-01-15'
          },
          {
            id: '2',
            name: 'Point Scorer',
            description: 'Score 20+ points in a single game',
            icon: '🏀',
            category: 'Scoring',
            rarity: 'common',
            unlocked: true,
            unlockedAt: '2024-01-20'
          },
          {
            id: '3',
            name: 'Triple Double',
            description: 'Record a triple double (10+ points, assists, rebounds)',
            icon: '⭐',
            category: 'Performance',
            rarity: 'rare',
            unlocked: false,
            progress: 7,
            maxProgress: 10
          },
          {
            id: '4',
            name: 'Sharpshooter',
            description: 'Make 5+ three-pointers in a game',
            icon: '🎯',
            category: 'Shooting',
            rarity: 'common',
            unlocked: true,
            unlockedAt: '2024-02-01'
          },
          {
            id: '5',
            name: 'Defensive Anchor',
            description: 'Record 5+ steals and blocks combined in a game',
            icon: '🛡️',
            category: 'Defense',
            rarity: 'rare',
            unlocked: false,
            progress: 3,
            maxProgress: 5
          },
          {
            id: '6',
            name: 'Legendary Performance',
            description: 'Score 50+ points in a single game',
            icon: '👑',
            category: 'Legendary',
            rarity: 'legendary',
            unlocked: false,
            progress: 0,
            maxProgress: 50
          },
          {
            id: '7',
            name: 'Team Player',
            description: 'Record 10+ assists in a game',
            icon: '🤝',
            category: 'Assists',
            rarity: 'common',
            unlocked: true,
            unlockedAt: '2024-01-25'
          },
          {
            id: '8',
            name: 'Glass Cleaner',
            description: 'Grab 15+ rebounds in a game',
            icon: '🏆',
            category: 'Rebounding',
            rarity: 'epic',
            unlocked: false,
            progress: 12,
            maxProgress: 15
          }
        ];

        setBadges(mockBadges);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load badges');
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchBadges();
    }
  }, [playerId]);

  if (!player) return <div>Player not found</div>;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#6B7280';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E08';
      default: return '#6B7280';
    }
  };

  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'rgba(107, 114, 128, 0.1)';
      case 'rare': return 'rgba(59, 130, 246, 0.1)';
      case 'epic': return 'rgba(139, 92, 246, 0.1)';
      case 'legendary': return 'rgba(245, 158, 8, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const filteredBadges = badges.filter(badge => {
    if (filter === 'unlocked') return badge.unlocked;
    if (filter === 'locked') return !badge.unlocked;
    return true;
  });

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;

  if (loading) {
    return (
      <div>
        <h2 style="margin-bottom: 1.5rem; color: var(--color-text);">Badges & Achievements</h2>
        <div class="paper" style="padding: 2rem; text-align: center;">
          <p class="text-secondary">Loading badges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style="margin-bottom: 1.5rem; color: var(--color-text);">Badges & Achievements</h2>
        <div class="paper" style="padding: 2rem; text-align: center;">
          <p style="color: #ef4444;">Error loading badges: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="margin: 0; color: var(--color-text);">Badges & Achievements</h2>
        <div style="display: flex; gap: 0.5rem;">
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: filter === 'all' ? 'var(--color-primary)' : 'transparent',
              color: filter === 'all' ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: filter === 'unlocked' ? 'var(--color-primary)' : 'transparent',
              color: filter === 'unlocked' ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: filter === 'locked' ? 'var(--color-primary)' : 'transparent',
              color: filter === 'locked' ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>
      </div>

      {/* Progress Summary */}
      <div class="paper" style="padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Progress Summary</h3>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span class="text-secondary">Badges Unlocked</span>
              <span style="font-weight: 600;">{unlockedCount} / {totalCount}</span>
            </div>
            <div style="width: 100%; height: 8px; background: var(--color-border); border-radius: 4px; overflow: hidden;">
              <div 
                style={{
                  width: `${(unlockedCount / totalCount) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--color-primary), #9BF00B)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
          <div style="text-align: center; min-width: 80px;">
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            <div class="text-secondary" style="font-size: 0.875rem;">Complete</div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
        {filteredBadges.map((badge) => (
          <div 
            key={badge.id}
            style={{
              padding: '1.5rem',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              background: badge.unlocked ? 'var(--color-surface)' : 'var(--color-background)',
              opacity: badge.unlocked ? 1 : 0.6,
              transition: 'all 0.2s ease'
            }}
          >
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              <div 
                style={{
                  fontSize: '2rem',
                  opacity: badge.unlocked ? 1 : 0.5
                }}
              >
                {badge.icon}
              </div>
              <div style="flex: 1;">
                <h4 style="margin: 0 0 0.25rem 0; color: var(--color-text); font-size: 1.125rem;">
                  {badge.name}
                </h4>
                <div 
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: getRarityBgColor(badge.rarity),
                    color: getRarityColor(badge.rarity),
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  {badge.rarity}
                </div>
              </div>
            </div>

            <p style="margin: 0 0 1rem 0; color: var(--color-text-secondary); font-size: 0.875rem; line-height: 1.5;">
              {badge.description}
            </p>

            {badge.unlocked ? (
              <div style="display: flex; align-items: center; gap: 0.5rem; color: #9BF00B; font-size: 0.875rem; font-weight: 600;">
                <span>✓</span>
                <span>Unlocked {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : ''}</span>
              </div>
            ) : (
              <div>
                {badge.progress !== undefined && badge.maxProgress !== undefined ? (
                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
                      <span class="text-secondary">Progress</span>
                      <span style="font-weight: 600;">{badge.progress} / {badge.maxProgress}</span>
                    </div>
                    <div style="width: 100%; height: 6px; background: var(--color-border); border-radius: 3px; overflow: hidden;">
                      <div 
                        style={{
                          width: `${(badge.progress / badge.maxProgress) * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--color-primary), #9BF00B)',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style="color: var(--color-text-secondary); font-size: 0.875rem;">
                    Not started
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div class="paper" style="padding: 2rem; text-align: center;">
          <p class="text-secondary" style="margin: 0; font-size: 1.125rem;">
            No badges found for the selected filter
          </p>
        </div>
      )}
    </div>
  );
}
