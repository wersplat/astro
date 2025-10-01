import { Paper, Typography } from '@mui/material';

export default async function TeamPreviewFeatures() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Team Features
      </Typography>
      <Typography color="text.secondary">
        Team features coming soon.
      </Typography>
    </Paper>
  );
}
