import { Box, Grid, Paper, Stack, Typography, Link, IconButton } from '@mui/material';
import { Twitter } from '@mui/icons-material';

import { createClientBrowser } from '@/lib/supabaseClient';

// Custom Discord Icon Component
const DiscordIcon = ({ sx }: { sx?: any }) => (
  <Box
    component="svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    sx={sx}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </Box>
);

// Custom Twitch Icon Component
const TwitchIcon = ({ sx }: { sx?: any }) => (
  <Box
    component="svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    sx={sx}
  >
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  </Box>
);

export default async function Overview({ playerId }: { playerId: string }) {
  
  const supabase = createClientBrowser();
  
  // Get player's basic info including social handles
  const { data: player } = await supabase
    .from('players')
    .select('gamertag, alternate_gamertag, twitter_id, discord_id, twitch')
    .eq('id', playerId)
    .single();

  // Type the player data
  const playerData = player as {
    gamertag: string;
    alternate_gamertag: string | null;
    twitter_id: string | null;
    discord_id: string | null;
    twitch: string | null;
  } | null;

  
  // Get player's recent stats from player_stats table
  const { data: playerStats } = await supabase
    .from('player_stats')
    .select('points, assists, rebounds, steals, blocks, match_id')
    .eq('player_id', playerId)
    .order('match_id', { ascending: false })
    .limit(20);

  // Calculate season averages from recent stats
  const stats = playerStats && playerStats.length > 0 ? {
    pts: (playerStats as any[]).reduce((sum, s: any) => sum + (s.points || 0), 0) / playerStats.length,
    ast: (playerStats as any[]).reduce((sum, s: any) => sum + (s.assists || 0), 0) / playerStats.length,
    reb: (playerStats as any[]).reduce((sum, s: any) => sum + (s.rebounds || 0), 0) / playerStats.length,
    stl: (playerStats as any[]).reduce((sum, s: any) => sum + (s.steals || 0), 0) / playerStats.length,
    blk: (playerStats as any[]).reduce((sum, s: any) => sum + (s.blocks || 0), 0) / playerStats.length
  } : null;

  // Find best game (highest points)
  const bestGame = playerStats && playerStats.length > 0 ? 
    (playerStats as any[]).reduce((best: any, current: any) => 
      (current.points || 0) > (best.points || 0) ? current : best
    ) : null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Season Averages</Typography>
          <Stack direction="row" spacing={3} flexWrap="wrap">
            {['pts','ast','reb','stl','blk'].map(k => (
              <Box key={k}>
                <Typography variant="caption" color="text.secondary">{k.toUpperCase()}</Typography>
                <Typography variant="h5" fontWeight={800}>
                  {stats?.[k as keyof typeof stats] ? Math.round(stats[k as keyof typeof stats] * 10) / 10 : '—'}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Best Game</Typography>
          <Typography variant="body2" color="text.secondary">Top scoring performance</Typography>
          <Typography variant="h4" fontWeight={800}>{(bestGame as any)?.points ?? '—'} PTS</Typography>
        </Paper>
      </Grid>
      
      {/* Social Handles and Alternate Gamertags Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Player Info</Typography>
          <Stack spacing={2}>
            {/* Primary Gamertag */}
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Primary Gamertag</Typography>
              <Typography variant="h6" fontWeight={600}>{playerData?.gamertag || '—'}</Typography>
            </Box>
            
            {/* Alternate Gamertag */}
            {playerData?.alternate_gamertag && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Alternate Gamertag</Typography>
                <Typography variant="h6" fontWeight={600}>{playerData.alternate_gamertag}</Typography>
              </Box>
            )}
            
            {/* Social Handles */}
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {playerData?.twitter_id && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Twitter sx={{ color: '#1DA1F2', fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    @{playerData.twitter_id}
                  </Typography>
                </Box>
              )}
              {playerData?.discord_id && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DiscordIcon sx={{ color: '#5865F2', width: 20, height: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    {playerData.discord_id}
                  </Typography>
                </Box>
              )}
              {playerData?.twitch && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TwitchIcon sx={{ color: '#9146FF', width: 20, height: 20 }} />
                  <Link 
                    href={`https://twitch.tv/${playerData.twitch}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      color: 'text.secondary', 
                      textDecoration: 'none',
                      '&:hover': { color: 'primary.main', textDecoration: 'underline' }
                    }}
                  >
                    <Typography variant="body2">
                      {playerData.twitch}
                    </Typography>
                  </a>
                </Box>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}


