import { Grid, Paper, Stack, Typography } from '@mui/material';

export default function TournamentStats({ tournament, participants }: { tournament: any; participants: any[] }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">Participants</Typography>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#3B82F6' }}>
              {participants?.length || 0}
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  );
}
