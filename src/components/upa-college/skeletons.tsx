import { Paper, Skeleton } from '@mui/material';

export function UpaCollegeSkeleton() {
  return (
    <Paper sx={{ p: 3 }}>
      <Skeleton variant="text" width={300} height={32} />
      <Skeleton variant="text" width={200} />
    </Paper>
  );
}
