import { Paper, Typography, Stack, Box, Chip, Link } from '@mui/material';

import { createClientBrowser } from '@/lib/supabaseClient';

export default async function GameOverviewTournaments() {
  
  const supabase = createClientBrowser();

  // Get 2K26 tournaments from tournament_calendar view (same pattern as leagues)
  const { data: tournaments, error } = await supabase
    .from('tournament_calendar')
    .select('id, tournament_name as name, description, start_date, end_date, status, tier, prize_pool, champion, runner_up, banner_url, organizer_logo_url')
    .eq('game_year', '2K26')
    .order('start_date', { ascending: true })
    .limit(6);

  type TournamentRow = {
    id: string;
    name: string | null;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    status: string | null;
    tier: string | null;
    prize_pool: number | null;
    champion: string | null;
    runner_up: string | null;
    banner_url: string | null;
    organizer_logo_url: string | null;
  };

  const tournamentData: TournamentRow[] = (tournaments || []).filter(Boolean);

  function getStatusColor(status: string | null) {
    switch (status?.toLowerCase()) {
      case 'upcoming': return 'info';
      case 'live': return 'warning';
      case 'in progress': return 'warning';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  }

  function determineStatus(tournament: TournamentRow): string {
    const now = new Date();
    const startDate = tournament.start_date ? new Date(tournament.start_date) : null;
    const endDate = tournament.end_date ? new Date(tournament.end_date) : null;
    
    // If status is explicitly set, use it
    if (tournament.status) {
      return tournament.status;
    }
    
    // Determine status based on dates
    if (startDate && endDate) {
      if (now < startDate) {
        return 'upcoming';
      } else if (now >= startDate && now <= endDate) {
        return 'live';
      } else {
        return 'completed';
      }
    } else if (startDate) {
      return now < startDate ? 'upcoming' : 'completed';
    } else {
      return 'completed';
    }
  }

  function getTierColor(tier: string | null) {
    switch (tier) {
      case 'T1': return '#9C27B0'; // Purple
      case 'T2': return '#2196F3'; // Blue
      case 'T3': return '#4CAF50'; // Green
      case 'T4': return '#FF9800'; // Orange
      case 'T5': return '#9E9E9E'; // Gray
      default: return '#9E9E9E';
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function formatPrizePool(amount: number | null) {
    if (!amount) return 'TBD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Recent Tournaments
      </Typography>
      {error && (
        <Typography color="error.main" variant="body2" sx={{ mb: 2 }}>
          Failed to load tournaments.
        </Typography>
      )}
      <Stack spacing={2}>
        {tournamentData.length === 0 && (
          <Typography color="text.secondary">No tournaments found.</Typography>
        )}
        {tournamentData.map((tournament: TournamentRow) => {
          const status = determineStatus(tournament);
          return (
            <Box 
              key={tournament.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: 2,
                p: 2,
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transition: 'background-color 0.2s ease'
                }
              }}
            >
              <Box
                sx={{
                  height: 48,
                  width: 48,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {tournament.organizer_logo_url ? (
                  <img 
                    src={tournament.organizer_logo_url} 
                    alt={tournament.name || 'Tournament'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant="h6" fontWeight={800} color="text.secondary">
                    {(tournament.name || 'T').charAt(0).toUpperCase()}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="h6" fontWeight={600} noWrap>
                    {tournament.name || 'Unnamed Tournament'}
                  </Typography>
                  {tournament.tier && (
                    <Chip 
                      label={tournament.tier} 
                      size="small" 
                      sx={{ 
                        bgcolor: getTierColor(tournament.tier),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  )}
                  <Chip 
                    label={status.charAt(0).toUpperCase() + status.slice(1)} 
                    size="small" 
                    color={getStatusColor(status) as any}
                  />
                </Box>
              {tournament.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {tournament.description}
                </Typography>
              )}
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <strong>Start:</strong> {formatDate(tournament.start_date)}
                </Typography>
                {tournament.end_date && (
                  <Typography variant="caption" color="text.secondary">
                    <strong>End:</strong> {formatDate(tournament.end_date)}
                  </Typography>
                )}
                {tournament.prize_pool && (
                  <Typography variant="caption" color="text.secondary">
                    <strong>Prize:</strong> {formatPrizePool(tournament.prize_pool)}
                  </Typography>
                )}
                {tournament.champion && (
                  <Typography variant="caption" color="success.main">
                    <strong>Champion:</strong> {tournament.champion}
                  </Typography>
                )}
                {tournament.runner_up && (
                  <Typography variant="caption" color="text.secondary">
                    <strong>Runner-up:</strong> {tournament.runner_up}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
