import { Grid, Paper, Skeleton, Stack, Box } from '@mui/material';

export function TournamentHeroHeaderSkeleton() {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={300} height={36} />
          <Skeleton variant="rounded" width={60} height={24} />
        </Box>
        <Skeleton variant="text" width="80%" />
        <Stack direction="row" spacing={3}>
          {[0,1,2,3].map(i => (
            <Box key={i}>
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={100} />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

export function TournamentStatsSkeleton() {
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

export function TournamentTabsSkeleton() {
  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Skeleton variant="rounded" height={36} />
      <Skeleton variant="text" width={200} sx={{ mt: 2 }} />
    </Paper>
  );
}
