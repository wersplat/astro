import { Box, Paper, Typography, Grid, Chip, Link } from '@mui/material';

type TournamentInformationProps = {
  tournament: any;
};

export default function TournamentInformation({ tournament }: TournamentInformationProps) {
  if (!tournament) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Tournament Information</Typography>
        <Typography color="text.secondary">No tournament information available.</Typography>
      </Paper>
    );
  }

  const getRegistrationStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'success';
      case 'closed': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Tournament Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1">
                {tournament.description || 'A major championship tournament featuring the top teams competing for glory and substantial prizes.'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Format
              </Typography>
              <Typography variant="body1">
                {tournament.format || 'Single elimination bracket'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Location
              </Typography>
              <Typography variant="body1">
                {tournament.location || 'Online Tournament'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Registration Status
              </Typography>
              <Chip 
                label={tournament.registration_status || 'Open'} 
                color={getRegistrationStatusColor(tournament.registration_status) as any}
                size="small"
              />
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Entry Fee
              </Typography>
              <Typography variant="body1">
                {tournament.entry_fee || '$200 per team'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Rules
              </Typography>
              <a href={tournament.rules_url || '#'} color="primary" underline="hover">
                View Tournament Rules
              </a>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body1">
                {tournament.contact_email || 'tournament@proam.com'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Stream
              </Typography>
              <a href={tournament.stream_url || '#'} color="primary" underline="hover">
                Watch Live Stream
              </a>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
