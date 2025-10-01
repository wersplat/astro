import { useEffect, useState } from 'react';
import LoadingPlaceholder from '../ui/LoadingPlaceholder';

type Event = {
  id: string;
  name: string;
  start_date: string;
  type: 'tournament' | 'league';
  tier?: number;
  location?: string;
  max_rp?: number;
};

function getTierColor(tier: number) {
  const colors = {
    1: '#9C27B0', // T1 - Purple
    2: '#2196F3', // T2 - Blue  
    3: '#4CAF50', // T3 - Green
    4: '#FF9800', // T4 - Orange
    5: '#9E9E9E', // T5 - Gray
  };
  return colors[tier as keyof typeof colors] || '#9E9E9E';
}

function getTierLabel(tier: number) {
  const labels = {
    1: 'T1 - Major LANs',
    2: 'T2 - Franchise',
    3: 'T3 - Qualifiers',
    4: 'T4 - Invitationals',
    5: 'T5 - Community',
  };
  return labels[tier as keyof typeof labels] || `T${tier}`;
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tournaments?limit=5&sort=start_date&status=upcoming,active')
      .then(res => res.json())
      .then(data => {
        setEvents(data.tournaments || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load events:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingPlaceholder message="Loading upcoming events..." />;
  }

  return (
    <div className="paper">
      <h2 style={{ marginTop: 0 }}>Upcoming Events</h2>
      
      {events.length === 0 ? (
        <p className="text-secondary">No upcoming events at this time.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map((event) => (
            <div key={event.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{event.name}</h3>
                {event.tier && (
                  <span 
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: getTierColor(event.tier) + '33',
                      color: getTierColor(event.tier)
                    }}
                  >
                    {getTierLabel(event.tier)}
                  </span>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📅</span>
                  <span className="text-secondary">
                    {new Date(event.start_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                
                {event.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📍</span>
                    <span className="text-secondary">{event.location}</span>
                  </div>
                )}
                
                {event.max_rp && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🏆</span>
                    <span className="text-secondary">Up to {event.max_rp} RP</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <a href="/tournaments" className="button" style={{ 
        marginTop: '1.5rem', 
        display: 'inline-block',
        textDecoration: 'none',
        textAlign: 'center'
      }}>
        View All Events
      </a>
    </div>
  );
}
