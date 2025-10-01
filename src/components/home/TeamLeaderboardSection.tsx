import { useEffect, useState } from 'react';
import LoadingPlaceholder from '../ui/LoadingPlaceholder';

type Team = {
  id: string;
  name: string;
  logo_url?: string;
  current_rp: number;
  global_rank: number;
  playerCount: number;
};

export default function TeamLeaderboardSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teams?limit=10&sort=rank')
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load team leaderboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingPlaceholder message="Loading team rankings..." />;
  }

  return (
    <div className="paper">
      <h2 style={{ marginTop: 0 }}>Top Teams</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {teams.slice(0, 10).map((team, index) => (
          <div 
            key={team.id} 
            className="card"
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ 
                fontWeight: 800, 
                fontSize: '1.25rem',
                color: index < 3 ? 'var(--color-secondary)' : 'var(--color-text-secondary)',
                minWidth: '2rem'
              }}>
                #{index + 1}
              </span>
              <div>
                <div style={{ fontWeight: 600 }}>{team.name}</div>
                <div className="text-secondary" style={{ fontSize: '0.875rem' }}>
                  {team.playerCount || 0} players
                </div>
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                {team.current_rp?.toFixed(0) || '—'}
              </div>
              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                Rating
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <a href="/teams" className="button button-secondary" style={{ 
        marginTop: '1.5rem', 
        display: 'inline-block',
        textDecoration: 'none',
        width: '100%',
        textAlign: 'center'
      }}>
        View All Teams
      </a>
    </div>
  );
}
