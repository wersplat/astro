import { Grid, Paper, Stack, Typography } from '@mui/material';

export default function LeagueStats({ league, teams }: { league: any; teams: any[] }) {
  const totalTeams = teams?.length || 0;
  const totalWins = (teams || []).reduce((s, t: any) => s + (t.wins || 0), 0);
  const totalLosses = (teams || []).reduce((s, t: any) => s + (t.losses || 0), 0);
  const avgWinPct = totalTeams > 0 ? (
    (teams || []).reduce((s, t: any) => {
      const winPct = t.win_percentage || 0;
      // Check if win_percentage is already a percentage (0-100) or decimal (0-1)
      return s + (winPct > 1 ? winPct : winPct * 100);
    }, 0) / totalTeams
  ) : 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <Stack>
            <Typography variant="caption" color="text.secondary">Teams</Typography>
            <Typography variant="h5" fontWeight={800}>{totalTeams}</Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <Stack>
            <Typography variant="caption" color="text.secondary">Total Wins</Typography>
            <Typography variant="h5" fontWeight={800}>{totalWins}</Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <Stack>
            <Typography variant="caption" color="text.secondary">Total Losses</Typography>
            <Typography variant="h5" fontWeight={800}>{totalLosses}</Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <Stack>
            <Typography variant="caption" color="text.secondary">Avg Win %</Typography>
            <Typography variant="h5" fontWeight={800}>{avgWinPct.toFixed(1)}%</Typography>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
