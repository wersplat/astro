'use client';

import { useState } from 'react';

type Match = {
  id: string;
  played_at: string;
  team_a_id: string;
  team_b_id: string;
  score_a: number;
  score_b: number;
  boxscore_url?: string;
};

export default function MatchCard({ match, teamId }: { match: Match; teamId: string }) {
  const [showDetails, setShowDetails] = useState(false);

  const isTeamA = match.team_a_id === teamId;
  const teamScore = isTeamA ? match.score_a : match.score_b;
  const oppScore = isTeamA ? match.score_b : match.score_a;
  const won = teamScore > oppScore;

  return (
    <div 
      className="card" 
      style={{ 
        padding: '1rem',
        cursor: 'pointer',
        borderLeft: `4px solid ${won ? '#10B981' : '#EF4444'}`,
        transition: 'all 0.2s'
      }}
      onClick={() => setShowDetails(!showDetails)}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-background)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ 
            color: won ? '#10B981' : '#EF4444', 
            fontWeight: '700',
            fontSize: '1.125rem',
            marginRight: '1rem'
          }}>
            {won ? 'W' : 'L'}
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            {teamScore} - {oppScore}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>
            {new Date(match.played_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
            {showDetails ? 'Click to collapse' : 'Click for details'}
          </p>
        </div>
      </div>
      
      {showDetails && (
        <div style={{ 
          marginTop: '1rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid var(--color-border)' 
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: match.boxscore_url ? '1rem' : '0' }}>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.75rem', margin: '0 0 0.25rem' }}>
                Team Score
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'var(--color-primary)' }}>
                {teamScore}
              </p>
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.75rem', margin: '0 0 0.25rem' }}>
                Opponent Score
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                {oppScore}
              </p>
            </div>
          </div>
          
          {match.boxscore_url && (
            <div style={{ marginTop: '1rem' }}>
              <p className="text-secondary" style={{ fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
                Boxscore
              </p>
              <div style={{ 
                border: '2px solid var(--color-border)', 
                borderRadius: '4px', 
                overflow: 'hidden',
                backgroundColor: 'var(--color-background)'
              }}>
                <img 
                  src={match.boxscore_url} 
                  alt="Match Boxscore" 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

