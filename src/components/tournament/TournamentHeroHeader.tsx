import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

type Tournament = {
  id: string;
  tournament_name: string | null;
  start_date: string | null;
  end_date: string | null;
  tier: number | null;
  organizer_name: string | null;
  prize_pool: number | null;
  description: string | null;
  status: string | null;
};

function getTierColor(tier: number | null) {
  if (!tier) return '#9E9E9E';
  const colors = {
    1: '#9C27B0', // T1 - Purple
    2: '#2196F3', // T2 - Blue  
    3: '#4CAF50', // T3 - Green
    4: '#FF9800', // T4 - Orange
    5: '#9E9E9E', // T5 - Gray
  };
  return colors[tier as keyof typeof colors] || '#9E9E9E';
}

export default function TournamentHeroHeader({ tournament }: { tournament: Tournament | null }) {
  const tierColor = getTierColor(tournament?.tier || null);
  
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h4" fontWeight={800}>
            {tournament?.tournament_name || 'Tournament'}
          </Typography>
          {tournament?.tier && (
            <Chip 
              label={`T${tournament.tier}`}
              sx={{ 
                bgcolor: `${tierColor}15`,
                color: tierColor,
                fontWeight: 700
              }}
            />
          )}
        </Box>

        {tournament?.description && (
          <Typography variant="body1" color="text.secondary">
            {tournament.description}
          </Typography>
        )}

        <Stack direction="row" spacing={3} flexWrap="wrap">
          {tournament?.start_date && (
            <Box>
              <Typography variant="caption" color="text.secondary">Start Date</Typography>
              <Typography variant="body2" fontWeight={600}>
                {new Date(tournament.start_date).toLocaleDateString()}
              </Typography>
            </Box>
          )}
          
          {tournament?.end_date && (
            <Box>
              <Typography variant="caption" color="text.secondary">End Date</Typography>
              <Typography variant="body2" fontWeight={600}>
                {new Date(tournament.end_date).toLocaleDateString()}
              </Typography>
            </Box>
          )}
          
          {tournament?.organizer_name && (
            <Box>
              <Typography variant="caption" color="text.secondary">Organizer</Typography>
              <Typography variant="body2" fontWeight={600}>
                {tournament.organizer_name}
              </Typography>
            </Box>
          )}
          
          {tournament?.prize_pool && (
            <Box>
              <Typography variant="caption" color="text.secondary">Prize Pool</Typography>
              <Typography variant="body2" fontWeight={600} sx={{ color: '#9BF00B' }}>
                ${tournament.prize_pool.toLocaleString()}
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
