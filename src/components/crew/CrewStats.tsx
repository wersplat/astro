import { Grid, Paper, Stack, Typography } from '@mui/material';

type Crew = {
  id: string;
  name: string | null;
  logo_url: string | null;
  crew_color: string | null;
  created_at: string | null;
  description: string | null;
};

type Member = {
  player_id: string;
  role: string | null;
  joined_at: string | null;
  player: {
    id: string;
    gamertag: string | null;
    position: string | null;
    player_rp: number | null;
    performance_score: number | null;
  } | null;
};

export default function CrewStats({ crew, members }: { crew: Crew | null; members: Member[] }) {
  const memberCount = members?.length || 0;
  const avgRP = members?.reduce((sum, m) => sum + (m.player?.player_rp || 0), 0) / Math.max(memberCount, 1) || 0;
  const topPlayer = members?.reduce((best, current) => 
    (current.player?.player_rp || 0) > (best?.player?.player_rp || 0) ? current : best
  , null as Member | null);

  const stats = [
    {
      label: 'Total Members',
      value: memberCount.toString(),
      color: '#3B82F6'
    },
    {
      label: 'Average RP',
      value: Math.round(avgRP).toString(),
      color: '#9BF00B'
    },
    {
      label: 'Top Player RP',
      value: Math.round(topPlayer?.player?.player_rp || 0).toString(),
      color: '#9C27B0'
    },
    {
      label: 'Active Since',
      value: crew?.created_at ? new Date(crew.created_at).getFullYear().toString() : '—',
      color: '#10B981'
    }
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
              <Typography variant="h5" fontWeight={800} sx={{ color: stat.color }}>
                {stat.value}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
