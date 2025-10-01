'use client';

import { useState } from 'react';
import ClickableRow from '@/components/shared/ClickableRow';

type Result = {
  team_id: string;
  team_name: string;
  final_placement?: number;
  wins?: number;
  losses?: number;
  logo_url?: string;
};

export default function ResultsTable({ results }: { results: Result[] }) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getPlacementColor = (placement: number) => {
    if (placement === 1) return '#F59E08'; // Gold
    if (placement === 2) return '#94A3B8'; // Silver
    if (placement === 3) return '#CD7F32'; // Bronze
    return 'inherit';
  };

  const getPlacementEmoji = (placement: number) => {
    if (placement === 1) return '🥇';
    if (placement === 2) return '🥈';
    if (placement === 3) return '🥉';
    return '';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
            <th style={{ padding: '1rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Place</th>
            <th style={{ padding: '1rem 0.75rem', textAlign: 'left', color: 'var(--color-text-secondary)', fontWeight: '600' }}>Team</th>
            <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>W</th>
            <th style={{ padding: '1rem 0.75rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: '600' }}>L</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => {
            const placement = result.final_placement || 0;
            const placementColor = getPlacementColor(placement);
            const placementEmoji = getPlacementEmoji(placement);
            
            return (
              <ClickableRow
                key={result.team_id}
                href={`/team/${result.team_id}`}
                style={{ 
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: hoveredRow === result.team_id ? 'var(--color-background)' : 'transparent',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={() => setHoveredRow(result.team_id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ fontWeight: '700', color: placementColor, fontSize: '1.125rem' }}>
                    {placementEmoji} {placement || '-'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {result.logo_url && (
                      <img 
                        src={result.logo_url} 
                        alt={result.team_name} 
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    <span style={{ fontWeight: '600' }}>{result.team_name}</span>
                  </div>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#10B981', fontWeight: '600' }}>
                  {result.wins || 0}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center', color: '#EF4444', fontWeight: '600' }}>
                  {result.losses || 0}
                </td>
              </ClickableRow>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

