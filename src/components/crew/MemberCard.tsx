'use client';

import { useState } from 'react';

type Member = {
  id: string;
  gamertag: string;
  position: string | null;
  player_rp: number | null;
  performance_score: number | null;
};

export default function MemberCard({ member }: { member: Member }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a 
      href={`/player/${member.id}`} 
      className="card" 
      style={{ 
        textDecoration: 'none', 
        color: 'inherit',
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 0.2s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h4 style={{ margin: '0 0 0.5rem' }}>{member.gamertag}</h4>
      <p className="text-secondary" style={{ fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
        {member.position || 'Position Unknown'}
      </p>
      {member.player_rp && (
        <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-primary)' }}>
          {member.player_rp} RP
        </p>
      )}
      {isHovered && (
        <div style={{ 
          marginTop: '0.75rem', 
          paddingTop: '0.75rem', 
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)'
        }}>
          Click to view full profile →
        </div>
      )}
    </a>
  );
}

