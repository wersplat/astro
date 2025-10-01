import { useEffect, useState } from 'react';

export default function StatsOverview() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalTeams: 0,
    activeLeagues: 0,
    totalMatches: 0
  });

  useEffect(() => {
    // TODO: Fetch actual stats
    setStats({
      totalPlayers: 1250,
      totalTeams: 85,
      activeLeagues: 12,
      totalMatches: 450
    });
  }, []);

  const statCards = [
    { label: 'Players', value: stats.totalPlayers, color: '#3B82F6' },
    { label: 'Teams', value: stats.totalTeams, color: '#10B981' },
    { label: 'Leagues', value: stats.activeLeagues, color: '#F59E0B' },
    { label: 'Matches', value: stats.totalMatches, color: '#EF4444' }
  ];

  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      {statCards.map((stat) => (
        <div key={stat.label} className="paper" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: stat.color, marginBottom: '0.5rem' }}>
            {stat.value.toLocaleString()}
          </div>
          <div className="text-secondary">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
