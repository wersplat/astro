import { Paper, Typography } from '@mui/material';

export default async function UpaCollegeEvents() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Upcoming Events
      </Typography>
      <Typography color="text.secondary">
        College events coming soon.
      </Typography>
    </Paper>
  );
}
