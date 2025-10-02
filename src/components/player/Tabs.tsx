'use client';

import { useState } from 'react';
import Overview from './tabs/Overview';
import Games from './tabs/Games';
import Career from './tabs/Career';
import Badges from './tabs/Badges';
import Media from './tabs/Media';

type TabsProps = {
  player: any;
  team: any;
  recentGames: any[];
  playerId: string;
};

export default function Tabs({ player, team, recentGames, playerId }: TabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'games', label: 'Games' },
    { id: 'career', label: 'Career' },
    { id: 'badges', label: 'Badges' },
    { id: 'media', label: 'Media' }
  ];

  return (
    <div class="paper">
      {/* Tab Navigation */}
      <div style="display: flex; border-bottom: 2px solid var(--color-border); margin-bottom: 2rem;">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: activeTab === tab.id ? '600' : '400',
              transition: 'all 0.2s ease',
              backgroundColor: activeTab === tab.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
            }}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = 'var(--color-text)';
                e.currentTarget.style.backgroundColor = 'var(--color-background)';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <Overview player={player} team={team} />
        )}
        {activeTab === 'games' && (
          <Games player={player} recentGames={recentGames} />
        )}
        {activeTab === 'career' && (
          <Career player={player} playerId={playerId} />
        )}
        {activeTab === 'badges' && (
          <Badges player={player} playerId={playerId} />
        )}
        {activeTab === 'media' && (
          <Media player={player} playerId={playerId} />
        )}
      </div>
    </div>
  );
}
