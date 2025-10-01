
import { createClientBrowser } from '@/lib/supabaseClient';
import { Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';

export default async function Career({ playerId }: { playerId: string }) {
  
  const supabase = createClientBrowser();
  
  // Get roster history using the correct view like the existing JS
  const { data: rosterHistory } = await supabase
    .from('player_roster_history')
    .select('team_name, team_id, league_name, position, joined_at, left_at, season_number')
    .eq('player_id', playerId)
    .order('joined_at', { ascending: false });

  // Get awards from past_champions table
  const { data: awards } = await supabase
    .from('past_champions')
    .select('*')
    .eq('team_id', ((await supabase.from('players').select('current_team_id').eq('id', playerId).maybeSingle()).data as any)?.current_team_id || '')
    .order('created_at', { ascending: false });

  // Get past game year stats
  const { data: gameYearStats } = await supabase
    .from('player_performance_by_game_year')
    .select('*')
    .eq('player_id', playerId)
    .order('game_year', { ascending: false });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={700}>Team History</Typography>
          {(!rosterHistory || rosterHistory.length === 0) ? (
            <Typography color="text.secondary">No team history available.</Typography>
          ) : rosterHistory.map((entry: any, i: number) => (
            <Typography key={i} variant="body2" sx={{ mb: 1 }}>
              • {entry.team_name} ({entry.position}) 
              {entry.season_number && ` - Season ${entry.season_number}`}
              <Typography variant="caption" color="text.secondary" display="block">
                {entry.joined_at ? new Date(entry.joined_at).toLocaleDateString() : ''} - {entry.left_at ? new Date(entry.left_at).toLocaleDateString() : 'Present'}
              </Typography>
            </Typography>
          ))}
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={700}>Championships</Typography>
          {(!awards || awards.length === 0) ? (
            <Typography color="text.secondary">No championships yet.</Typography>
          ) : awards.map((award: any, i: number) => (
            <Typography key={i} variant="body2" sx={{ mb: 1 }}>
              • {award.league_name} {award.year ? `(${award.year})` : ''}
              <Typography variant="caption" color="text.secondary" display="block">
                {award.is_tournament ? 'Tournament' : 'League'} Champion
              </Typography>
            </Typography>
          ))}
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Career Stats by Game Year</Typography>
          {(!gameYearStats || gameYearStats.length === 0) ? (
            <Typography color="text.secondary">No career stats available.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Game Year</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">PPG</TableCell>
                    <TableCell align="right">RPG</TableCell>
                    <TableCell align="right">APG</TableCell>
                    <TableCell align="right">SPG</TableCell>
                    <TableCell align="right">BPG</TableCell>
                    <TableCell align="right">Performance</TableCell>
                    <TableCell align="right">MVP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gameYearStats.map((stat: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {stat.game_year || 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {stat.matches_played || 0}
                      </TableCell>
                      <TableCell align="right">
                        {stat.avg_points ? stat.avg_points.toFixed(1) : '0.0'}
                      </TableCell>
                      <TableCell align="right">
                        {stat.avg_rebounds ? stat.avg_rebounds.toFixed(1) : '0.0'}
                      </TableCell>
                      <TableCell align="right">
                        {stat.avg_assists ? stat.avg_assists.toFixed(1) : '0.0'}
                      </TableCell>
                      <TableCell align="right">
                        {stat.avg_steals ? stat.avg_steals.toFixed(1) : '0.0'}
                      </TableCell>
                      <TableCell align="right">
                        {stat.avg_blocks ? stat.avg_blocks.toFixed(1) : '0.0'}
                      </TableCell>
                      <TableCell align="right">
                        {stat.avg_performance_score ? stat.avg_performance_score.toFixed(1) : '0.0'}
                      </TableCell>
                      <TableCell align="right">
                        {stat.mvp_count || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}


