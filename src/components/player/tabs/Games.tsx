'use client';

import { useState } from 'react';
import GameDetailModal from '../GameDetailModal';

type GamesProps = {
  player: any;
  recentGames: any[];
};

export default function Games({ player, recentGames }: GamesProps) {
  const [selectedGame, setSelectedGame] = useState<any>(null);

  if (!player) return <div>Player not found</div>;

  return (
    <div>
      <h2 style="margin-bottom: 1.5rem; color: var(--color-text);">Game History</h2>
      
      {recentGames && recentGames.length > 0 ? (
        <div>
          <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <p class="text-secondary" style="margin: 0;">
              Showing {recentGames.length} recent games
            </p>
            <div style="display: flex; gap: 0.5rem; font-size: 0.875rem;">
              <span class="text-secondary">Click any row for details</span>
            </div>
          </div>

          <div style="overflow-x: auto; border: 1px solid var(--color-border); border-radius: 8px;">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-background)', borderBottom: '2px solid var(--color-border)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>PTS</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>AST</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>REB</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>STL</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>BLK</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>TOV</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>FG%</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>3PT%</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>📊</th>
                </tr>
              </thead>
              <tbody>
                {recentGames.map((game) => {
                  const matchData = Array.isArray(game.matches) ? game.matches[0] : game.matches;
                  const hasBoxscore = matchData?.boxscore_url;
                  const fgPercentage = game.fga && game.fga > 0 ? ((game.fgm || 0) / game.fga * 100).toFixed(1) : '0.0';
                  const threePtPercentage = game.three_points_attempted && game.three_points_attempted > 0 
                    ? ((game.three_points_made || 0) / game.three_points_attempted * 100).toFixed(1) 
                    : '0.0';
                  
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
                      <td style={{ padding: '1rem' }}>
                        {matchData?.played_at 
                          ? new Date(matchData.played_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            }) 
                          : 'N/A'}
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'center',
                        fontWeight: game.points >= 20 ? '700' : '400', 
                        color: game.points >= 20 ? '#9BF00B' : 'inherit' 
                      }}>
                        {game.points || 0}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{game.assists || 0}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{game.rebounds || 0}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{game.steals || 0}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{game.blocks || 0}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{game.turnovers || 0}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{fgPercentage}%</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>{threePtPercentage}%</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
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

          {/* Game Averages */}
          {recentGames.length > 0 && (
            <div class="paper" style="margin-top: 2rem; padding: 1.5rem;">
              <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Recent Averages (Last {recentGames.length} games)</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                <div style="text-align: center;">
                  <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Points</div>
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
                    {(recentGames.reduce((sum, game) => sum + (game.points || 0), 0) / recentGames.length).toFixed(1)}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Assists</div>
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
                    {(recentGames.reduce((sum, game) => sum + (game.assists || 0), 0) / recentGames.length).toFixed(1)}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Rebounds</div>
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
                    {(recentGames.reduce((sum, game) => sum + (game.rebounds || 0), 0) / recentGames.length).toFixed(1)}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Steals</div>
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
                    {(recentGames.reduce((sum, game) => sum + (game.steals || 0), 0) / recentGames.length).toFixed(1)}
                  </div>
                </div>
                <div style="text-align: center;">
                  <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Blocks</div>
                  <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
                    {(recentGames.reduce((sum, game) => sum + (game.blocks || 0), 0) / recentGames.length).toFixed(1)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div class="paper" style="padding: 2rem; text-align: center;">
          <p class="text-secondary" style="margin: 0; font-size: 1.125rem;">
            No games found for this player
          </p>
        </div>
      )}

      {selectedGame && (
        <GameDetailModal 
          game={selectedGame} 
          isOpen={true} 
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}
