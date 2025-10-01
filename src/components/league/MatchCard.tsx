'use client';

import { useState } from 'react';

type Match = {
  id: string;
  played_at: string;
  team_a_id: string;
  team_b_id: string;
  score_a: number;
  score_b: number;
  team_a?: { name: string; logo_url?: string; } | { name: string; logo_url?: string; }[];
  team_b?: { name: string; logo_url?: string; } | { name: string; logo_url?: string; }[];
};

export default function LeagueMatchCard({ match }: { match: Match }) {
  const [isHovered, setIsHovered] = useState(false);

  const teamA = Array.isArray(match.team_a) ? match.team_a[0] : match.team_a;
  const teamB = Array.isArray(match.team_b) ? match.team_b[0] : match.team_b;

  return (
    <div 
      className="card" 
      style={{ 
        padding: '1rem',
        backgroundColor: isHovered ? 'var(--color-background)' : 'var(--color-surface)',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <a 
            href={`/team/${match.team_a_id}`}
            style={{ 
              color: 'var(--color-text-primary)', 
              textDecoration: 'none', 
              fontWeight: '600',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
          >
            {teamA?.logo_url && (
              <img 
                src={teamA.logo_url} 
                alt={teamA.name} 
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            {teamA?.name || 'Team A'}
          </a>
          
          <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>
            {match.score_a} - {match.score_b}
          </span>
          
          <a 
            href={`/team/${match.team_b_id}`}
            style={{ 
              color: 'var(--color-text-primary)', 
              textDecoration: 'none', 
              fontWeight: '600',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
          >
            {teamB?.logo_url && (
              <img 
                src={teamB.logo_url} 
                alt={teamB.name} 
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
              />
            )}
            {teamB?.name || 'Team B'}
          </a>
        </div>
        
        <p className="text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>
          {new Date(match.played_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}

