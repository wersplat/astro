import { Paper, Typography } from '@mui/material';

export default async function UpaCollegeStats() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        UPA College Statistics
      </Typography>
      <Typography color="text.secondary">
        College stats coming soon.
      </Typography>
    </Paper>
  );
}
