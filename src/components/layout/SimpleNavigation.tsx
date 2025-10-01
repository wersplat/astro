'use client';

import { useState } from 'react';

const exploreItems = [
  { label: 'Players', href: '/players' },
  { label: 'Teams', href: '/teams' },
  { label: 'Crews', href: '/crews' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'History', href: '/pro-am-history' },
  { label: 'Ranking System', href: '/ranking-system' },
];

const competitionItems = [
  { label: 'Tournaments', href: '/tournaments' },
  { label: 'Leagues', href: '/leagues' },
  { label: 'Events', href: '/events' },
  { label: 'UPA College', href: '/upa-college' },
  { label: '2K26 Overview', href: '/2k26-overview' },
  { label: 'Team Preview', href: '/team-preview' },
];

export default function SimpleNavigation({ pathname }: { pathname: string }) {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [competitionOpen, setCompetitionOpen] = useState(false);

  return (
    <nav style={{
      backgroundColor: '#0F172A',
      borderBottom: '1px solid #374151',
      padding: '0 1rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        height: '64px'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img 
            src="https://qwpxsufrgigpjcxtnery.supabase.co/storage/v1/object/public/team-logos/GR.png"
            alt="Global Rankings"
            style={{ width: '32px', height: '32px' }}
          />
          <a 
            href="/" 
            style={{ 
              color: '#E5E7EB', 
              textDecoration: 'none', 
              fontWeight: '800',
              fontSize: '1.25rem'
            }}
          >
            Global Rankings
          </a>
        </div>

        {/* Desktop Navigation */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center', 
          gap: '1rem'
        }}>
          {/* Home */}
          <a 
            href="/" 
            style={{
              color: pathname === '/' ? '#3B82F6' : '#E5E7EB',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: pathname === '/' ? '#1E40AF' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            Home
          </a>

          {/* Explore Dropdown */}
          <div 
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button style={{
              color: '#E5E7EB',
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '1rem',
              transition: 'color 0.2s'
            }}>
              Explore {exploreOpen ? '▲' : '▼'}
            </button>
            {/* Invisible bridge to prevent hover gap */}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              height: '8px',
              display: exploreOpen ? 'block' : 'none'
            }} />
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              backgroundColor: '#0F172A',
              border: '1px solid #374151',
              borderRadius: '4px',
              minWidth: '180px',
              display: exploreOpen ? 'block' : 'none',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              zIndex: 100
            }}>
              {exploreItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    color: pathname === item.href ? '#3B82F6' : '#E5E7EB',
                    textDecoration: 'none',
                    backgroundColor: pathname === item.href ? '#1E3A5F' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (pathname !== item.href) {
                      e.currentTarget.style.backgroundColor = '#1E293B';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (pathname !== item.href) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Competition Dropdown */}
          <div 
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => setCompetitionOpen(true)}
            onMouseLeave={() => setCompetitionOpen(false)}
          >
            <button style={{
              color: '#E5E7EB',
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '1rem',
              transition: 'color 0.2s'
            }}>
              Competition {competitionOpen ? '▲' : '▼'}
            </button>
            {/* Invisible bridge to prevent hover gap */}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              height: '8px',
              display: competitionOpen ? 'block' : 'none'
            }} />
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              backgroundColor: '#0F172A',
              border: '1px solid #374151',
              borderRadius: '4px',
              minWidth: '180px',
              display: competitionOpen ? 'block' : 'none',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              zIndex: 100
            }}>
              {competitionItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    color: pathname === item.href ? '#3B82F6' : '#E5E7EB',
                    textDecoration: 'none',
                    backgroundColor: pathname === item.href ? '#1E3A5F' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (pathname !== item.href) {
                      e.currentTarget.style.backgroundColor = '#1E293B';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (pathname !== item.href) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
