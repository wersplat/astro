import { Grid, Paper, Skeleton, Stack, Box } from '@mui/material';

export function CrewHeroHeaderSkeleton() {
  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Stack direction="row" spacing={2}>
        <Skeleton variant="circular" width={96} height={96} />
        <Stack spacing={1} sx={{ flex: 1 }}>
          <Skeleton variant="text" width={240} height={36} />
          <Skeleton variant="rounded" width={320} height={24} />
          <Skeleton variant="text" width="80%" />
        </Stack>
        <Skeleton variant="rounded" width={120} height={40} />
      </Stack>
    </Paper>
  );
}

export function CrewStatsSkeleton() {
  return (
    <Grid container spacing={2}>
      {[0,1,2,3].map(i => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Skeleton variant="text" width={60} />
            <Skeleton variant="text" width={80} height={36} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export function CrewTabsSkeleton() {
  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Skeleton variant="rounded" height={36} />
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" width={200} height={32} />
        <Stack spacing={2} sx={{ mt: 2 }}>
          {[0,1,2].map(i => (
            <Paper key={i} elevation={1} sx={{ p: 2 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Paper>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
