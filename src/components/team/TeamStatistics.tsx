import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Stack, 
  Chip, 
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  EmojiEvents as TrophyIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
  SportsBasketball as BasketballIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

type TeamPerformanceData = {
  team_id: string | null;
  team_name: string | null;
  current_rp: number | null;
  global_rank: number | null;
  matches_won: number | null;
  matches_lost: number | null;
  total_matches_played: number | null;
  win_percentage: number | null;
  avg_points_per_match: number | null;
  avg_assists: number | null;
  avg_rebounds: number | null;
  avg_steals: number | null;
  avg_blocks: number | null;
  avg_turnovers: number | null;
  field_goal_percentage: number | null;
  three_point_percentage: number | null;
  avg_field_goals_made: number | null;
  avg_field_goals_attempted: number | null;
  avg_three_points_made: number | null;
  avg_three_points_attempted: number | null;
  championship_count: number | null;
  tournament_appearances: number | null;
  tournament_wins: number | null;
  total_prize_earnings: number | null;
  money_won: number | null;
  current_roster_count: number | null;
  elo_rating: number | null;
  leaderboard_tier: string | null;
  roster_last_changed: string | null;
};

type TeamStatisticsProps = {
  teamPerformance: TeamPerformanceData | null;
  yearStats: any[];
};

export default function TeamStatistics({ teamPerformance, yearStats }: TeamStatisticsProps) {
  if (!teamPerformance) {
    return (
      <Box>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Team Statistics
        </Typography>
        <Typography color="text.secondary">
          No performance data available for this team.
        </Typography>
      </Box>
    );
  }

  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return '0.0%';
    // Check if it's already a percentage (0-100) or decimal (0-1)
    if (value > 1) {
      return `${value.toFixed(1)}%`;
    } else {
      return `${(value * 100).toFixed(1)}%`;
    }
  };

  const formatNumber = (value: number | null, decimals: number = 1) => {
    if (value === null || value === undefined) return '0.0';
    return value.toFixed(decimals);
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTierColor = (tier: string | null) => {
    if (!tier) return 'default';
    const tierLower = tier.toLowerCase();
    if (tierLower.includes('elite') || tierLower.includes('pro')) return 'error';
    if (tierLower.includes('champion') || tierLower.includes('master')) return 'warning';
    if (tierLower.includes('diamond') || tierLower.includes('gold')) return 'primary';
    return 'default';
  };

  const getRankColor = (rank: number | null) => {
    if (!rank) return 'default';
    if (rank <= 10) return 'error';
    if (rank <= 50) return 'warning';
    if (rank <= 100) return 'primary';
    return 'default';
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Live Team Statistics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <BasketballIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Team Overview
                </Typography>
              </Stack>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Global Rank</Typography>
                  <Chip 
                    label={`#${teamPerformance.global_rank || 'N/A'}`}
                    color={getRankColor(teamPerformance.global_rank)}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Current RP</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    {teamPerformance.current_rp || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Leaderboard Tier</Typography>
                  <Chip 
                    label={teamPerformance.leaderboard_tier || 'Unranked'}
                    color={getTierColor(teamPerformance.leaderboard_tier)}
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">ELO Rating</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatNumber(teamPerformance.elo_rating, 0)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <TimelineIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Match Performance
                </Typography>
              </Stack>
              
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Win Rate</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatPercentage(teamPerformance.win_percentage)}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={teamPerformance.win_percentage && teamPerformance.win_percentage > 1 
                      ? teamPerformance.win_percentage 
                      : (teamPerformance.win_percentage || 0) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Record</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {teamPerformance.matches_won || 0}-{teamPerformance.matches_lost || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Total Matches</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {teamPerformance.total_matches_played || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Points Per Game</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatNumber(teamPerformance.avg_points_per_match, 1)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Offensive Stats */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <TrendingUpIcon color="success" />
                <Typography variant="h6" fontWeight={700}>
                  Offensive Statistics
                </Typography>
              </Stack>
              
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Field Goal %</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatPercentage(teamPerformance.field_goal_percentage)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3-Point %</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatPercentage(teamPerformance.three_point_percentage)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FGM per Game</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatNumber(teamPerformance.avg_field_goals_made)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FGA per Game</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatNumber(teamPerformance.avg_field_goals_attempted)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3PM per Game</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatNumber(teamPerformance.avg_three_points_made)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>3PA per Game</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatNumber(teamPerformance.avg_three_points_attempted)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Defensive Stats */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <TrendingDownIcon color="error" />
                <Typography variant="h6" fontWeight={700}>
                  Defensive Statistics
                </Typography>
              </Stack>
              
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Steals per Game</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatNumber(teamPerformance.avg_steals)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Blocks per Game</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatNumber(teamPerformance.avg_blocks)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Rebounds per Game</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatNumber(teamPerformance.avg_rebounds)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Assists per Game</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatNumber(teamPerformance.avg_assists)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Turnovers per Game</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatNumber(teamPerformance.avg_turnovers)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <TrophyIcon color="warning" />
                <Typography variant="h6" fontWeight={700}>
                  Achievements
                </Typography>
              </Stack>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Championships</Typography>
                  <Chip 
                    label={teamPerformance.championship_count || 0}
                    color="warning"
                    size="small"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Tournament Wins</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {teamPerformance.tournament_wins || 0}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Tournament Appearances</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {teamPerformance.tournament_appearances || 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Performance */}
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <MoneyIcon color="success" />
                <Typography variant="h6" fontWeight={700}>
                  Financial Performance
                </Typography>
              </Stack>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">Total Prize Winnings</Typography>
                  <Typography variant="body1" fontWeight={600} color="success.main">
                    {formatCurrency(teamPerformance.money_won)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Roster Information */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <GroupIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Roster Information
                </Typography>
              </Stack>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={700} color="primary">
                      {teamPerformance.current_roster_count || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Players
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={700} color="primary">
                      {teamPerformance.total_matches_played || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Matches
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={700} color="primary">
                      {formatPercentage(teamPerformance.win_percentage)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Win Rate
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={700} color="primary">
                      {formatNumber(teamPerformance.avg_points_per_match, 1)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      PPG
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
