'use client';

import { useState } from 'react';

type Event = {
  id: string;
  type: string;
  name: string;
  event_date?: string;
  tier: number;
  organizer_logo_url?: string;
  organizer_name?: string;
  league_name?: string;
};

export default function EventCard({ event }: { event: Event }) {
  const [isHovered, setIsHovered] = useState(false);

  const getTierColor = (tier: number) => {
    const colors = ['#F59E08', '#3B82F6', '#8B5CF6', '#10B981', '#6B7280'];
    return colors[tier - 1] || colors[4];
  };

  const getTierLabel = (tier: number) => `T${tier}`;

  const tierColor = getTierColor(event.tier);
  const tierLabel = getTierLabel(event.tier);
  const isUpcoming = new Date(event.event_date || '') > new Date();
  const href = event.type === 'league' ? `/league/${event.id}` : `/tournament/${event.id}`;

  return (
    <a 
      href={href}
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          {event.organizer_logo_url && (
            <img 
              src={event.organizer_logo_url} 
              alt={event.organizer_name || ''} 
              style={{ width: '24px', height: '24px', marginBottom: '0.5rem' }}
            />
          )}
          <h3 style={{ margin: '0 0 0.5rem' }}>{event.name}</h3>
          <p className="text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>
            {event.organizer_name || event.league_name}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          <span style={{ 
            fontSize: '0.75rem', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '4px', 
            background: `${tierColor}20`, 
            color: tierColor, 
            border: `1px solid ${tierColor}`,
            fontWeight: '600'
          }}>
            {tierLabel}
          </span>
          <span style={{ 
            fontSize: '0.75rem', 
            padding: '0.25rem 0.5rem', 
            borderRadius: '4px', 
            background: isUpcoming ? '#10B98120' : '#6B728020', 
            color: isUpcoming ? '#10B981' : '#6B7280',
            fontWeight: '600'
          }}>
            {isUpcoming ? 'Upcoming' : 'Completed'}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <p className="text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>
          {event.type === 'tournament' ? '🏆 Tournament' : '🏀 League'}
        </p>
        {event.event_date && (
          <p className="text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>
            📅 {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>
    </a>
  );
}

