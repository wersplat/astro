import { Paper, Typography } from '@mui/material';

export default async function UpaCollegeLeaderboard() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        College Leaderboard
      </Typography>
      <Typography color="text.secondary">
        College leaderboard coming soon.
      </Typography>
    </Paper>
  );
}
