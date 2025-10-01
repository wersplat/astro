import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

export default function LeagueHeroHeader({ league }: { league: any }) {
  const subtitle = league?.start_date && league?.end_date
    ? `${new Date(league.start_date).toLocaleDateString()} – ${new Date(league.end_date).toLocaleDateString()}`
    : league?.start_date 
      ? `Starts ${new Date(league.start_date).toLocaleDateString()}`
      : undefined;
  
  // Determine status based on dates and active flag
  let status = 'Upcoming';
  let statusColor: 'success' | 'default' | 'warning' = 'default';
  
  if (league?.is_active) {
    status = 'Active';
    statusColor = 'success';
  } else if (league?.end_date && new Date(league.end_date) < new Date()) {
    status = 'Completed';
    statusColor = 'default';
  } else if (league?.start_date && new Date(league.start_date) > new Date()) {
    status = 'Upcoming';
    statusColor = 'warning';
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={800}>
            {league?.league_name || league?.leagues_info?.league || 'League'}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary">{subtitle}</Typography>
          )}
          {league?.game_year && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {league.game_year}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          {typeof league?.season_number === 'number' && (
            <Chip label={`Season ${league.season_number}`} size="small" />
          )}
          <Chip 
            label={status} 
            size="small"
            color={statusColor}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
