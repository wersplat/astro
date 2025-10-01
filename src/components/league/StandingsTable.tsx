'use client';

import { useState } from 'react';

type Team = {
  team_id: string;
  team_name: string;
  wins?: number;
  losses?: number;
  current_rp?: number;
  logo_url?: string;
};

export default function StandingsTable({ teams }: { teams: Team[] }) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getWinPercentage = (wins: number, losses: number) => {
    const total = wins + losses;
    return total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';
  };

  return (
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
            const winPct = getWinPercentage(wins, losses);
            
            return (
              <tr 
                key={team.team_id}
                style={{ 
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: hoveredRow === team.team_id ? 'var(--color-background)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={() => setHoveredRow(team.team_id)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => window.location.href = `/team/${team.team_id}`}
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
  );
}

