import { Paper, Typography, Grid, Box } from '@mui/material';

import { createClientBrowser } from '@/lib/supabaseClient';

export default async function TeamPreviewStats() {
  
  const supabase = createClientBrowser();

  const [teamsRes, playersRes, rostersRes, topTeamsRes] = await Promise.all([
    supabase
      .from('team_performance_by_game_year')
      .select('team_id')
      .eq('game_year', '2K26'),
    supabase
      .from('player_performance_by_game_year')
      .select('player_id')
      .eq('game_year', '2K26'),
    supabase
      .from('team_rosters')
      .select('player_id')
      .eq('game_year', '2K26')
      .is('left_at', null),
    supabase
      .from('teams')
      .select('hybrid_score')
      .eq('is_active', true)
      .order('hybrid_score', { ascending: false })
      .limit(1)
  ]);

  const totalTeams = teamsRes.data?.length || 0;
  const totalPlayers = playersRes.data?.length || 0;
  // Count unique players in active rosters
  const uniquePlayersInRosters = new Set(rostersRes.data?.map((r: any) => r.player_id).filter(Boolean)).size;
  const topTeamHybridScore = (topTeamsRes.data as any)?.[0]?.hybrid_score || 0;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        2K26 Team Preview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Active Teams</Typography>
            <Typography variant="h5" fontWeight={800}>{totalTeams.toLocaleString()}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Total Players</Typography>
            <Typography variant="h5" fontWeight={800}>{totalPlayers.toLocaleString()}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Rostered Players</Typography>
            <Typography variant="h5" fontWeight={800}>{uniquePlayersInRosters.toLocaleString()}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Top Hybrid Score</Typography>
            <Typography variant="h5" fontWeight={800}>{Math.round(topTeamHybridScore).toLocaleString()}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
