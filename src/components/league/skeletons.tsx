import { Paper, Skeleton } from '@mui/material';

export function LeagueHeroHeaderSkeleton() {
  return (
    <Paper sx={{ p: 3 }}>
      <Skeleton variant="text" width={300} height={36} />
    </Paper>
  );
}

export function LeagueStatsSkeleton() {
  return <Skeleton variant="text" width={200} />;
}

export function LeagueTabsSkeleton() {
  return (
    <Paper sx={{ p: 2 }}>
      <Skeleton variant="text" width={200} />
    </Paper>
  );
}
