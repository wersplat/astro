import { Paper, Typography, Grid, Box } from '@mui/material';

import { createClientBrowser } from '@/lib/supabaseClient';

export default async function ProAmHistoryStats() {
  
  const supabase = createClientBrowser();

  const [leagueChampsRes, tourneyChampsRes] = await Promise.all([
    supabase
      .from('past_champions')
      .select('id')
      .eq('is_tournament', false),
    supabase
      .from('past_champions')
      .select('id')
      .eq('is_tournament', true)
  ]);

  const leagueCount = leagueChampsRes.data?.length || 0;
  const tourneyCount = tourneyChampsRes.data?.length || 0;

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Historical Statistics
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">League Champions</Typography>
            <Typography variant="h5" fontWeight={800}>{leagueCount.toLocaleString()}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Typography variant="overline" color="text.secondary">Tournament Champions</Typography>
            <Typography variant="h5" fontWeight={800}>{tourneyCount.toLocaleString()}</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
