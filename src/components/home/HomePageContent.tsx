import StatsOverview from './StatsOverview';
import LeaderboardSection from './LeaderboardSection';
import TeamLeaderboardSection from './TeamLeaderboardSection';
import EventsSection from './EventsSection';

export default function HomePageContent() {
  return (
    <div className="container">
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 className="gradient-heading" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          NBA 2K Pro-Am Global Rankings
        </h1>
        <p className="subtitle" style={{ fontSize: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          The unified ranking system for competitive NBA 2K Pro-Am leagues worldwide
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Content Grid */}
      <div className="grid" style={{ marginTop: '3rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <LeaderboardSection />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <TeamLeaderboardSection />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <EventsSection />
        </div>
      </div>
    </div>
  );
}
