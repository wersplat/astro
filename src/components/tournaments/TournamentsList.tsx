import { useEffect, useState } from 'react';
import LoadingPlaceholder from '../ui/LoadingPlaceholder';

type SearchParamsType = {
  search?: string;
  status?: string;
  tier?: string;
  sort?: string;
  page?: string;
};

type Tournament = {
  id: string;
  name: string;
  start_date: string;
  end_date?: string;
  tier?: number;
  max_rp?: number;
  status: string;
};

function getTierColor(tier: number) {
  const colors = {
    1: '#9C27B0',
    2: '#2196F3',
    3: '#4CAF50',
    4: '#FF9800',
    5: '#9E9E9E',
  };
  return colors[tier as keyof typeof colors] || '#9E9E9E';
}

function getTierLabel(tier: number) {
  const labels = {
    1: 'T1',
    2: 'T2',
    3: 'T3',
    4: 'T4',
    5: 'T5',
  };
  return labels[tier as keyof typeof labels] || `T${tier}`;
}

export default function TournamentsList({ searchParams }: { searchParams: SearchParamsType }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams.search) params.append('search', searchParams.search);
    if (searchParams.status) params.append('status', searchParams.status);
    if (searchParams.tier) params.append('tier', searchParams.tier);
    if (searchParams.sort) params.append('sort', searchParams.sort);
    if (searchParams.page) params.append('page', searchParams.page);
    
    const queryString = params.toString();
    const url = `/api/tournaments${queryString ? `?${queryString}` : ''}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setTournaments(data.tournaments || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load tournaments:', err);
        setLoading(false);
      });
  }, [searchParams.search, searchParams.status, searchParams.tier, searchParams.sort, searchParams.page]);

  if (loading) {
    return <LoadingPlaceholder message="Loading tournaments..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {tournaments.length === 0 ? (
        <div className="paper" style={{ textAlign: 'center' }}>
          <p className="text-secondary">No tournaments found</p>
        </div>
      ) : (
        tournaments.map((tournament) => (
          <div key={tournament.id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{tournament.name}</h3>
              {tournament.tier && (
                <span 
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    backgroundColor: getTierColor(tournament.tier) + '33',
                    color: getTierColor(tournament.tier)
                  }}
                >
                  {getTierLabel(tournament.tier)}
                </span>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
              <div>
                <span className="text-secondary">Starts: </span>
                <span>{new Date(tournament.start_date).toLocaleDateString()}</span>
              </div>
              {tournament.end_date && (
                <div>
                  <span className="text-secondary">Ends: </span>
                  <span>{new Date(tournament.end_date).toLocaleDateString()}</span>
                </div>
              )}
              {tournament.max_rp && (
                <div>
                  <span className="text-secondary">Max RP: </span>
                  <span style={{ fontWeight: 600 }}>{tournament.max_rp}</span>
                </div>
              )}
              <div>
                <span 
                  style={{
                    padding: '0.125rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: tournament.status === 'active' ? '#4CAF5033' : tournament.status === 'upcoming' ? '#FF980033' : '#9E9E9E33',
                    color: tournament.status === 'active' ? '#4CAF50' : tournament.status === 'upcoming' ? '#FF9800' : '#9E9E9E'
                  }}
                >
                  {tournament.status}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
