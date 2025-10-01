import { Grid, Paper, Skeleton, Stack } from '@mui/material';

export function HeroHeaderSkeleton() {
  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Stack direction="row" spacing={2}>
        <Skeleton variant="circular" width={96} height={96} />
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Skeleton variant="text" width={240} height={36} />
          <Skeleton variant="rounded" width={320} height={24} />
        </Stack>
        <Skeleton variant="rounded" width={120} height={40} />
      </Stack>
    </Paper>
  );
}

export function StatTilesSkeleton() {
  return (
    <Grid container spacing={2}>
      {[0,1,2,3].map(i => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={80} height={36} />
            <Skeleton variant="text" width={120} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export function TabsSkeleton() {
  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Skeleton variant="rounded" height={36} />
      <Skeleton variant="rounded" height={180} sx={{ mt: 2 }} />
    </Paper>
  );
}

export function GamesTableSkeleton() {
  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Skeleton variant="rounded" height={240} />
    </Paper>
  );
}

export function GridSkeleton() {
  return (
    <Grid container spacing={2}>
      {[0,1,2].map(i => (
        <Grid item xs={12} md={4} key={i}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Skeleton variant="rounded" height={120} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}


