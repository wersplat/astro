'use client';

import { useState } from 'react';

type Game = {
  id: string;
  match_id: string;
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  matches?: any;
};

export default function RecentGamesTable({ games }: { games: Game[] }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Date</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>PTS</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>AST</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>REB</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>STL</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>BLK</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr 
              key={game.id}
              style={{ 
                borderBottom: '1px solid var(--color-border)',
                cursor: 'pointer',
                backgroundColor: expandedRow === game.id ? 'var(--color-background)' : 'transparent'
              }}
              onClick={() => setExpandedRow(expandedRow === game.id ? null : game.id)}
              onMouseOver={(e) => {
                if (expandedRow !== game.id) {
                  e.currentTarget.style.backgroundColor = 'var(--color-background)';
                }
              }}
              onMouseOut={(e) => {
                if (expandedRow !== game.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <td style={{ padding: '0.75rem' }}>
                {game.matches?.played_at ? new Date(game.matches.played_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
              </td>
              <td style={{ padding: '0.75rem', fontWeight: game.points >= 20 ? '700' : '400', color: game.points >= 20 ? 'var(--color-primary)' : 'inherit' }}>
                {game.points || 0}
              </td>
              <td style={{ padding: '0.75rem' }}>{game.assists || 0}</td>
              <td style={{ padding: '0.75rem' }}>{game.rebounds || 0}</td>
              <td style={{ padding: '0.75rem' }}>{game.steals || 0}</td>
              <td style={{ padding: '0.75rem' }}>{game.blocks || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

