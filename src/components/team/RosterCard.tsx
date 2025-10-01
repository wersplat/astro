'use client';

import { useState } from 'react';

type Player = {
  player_id: string;
  position?: string;
  is_captain?: boolean;
  is_player_coach?: boolean;
  joined_at?: string;
  player?: {
    id: string;
    gamertag: string;
    position: string;
    player_rp?: number;
    performance_score?: number;
  };
};

export default function RosterCard({ player }: { player: Player }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <a 
      href={`/player/${player.player?.id}`}
      className="card" 
      style={{ 
        textDecoration: 'none', 
        color: 'inherit',
        position: 'relative',
        transition: 'all 0.2s'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <h4 style={{ margin: '0 0 0.5rem' }}>
        {player.player?.gamertag}
        {player.is_captain && (
          <span style={{ 
            marginLeft: '0.5rem', 
            fontSize: '0.75rem', 
            padding: '0.125rem 0.375rem', 
            borderRadius: '4px', 
            background: 'rgba(245, 158, 8, 0.2)', 
            color: '#F59E08' 
          }}>
            C
          </span>
        )}
        {player.is_player_coach && (
          <span style={{ 
            marginLeft: '0.5rem', 
            fontSize: '0.75rem', 
            padding: '0.125rem 0.375rem', 
            borderRadius: '4px', 
            background: 'rgba(59, 130, 246, 0.2)', 
            color: '#3B82F6' 
          }}>
            PC
          </span>
        )}
      </h4>
      <p className="text-secondary" style={{ fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
        {player.player?.position || player.position || 'No Position'}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {player.player?.player_rp !== undefined && player.player.player_rp > 0 && (
          <span style={{ margin: 0, fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.875rem' }}>
            {player.player.player_rp} RP
          </span>
        )}
        {player.player?.performance_score !== undefined && player.player.performance_score > 0 && (
          <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
            PS: {Math.round(player.player.performance_score)}
          </span>
        )}
      </div>
      {player.joined_at && (
        <p className="text-secondary" style={{ fontSize: '0.75rem', margin: '0.5rem 0 0', fontStyle: 'italic' }}>
          Joined: {new Date(player.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      )}

      {showTooltip && (
        <div style={{
          position: 'absolute',
          top: '-2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--color-surface)',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.75rem',
          whiteSpace: 'nowrap',
          zIndex: 10,
          border: '1px solid var(--color-border)'
        }}>
          Click to view profile
        </div>
      )}
    </a>
  );
}

