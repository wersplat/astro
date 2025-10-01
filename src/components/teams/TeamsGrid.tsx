import { useEffect, useState } from 'react';
import LoadingPlaceholder from '../ui/LoadingPlaceholder';

type SearchParamsType = {
  search?: string;
  sort?: string;
  page?: string;
};

type Team = {
  id: string;
  name: string;
  logo_url?: string;
  current_rp: number;
  global_rank: number;
  playerCount: number;
};

export default function TeamsGrid({ searchParams }: { searchParams: SearchParamsType }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams.search) params.append('search', searchParams.search);
    if (searchParams.sort) params.append('sort', searchParams.sort);
    if (searchParams.page) params.append('page', searchParams.page);
    
    const queryString = params.toString();
    const url = `/api/teams${queryString ? `?${queryString}` : ''}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setTeams(data.teams || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load teams:', err);
        setLoading(false);
      });
  }, [searchParams.search, searchParams.sort, searchParams.page]);

  if (loading) {
    return <LoadingPlaceholder message="Loading teams..." />;
  }

  return (
    <div className="grid">
      {teams.length === 0 ? (
        <div className="paper" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          <p className="text-secondary">No teams found</p>
        </div>
      ) : (
        teams.map((team) => (
          <div key={team.id} className="card">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              {team.logo_url && (
                <img src={team.logo_url} alt={team.name} style={{ width: '48px', height: '48px', borderRadius: '8px' }} />
              )}
              <div>
                <h3 style={{ margin: 0 }}>{team.name}</h3>
                <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Rank #{team.global_rank}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <div>
                <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Players</div>
                <div style={{ fontWeight: 600 }}>{team.playerCount || 0}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Rating</div>
                <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                  {team.current_rp?.toFixed(0) || '—'}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
