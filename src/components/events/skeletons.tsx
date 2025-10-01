import { 
  Paper,
  Skeleton,
  Box,
  Stack,
  Grid
} from '@mui/material';

export function EventsListSkeleton() {
  return (
    <Box>
      <Stack spacing={3}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Paper key={i} elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Skeleton variant="text" width={200} height={32} />
                      <Skeleton variant="rounded" width={40} height={24} />
                      <Skeleton variant="rounded" width={80} height={24} />
                    </Box>
                    
                    <Skeleton variant="text" width="90%" sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="70%" sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Skeleton variant="text" width={100} />
                      <Skeleton variant="text" width={120} />
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={80} height={32} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Stack>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Skeleton variant="rounded" width={300} height={40} />
      </Box>
    </Box>
  );
}
