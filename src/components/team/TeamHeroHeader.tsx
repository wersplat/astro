import { Box, Chip, Paper, Stack, Typography, Avatar } from '@mui/material';
import TeamSocials from './TeamSocials';

type Team = {
  id: string;
  name: string | null;
  logo_url: string | null;
  team_color?: string | null;
  global_rank: number | null;
  current_rp: number | null;
  created_at: string | null;
  twitter_url?: string | null;
  discord_url?: string | null;
  youtube_url?: string | null;
  twitch_url?: string | null;
};

export default function TeamHeroHeader({ team }: { team: Team | null }) {
  const color = team?.team_color || '#3B82F6';
  const withAlpha = (hexOrColor: string, a: number) => {
    const c = (hexOrColor || '').trim();
    if (c.startsWith('#')) {
      const hex = c.slice(1);
      const isShort = hex.length === 3;
      const r = parseInt(isShort ? hex[0] + hex[0] : hex.slice(0, 2), 16);
      const g = parseInt(isShort ? hex[1] + hex[1] : hex.slice(2, 4), 16);
      const b = parseInt(isShort ? hex[2] + hex[2] : hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    return c;
  };
  const border = `2px solid ${withAlpha(color, 0.8)}`;

  return (
    <Paper elevation={3} sx={{ position: 'sticky', top: 0, zIndex: 1, p: 2, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Avatar 
          src={team?.logo_url || undefined}
          sx={{ 
            width: 96, 
            height: 96, 
            border, 
            bgcolor: withAlpha(color, 0.2), 
            fontSize: 28,
            fontWeight: 700
          }}
        >
          {team?.name?.slice(0, 2).toUpperCase() || 'TM'}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={800} lineHeight={1.2}>
            {team?.name || 'Team'}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" alignItems="center">
            {typeof team?.global_rank === 'number' && (
              <Chip 
                label={`#${team.global_rank} Global`} 
                size="small" 
                sx={{ bgcolor: withAlpha('#9BF00B', 0.15), color: '#9BF00B' }} 
              />
            )}
            {team?.created_at && (
              <Chip 
                label={`Est. ${new Date(team.created_at).getFullYear()}`} 
                size="small" 
                sx={{ bgcolor: withAlpha(color, 0.15), color }} 
              />
            )}
          </Stack>
          <Box sx={{ mt: 1 }}>
            <TeamSocials 
              twitter_url={team?.twitter_url}
              discord_url={team?.discord_url}
              youtube_url={team?.youtube_url}
              twitch_url={team?.twitch_url}
            />
          </Box>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">Global Rank</Typography>
            <Typography variant="h5" fontWeight={800}>
              {team?.global_rank ? `#${team.global_rank}` : '—'}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">RP</Typography>
            <Chip 
              label={`${team?.current_rp || 0} RP`} 
              size="small" 
              sx={{ bgcolor: withAlpha('#9BF00B', 0.15), color: '#9BF00B', fontWeight: 700 }} 
            />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
