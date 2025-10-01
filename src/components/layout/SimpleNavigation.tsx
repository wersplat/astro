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
          display: 'none', // Hide on mobile for now
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
              backgroundColor: pathname === '/' ? '#1E40AF' : 'transparent'
            }}
          >
            Home
          </a>

          {/* Explore Dropdown */}
          <div style={{ position: 'relative' }}>
            <button style={{
              color: '#E5E7EB',
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              Explore ▼
            </button>
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: '#0F172A',
              border: '1px solid #374151',
              borderRadius: '4px',
              minWidth: '150px',
              display: 'none' // Simplified for now
            }}>
              {exploreItems.map(item => (
                <a 
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'block',
                    color: '#E5E7EB',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderBottom: '1px solid #374151'
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Competitions Dropdown */}
          <div style={{ position: 'relative' }}>
            <button style={{
              color: '#E5E7EB',
              background: 'none',
              border: 'none',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              Competitions ▼
            </button>
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: '#0F172A',
              border: '1px solid #374151',
              borderRadius: '4px',
              minWidth: '150px',
              display: 'none' // Simplified for now
            }}>
              {competitionItems.map(item => (
                <a 
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'block',
                    color: '#E5E7EB',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderBottom: '1px solid #374151'
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* 2K26 */}
          <a 
            href="/2k26-overview" 
            style={{
              color: pathname === '/2k26-overview' ? '#3B82F6' : '#E5E7EB',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: pathname === '/2k26-overview' ? '#1E40AF' : 'transparent'
            }}
          >
            2K26
          </a>

          {/* Rankings Explanation */}
          <a 
            href="/ranking-system" 
            style={{
              color: pathname === '/ranking-system' ? '#3B82F6' : '#E5E7EB',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              backgroundColor: pathname === '/ranking-system' ? '#1E40AF' : 'transparent'
            }}
          >
            Rankings Explanation
          </a>

          {/* Action Buttons */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <a 
              href="/submit-results"
              style={{
                color: '#E5E7EB',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid #374151',
                borderRadius: '4px',
                backgroundColor: 'transparent'
              }}
            >
              Submit Results
            </a>
            <a 
              href="/team-preview"
              style={{
                color: '#0B1220',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                border: '1px solid #F59E08FF',
                borderRadius: '4px',
                backgroundColor: '#F59E08FF'
              }}
            >
              Team Preview
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button style={{
          display: 'block', // Show on mobile
          background: 'none',
          border: 'none',
          color: '#E5E7EB',
          cursor: 'pointer',
          padding: '0.5rem'
        }}>
          ☰
        </button>
      </div>
    </nav>
  );
}
