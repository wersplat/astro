import { useEffect, useState } from 'react';
import LoadingPlaceholder from '../ui/LoadingPlaceholder';

type Player = {
  id: string;
  gamertag: string;
  position: string | null;
  player_rank_score: number;
  team_name: string | null;
};

export default function LeaderboardSection() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/players?limit=10&sort=rank')
      .then(res => res.json())
      .then(data => {
        setPlayers(data.players || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load leaderboard:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingPlaceholder message="Loading leaderboard..." />;
  }

  return (
    <div className="paper">
      <h2 style={{ marginTop: 0 }}>Top Players</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {players.slice(0, 10).map((player, index) => (
          <div 
            key={player.id} 
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
                color: index < 3 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                minWidth: '2rem'
              }}>
                #{index + 1}
              </span>
              <div>
                <div style={{ fontWeight: 600 }}>{player.gamertag}</div>
                {player.team_name && (
                  <div className="text-secondary" style={{ fontSize: '0.875rem' }}>
                    {player.team_name}
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                {player.player_rank_score?.toFixed(0) || '—'}
              </div>
              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                Rating
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <a href="/players" className="button" style={{ 
        marginTop: '1.5rem', 
        display: 'inline-block',
        textDecoration: 'none',
        width: '100%',
        textAlign: 'center'
      }}>
        View Full Leaderboard
      </a>
    </div>
  );
}
