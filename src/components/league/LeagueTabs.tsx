'use client';

import { useState } from 'react';

type Team = {
  team_id: string;
  team_name: string;
  logo_url?: string;
  current_rp?: number;
  wins?: number;
  losses?: number;
};

type PlayerStat = {
  player_id: string;
  gamertag: string;
  team_name?: string;
  points?: number;
  assists?: number;
  rebounds?: number;
  games?: number;
};

type LeagueTabsProps = {
  teams: Team[];
  playerStats: PlayerStat[];
  totalMatches: number;
};

export default function LeagueTabs({ teams, playerStats, totalMatches }: LeagueTabsProps) {
  const [activeTab, setActiveTab] = useState<'standings' | 'team-stats' | 'player-stats'>('standings');

  const tabs = [
    { id: 'standings', label: 'Standings', count: teams.length },
    { id: 'team-stats', label: 'Team Stats', count: teams.length },
    { id: 'player-stats', label: 'Player Stats', count: playerStats.length }
  ];

  return (
    <div>
      {/* Tab Headers */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        borderBottom: '2px solid var(--color-border)',
        flexWrap: 'wrap'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: activeTab === tab.id ? '700' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-2px',
              fontSize: '1rem'
            }}
            onMouseOver={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
              }
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'standings' && (
        <div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Rank</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Team</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>W</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>L</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Win%</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'right', color: 'var(--color-text-secondary)', fontWeight: '600' }}>RP</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, idx) => {
                  const wins = team.wins || 0;
                  const losses = team.losses || 0;
                  const total = wins + losses;
                  const winPct = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <tr 
                      key={team.team_id}
                      style={{ 
                        borderBottom: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={() => window.location.href = `/team/${team.team_id}`}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '0.75rem', fontWeight: idx < 3 ? '700' : '400' }}>
                        <span style={{ color: idx === 0 ? '#F59E08' : idx === 1 ? '#94A3B8' : idx === 2 ? '#CD7F32' : 'inherit' }}>
                          {idx + 1}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {team.logo_url && (
                            <img 
                              src={team.logo_url} 
                              alt={team.team_name} 
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          )}
                          <span style={{ fontWeight: '600' }}>{team.team_name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10B981', fontWeight: '600' }}>
                        {wins}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', color: '#EF4444', fontWeight: '600' }}>
                        {losses}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {winPct}%
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--color-primary)', fontWeight: '700' }}>
                        {team.current_rp || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'team-stats' && (
        <div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Team</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>GP</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>W</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>L</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Win%</th>
                  <th style={{ padding: '1rem 0.75rem', textAlign: 'right', color: 'var(--color-text-secondary)', fontWeight: '600' }}>RP</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => {
                  const wins = team.wins || 0;
                  const losses = team.losses || 0;
                  const gp = wins + losses;
                  const winPct = gp > 0 ? ((wins / gp) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <tr 
                      key={team.team_id}
                      style={{ 
                        borderBottom: '1px solid var(--color-border)',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.location.href = `/team/${team.team_id}`}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {team.logo_url && (
                            <img 
                              src={team.logo_url} 
                              alt={team.team_name} 
                              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          )}
                          <span style={{ fontWeight: '600' }}>{team.team_name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>{gp}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10B981', fontWeight: '600' }}>{wins}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', color: '#EF4444', fontWeight: '600' }}>{losses}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>{winPct}%</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--color-primary)', fontWeight: '700' }}>
                        {team.current_rp || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'player-stats' && (
        <div>
          {playerStats.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '1rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Player</th>
                    <th style={{ padding: '1rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Team</th>
                    <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>GP</th>
                    <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>PPG</th>
                    <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>APG</th>
                    <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>RPG</th>
                  </tr>
                </thead>
                <tbody>
                  {playerStats.map((player) => (
                    <tr 
                      key={player.player_id}
                      style={{ 
                        borderBottom: '1px solid var(--color-border)',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.location.href = `/player/${player.player_id}`}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>
                        {player.gamertag}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {player.team_name || '-'}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {player.games || 0}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', color: 'var(--color-primary)' }}>
                        {((player.points || 0) / (player.games || 1)).toFixed(1)}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {((player.assists || 0) / (player.games || 1)).toFixed(1)}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {((player.rebounds || 0) / (player.games || 1)).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-secondary">No player statistics available</p>
          )}
        </div>
      )}
    </div>
  );
}

