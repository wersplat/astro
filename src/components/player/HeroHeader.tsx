import { Box, Chip, Paper, Stack, Typography, Avatar } from '@mui/material';

type Player = {
  id: string;
  gamertag: string | null;
  position: string | null;
  player_rp: number | null;
  performance_score: number | null;
  salary_tier: string | null;
};

type Team = {
  id: string;
  name: string | null;
  logo_url: string | null;
  team_color: string | null;
  global_rank: number | null;
  current_rp: number | null;
} | null;

function getRoleColor(role: string | null | undefined) {
  if (!role) return '#3B82F6';
  switch (role) {
    case 'Point Guard':
    case 'Shooting Guard':
      return '#3B82F6'; // Blue for guards
    case 'Lock':
      return '#eab308'; // Gold for lock
    case 'Power Forward':
    case 'Center':
      return '#10b981'; // Green for bigs
    default:
      return '#3B82F6';
  }
}

export default function HeroHeader({ player, team }: { player: Player | null; team: Team }) {
  const color = team?.team_color || getRoleColor(player?.position);
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
    // Fallback: return color as-is; alpha not applied for non-hex values
    return c;
  };
  const border = `2px solid ${withAlpha(color, 0.8)}`;

  return (
    <Paper elevation={3} sx={{ position: 'sticky', top: 0, zIndex: 1, p: 2, borderRadius: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Avatar sx={{ width: 96, height: 96, border, bgcolor: withAlpha(color, 0.2), fontSize: 28 }}>
          {player?.gamertag?.slice(0, 2).toUpperCase() || 'PL'}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={800} lineHeight={1.2}>
            {player?.gamertag || 'Player'}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
            {player?.position && <Chip label={player.position} size="small" sx={{ bgcolor: withAlpha(color, 0.15), color }} />}
            {team?.name && <Chip label={team.name} size="small" sx={{ bgcolor: 'background.default' }} />}
            {typeof team?.global_rank === 'number' && (
              <Chip label={`#${team.global_rank} Global`} size="small" sx={{ bgcolor: withAlpha('#9BF00B', 0.15), color: '#9BF00B' }} />
            )}
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">Overall</Typography>
            <Typography variant="h5" fontWeight={800}>{player?.performance_score ?? '—'}</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">RP</Typography>
            <Chip label={`${player?.player_rp ?? 0} RP`} size="small" sx={{ bgcolor: withAlpha('#9BF00B', 0.15), color: '#9BF00B', fontWeight: 700 }} />
          </Box>
          {player?.salary_tier && (
            <Chip label={player.salary_tier} size="small" variant="outlined" />
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}


