import { Paper, Typography, Stack, Box } from '@mui/material';

import { createClientBrowser } from '@/lib/supabaseClient';

export default async function GameOverviewLeaderboard() {
  
  const supabase = createClientBrowser();

  // Try to get 2K26 data first
  let { data, error } = await supabase
    .from('player_performance_by_game_year')
    .select('player_id, gamertag, position, avg_performance_score')
    .eq('game_year', '2K26')
    .order('avg_performance_score', { ascending: false })
    .limit(6);

  // Fallback: if no 2K26 data, get the most recent year available
  if (!data || data.length === 0) {
    const { data: fallbackData } = await supabase
      .from('player_performance_by_game_year')
      .select('player_id, gamertag, position, avg_performance_score, game_year')
      .order('game_year', { ascending: false })
      .order('avg_performance_score', { ascending: false })
      .limit(6);
    data = fallbackData;
  }

  type PerfRow = {
    player_id: string | null;
    gamertag: string | null;
    position: string | null;
    avg_performance_score: number | null;
  };
  const players: PerfRow[] = ((data as any) || []).filter(Boolean);

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Top Players
      </Typography>
      {error && (
        <Typography color="error.main" variant="body2" sx={{ mb: 2 }}>
          Failed to load players.
        </Typography>
      )}
      <Stack spacing={1.5}>
        {players.length === 0 && (
          <Typography color="text.secondary">No players found.</Typography>
        )}
        {players.map((p: PerfRow) => (
          <Box key={(p.player_id as string) || (p.gamertag as string) || Math.random().toString(36)} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                height: 40,
                width: 40,
                borderRadius: '50%',
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800
              }}
              aria-hidden
            >
              {(p.gamertag || 'P').charAt(0).toUpperCase()}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" fontWeight={600} noWrap>
                {p.gamertag || 'Player'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {p.position || '—'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1" fontWeight={700} color="success.main">
                {Math.round(p.avg_performance_score || 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Score</Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
