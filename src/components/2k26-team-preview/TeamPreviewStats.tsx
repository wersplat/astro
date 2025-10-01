
import { createClientBrowser } from '@/lib/supabaseClient';
import { Paper, Typography, Grid, Box, Avatar, Stack } from '@mui/material';

export default async function TeamPreviewStats() {
  
  const supabase = createClientBrowser();

  // Try to get 2K26 data first
  let [teamsRes, playersRes, perfRes] = await Promise.all([
    supabase
      .from('team_performance_by_game_year')
      .select('team_id')
      .eq('game_year', '2K26'),
    supabase
      .from('team_rosters')
      .select('player_id')
      .eq('game_year', '2K26')
      .is('left_at', null),
    supabase
      .from('team_performance_by_game_year')
      .select('team_id, team_name, current_ranking_points')
      .eq('game_year', '2K26')
      .order('current_ranking_points', { ascending: false })
      .limit(1)
  ]);

  // Fallback: if no 2K26 data, get the most recent year available
  if (!teamsRes.data || teamsRes.data.length === 0) {
    [teamsRes, playersRes, perfRes] = await Promise.all([
      supabase
        .from('team_performance_by_game_year')
        .select('team_id')
        .order('game_year', { ascending: false })
        .limit(1),
      supabase
        .from('team_rosters')
        .select('player_id')
        .order('game_year', { ascending: false })
        .is('left_at', null)
        .limit(1),
      supabase
        .from('team_performance_by_game_year')
        .select('team_id, team_name, current_ranking_points')
        .order('game_year', { ascending: false })
        .order('current_ranking_points', { ascending: false })
        .limit(1)
    ]);
  }

  const totalTeams = teamsRes.data?.length || 0;
  const totalPlayers = playersRes.data?.length || 0;
  const topTeam = perfRes.data?.[0] as { team_id: string; team_name: string | null; current_ranking_points: number | null } | undefined;

  let topTeamLogo: string | undefined;
  if (topTeam?.team_id) {
    const logoResult = await supabase
      .from('teams')
      .select('logo_url')
      .eq('id', topTeam.team_id)
      .maybeSingle();
    const teamDetail = (logoResult.data as { logo_url: string | null } | null);
    topTeamLogo = teamDetail?.logo_url || undefined;
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Team Preview Stats
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Teams</Typography>
            <Typography variant="h5" fontWeight={800}>{totalTeams.toLocaleString()}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Active Players</Typography>
            <Typography variant="h5" fontWeight={800}>{totalPlayers.toLocaleString()}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Top Team</Typography>
            {topTeam ? (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar src={topTeamLogo} sx={{ width: 28, height: 28 }}>
                  {(topTeam.team_name || 'TM').slice(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={700}>
                    {topTeam.team_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(topTeam.current_ranking_points || 0).toLocaleString()} RP
                  </Typography>
                </Box>
              </Stack>
            ) : (
              <Typography variant="body1" fontWeight={700}>—</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
