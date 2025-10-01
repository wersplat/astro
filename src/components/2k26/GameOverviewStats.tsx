import { Paper, Typography, Grid, Box } from '@mui/material';

import { createClientBrowser } from '@/lib/supabaseClient';

export default async function GameOverviewStats() {
  
  const supabase = createClientBrowser();

  // Get 2K26 data for all metrics
  const [playersRes, teamsRes, tournamentsRes, leaguesRes] = await Promise.all([
    supabase
      .from('player_performance_by_game_year')
      .select('player_id')
      .eq('game_year', '2K26'),
    supabase
      .from('team_performance_by_game_year')
      .select('team_id')
      .eq('game_year', '2K26'),
    supabase
      .from('tournaments')
      .select('id')
      .eq('game_year', '2K26'),
    supabase
      .from('league_seasons')
      .select('id, league_id')
      .eq('year', '2K26')
      .eq('is_active', true)
  ]);

  const totalPlayers = playersRes.data?.length || 0;
  const totalTeams = teamsRes.data?.length || 0;
  const totalTournaments = tournamentsRes.data?.length || 0;
  const totalLeagues = leaguesRes.data?.length || 0;

  // Check if we have any 2K26 data at all
  const has2K26Data = totalPlayers > 0 || totalTeams > 0 || totalTournaments > 0 || totalLeagues > 0;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        2K26 Snapshot
      </Typography>
      {!has2K26Data && (
        <Typography variant="body2" color="warning.main" sx={{ mb: 2 }}>
          Limited 2K26 data available. Some metrics may show zero.
        </Typography>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Players</Typography>
            <Typography variant="h5" fontWeight={800}>{totalPlayers.toLocaleString()}</Typography>
            {totalPlayers === 0 && (
              <Typography variant="caption" color="text.secondary">
                No player data yet
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Teams</Typography>
            <Typography variant="h5" fontWeight={800}>{totalTeams.toLocaleString()}</Typography>
            {totalTeams === 0 && (
              <Typography variant="caption" color="text.secondary">
                No team data yet
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Tournaments</Typography>
            <Typography variant="h5" fontWeight={800}>{totalTournaments.toLocaleString()}</Typography>
            {totalTournaments === 0 && (
              <Typography variant="caption" color="text.secondary">
                No tournaments yet
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Leagues</Typography>
            <Typography variant="h5" fontWeight={800}>{totalLeagues.toLocaleString()}</Typography>
            {totalLeagues === 0 && (
              <Typography variant="caption" color="text.secondary">
                No league data yet
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
