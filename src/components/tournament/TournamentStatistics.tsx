import { Box, Paper, Typography, Grid } from '@mui/material';

type TournamentStatisticsProps = {
  tournamentLeaders: Array<{
    player_name: string;
    points_per_game: number;
  }>;
  bestPerformances: Array<{
    category: string;
    value: string;
  }>;
  tournamentRecords: Array<{
    record: string;
    value: string;
  }>;
};

export default function TournamentStatistics({ 
  tournamentLeaders, 
  bestPerformances, 
  tournamentRecords 
}: TournamentStatisticsProps) {
  const StatCard = ({ 
    title, 
    stats 
  }: { 
    title: string; 
    stats: Array<{ [key: string]: any }> 
  }) => (
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {stats.map((stat, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.primary">
              {Object.values(stat)[0] || stat.player_name || stat.category || stat.record}
            </Typography>
            <Typography variant="body2" color="primary.main" fontWeight={600}>
              {Object.values(stat)[1] || stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Tournament Statistics
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Tournament Leaders" 
            stats={tournamentLeaders || [
              { player_name: 'John "Dynasty" Smith', points_per_game: '35.2 PPG' },
              { player_name: 'Mike "Warrior" Johnson', points_per_game: '31.8 PPG' },
              { player_name: 'Chris "Legend" Davis', points_per_game: '29.5 PPG' }
            ]} 
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Best Performances" 
            stats={bestPerformances || [
              { category: 'Highest Score', value: '95 pts' },
              { category: 'Most Assists', value: '15 ast' },
              { category: 'Most Rebounds', value: '18 reb' }
            ]} 
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <StatCard 
            title="Tournament Records" 
            stats={tournamentRecords || [
              { record: 'Fastest Win', value: '12:34' },
              { record: 'Largest Margin', value: '+23' },
              { record: 'Most 3PM', value: '8 threes' }
            ]} 
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
