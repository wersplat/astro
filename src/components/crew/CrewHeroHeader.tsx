import { Box, Chip, Paper, Stack, Typography, Avatar } from '@mui/material';

type Crew = {
  id: string;
  name: string | null;
  logo_url: string | null;
  crew_color: string | null;
  created_at: string | null;
  description: string | null;
};

export default function CrewHeroHeader({ crew }: { crew: Crew | null }) {
  const color = crew?.crew_color || '#3B82F6';
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
          src={crew?.logo_url || undefined}
          sx={{ 
            width: 96, 
            height: 96, 
            border, 
            bgcolor: withAlpha(color, 0.2), 
            fontSize: 28,
            fontWeight: 700
          }}
        >
          {crew?.name?.slice(0, 2).toUpperCase() || 'CR'}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={800} lineHeight={1.2}>
            {crew?.name || 'Crew'}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
            {crew?.created_at && (
              <Chip 
                label={`Est. ${new Date(crew.created_at).getFullYear()}`} 
                size="small" 
                sx={{ bgcolor: withAlpha(color, 0.15), color }} 
              />
            )}
          </Stack>
          {crew?.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {crew.description}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">Members</Typography>
            <Typography variant="h5" fontWeight={800}>—</Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="caption" color="text.secondary">Active Teams</Typography>
            <Typography variant="h5" fontWeight={800}>—</Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
