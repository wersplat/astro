'use client';

import { useState } from 'react';

type Crew = {
  id: string;
  crewName: string | null;
  crewRegion: string | null;
  crewRank: number | null;
  crew_logo: string | null;
};

export default function CrewCard({ crew }: { crew: Crew }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a 
      href={`/crew/${crew.id}`}
      className="card"
      style={{ 
        textDecoration: 'none', 
        color: 'inherit',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 25px rgba(0, 0, 0, 0.5)' : '',
        transition: 'all 0.2s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        {crew.crew_logo && (
          <img 
            src={crew.crew_logo} 
            alt={crew.crewName || 'Crew'} 
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 0.25rem' }}>{crew.crewName}</h3>
          <p className="text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>
            {crew.crewRegion || 'Region Unknown'}
          </p>
        </div>
        {crew.crewRank && (
          <div style={{ textAlign: 'right' }}>
            <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Rank</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>
              #{crew.crewRank}
            </div>
          </div>
        )}
      </div>
    </a>
  );
}

