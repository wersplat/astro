import { useEffect, useState } from 'react';
import LoadingPlaceholder from '../ui/LoadingPlaceholder';

type SearchParamsType = {
  search?: string;
  position?: string;
  team?: string;
  sort?: string;
  page?: string;
};

type Player = {
  id: string;
  gamertag: string;
  position: string | null;
  player_rank_score: number;
  team_name: string | null;
  games_played: number;
};

function getRoleColor(position: string | null | undefined) {
  if (!position) return '#3B82F6';
  switch (position) {
    case 'Point Guard':
    case 'Shooting Guard':
      return '#10B981';
    case 'Small Forward':
    case 'Power Forward':
      return '#F59E0B';
    case 'Center':
      return '#EF4444';
    default:
      return '#3B82F6';
  }
}

function getRoleAbbr(position: string | null | undefined) {
  if (!position) return '';
  const abbr: { [key: string]: string } = {
    'Point Guard': 'PG',
    'Shooting Guard': 'SG',
    'Small Forward': 'SF',
    'Power Forward': 'PF',
    'Center': 'C'
  };
  return abbr[position] || position;
}

export default function PlayersTable({ searchParams }: { searchParams: SearchParamsType }) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams.search) params.append('search', searchParams.search);
    if (searchParams.position) params.append('position', searchParams.position);
    if (searchParams.team) params.append('team', searchParams.team);
    if (searchParams.sort) params.append('sort', searchParams.sort);
    if (searchParams.page) params.append('page', searchParams.page);
    
    const queryString = params.toString();
    const url = `/api/players${queryString ? `?${queryString}` : ''}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPlayers(data.players || []);
        setTotalCount(data.totalCount || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load players:', err);
        setLoading(false);
      });
  }, [searchParams.search, searchParams.position, searchParams.team, searchParams.sort, searchParams.page]);

  if (loading) {
    return <LoadingPlaceholder message="Loading players..." />;
  }

  return (
    <div className="paper">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '0.875rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700 }}>Rank</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700 }}>Player</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700 }}>Position</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 700 }}>Team</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>Rating</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>Games</th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>
                  <span className="text-secondary">No players found</span>
                </td>
              </tr>
            ) : (
              players.map((player, index) => (
                <tr 
                  key={player.id}
                  style={{ 
                    borderBottom: '1px solid var(--color-border)',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      fontWeight: 700,
                      color: index < 3 ? 'var(--color-primary)' : 'inherit'
                    }}>
                      #{index + 1}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{player.gamertag}</td>
                  <td style={{ padding: '1rem' }}>
                    {player.position && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: getRoleColor(player.position) + '33',
                        color: getRoleColor(player.position)
                      }}>
                        {getRoleAbbr(player.position)}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="text-secondary">{player.team_name || '—'}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>
                    {player.player_rank_score?.toFixed(0) || '—'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <span className="text-secondary">{player.games_played}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {totalCount > 0 && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          fontSize: '0.875rem'
        }}>
          Showing {players.length} of {totalCount} players
        </div>
      )}
    </div>
  );
}
