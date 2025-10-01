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
  turnovers?: number;
  fgm?: number;
  fga?: number;
  three_points_made?: number;
  three_points_attempted?: number;
  matches?: {
    id: string;
    played_at: string;
    boxscore_url?: string;
  } | {
    id: string;
    played_at: string;
    boxscore_url?: string;
  }[];
};

export default function GameDetailModal({ 
  game, 
  isOpen, 
  onClose 
}: { 
  game: Game; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const matchData = Array.isArray(game.matches) ? game.matches[0] : game.matches;
  const boxscoreUrl = matchData?.boxscore_url;

  const fgPct = game.fga && game.fga > 0 ? ((game.fgm || 0) / game.fga * 100).toFixed(1) : '0.0';
  const threePct = game.three_points_attempted && game.three_points_attempted > 0 
    ? ((game.three_points_made || 0) / game.three_points_attempted * 100).toFixed(1) 
    : '0.0';

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        className="paper"
        style={{
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--color-surface)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem' }}>Game Details</h2>
          <p className="text-secondary" style={{ margin: 0 }}>
            {matchData?.played_at 
              ? new Date(matchData.played_at).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric' 
                })
              : 'Date unknown'}
          </p>
        </div>

        {/* Boxscore Screenshot */}
        {boxscoreUrl && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Boxscore</h3>
            <div style={{ 
              border: '2px solid var(--color-border)', 
              borderRadius: '8px', 
              overflow: 'hidden',
              backgroundColor: 'var(--color-background)'
            }}>
              <img 
                src={boxscoreUrl} 
                alt="Game Boxscore" 
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        )}

        {/* Player Stats */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Player Performance</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              backgroundColor: 'var(--color-background)', 
              padding: '1rem', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Points</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: game.points >= 20 ? '#9BF00B' : 'var(--color-primary)' }}>
                {game.points}
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'var(--color-background)', 
              padding: '1rem', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Assists</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                {game.assists}
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'var(--color-background)', 
              padding: '1rem', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Rebounds</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                {game.rebounds}
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'var(--color-background)', 
              padding: '1rem', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Steals</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                {game.steals}
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'var(--color-background)', 
              padding: '1rem', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Blocks</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                {game.blocks}
              </div>
            </div>

            {game.turnovers !== undefined && (
              <div style={{ 
                backgroundColor: 'var(--color-background)', 
                padding: '1rem', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Turnovers</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#EF4444' }}>
                  {game.turnovers}
                </div>
              </div>
            )}
          </div>

          {/* Shooting Stats */}
          {(game.fgm !== undefined || game.three_points_made !== undefined) && (
            <div style={{ 
              backgroundColor: 'var(--color-background)', 
              padding: '1rem', 
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Shooting</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {game.fgm !== undefined && (
                  <div>
                    <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Field Goals</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                      {game.fgm}/{game.fga} ({fgPct}%)
                    </div>
                  </div>
                )}
                {game.three_points_made !== undefined && (
                  <div>
                    <div className="text-secondary" style={{ fontSize: '0.875rem' }}>3-Pointers</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                      {game.three_points_made}/{game.three_points_attempted} ({threePct}%)
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          className="button"
          onClick={onClose}
          style={{ width: '100%', padding: '0.75rem' }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

