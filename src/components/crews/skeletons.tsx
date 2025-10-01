import { 
  Grid,
  Paper,
  Skeleton,
  Box,
  Stack
} from '@mui/material';

export function CrewsListSkeleton() {
  return (
    <Box>
      <Grid container spacing={3}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: 280 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Skeleton variant="circular" width={56} height={56} />
              </Box>

              {/* Crew Name */}
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />

              {/* Description */}
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />

              {/* Stats */}
              <Stack spacing={2} sx={{ mt: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width={60} />
                  <Skeleton variant="text" width={30} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton variant="text" width={50} />
                  <Skeleton variant="text" width={80} />
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Skeleton variant="rounded" width={300} height={40} />
      </Box>
    </Box>
  );
}
