'use client';

import { useState } from 'react';
import GameDetailModal from './GameDetailModal';

type Game = {
  id: string;
  match_id: string;
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  turnovers?: number;
  fgm?: number;
  fga?: number;
  three_points_made?: number;
  three_points_attempted?: number;
  matches?: any;
};

export default function RecentGamesTable({ games }: { games: Game[] }) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const matchData = (game: Game) => Array.isArray(game.matches) ? game.matches[0] : game.matches;

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Date</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>PTS</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>AST</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>REB</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>STL</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>BLK</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                {matchData(games[0])?.boxscore_url ? '📊' : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => {
              const hasBoxscore = matchData(game)?.boxscore_url;
              
              return (
                <tr 
                  key={game.id}
                  style={{ 
                    borderBottom: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onClick={() => setSelectedGame(game)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '0.75rem' }}>
                    {matchData(game)?.played_at 
                      ? new Date(matchData(game).played_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
                      : 'N/A'}
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: game.points >= 20 ? '700' : '400', color: game.points >= 20 ? '#9BF00B' : 'inherit' }}>
                    {game.points || 0}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{game.assists || 0}</td>
                  <td style={{ padding: '0.75rem' }}>{game.rebounds || 0}</td>
                  <td style={{ padding: '0.75rem' }}>{game.steals || 0}</td>
                  <td style={{ padding: '0.75rem' }}>{game.blocks || 0}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {hasBoxscore && (
                      <span style={{ fontSize: '1.25rem' }}>📊</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedGame && (
        <GameDetailModal 
          game={selectedGame} 
          isOpen={true} 
          onClose={() => setSelectedGame(null)}
        />
      )}
    </>
  );
}

