import { Box, Paper, Typography, Grid, Chip, Stack, Avatar, Divider, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TableSortLabel, IconButton } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useState, useMemo } from 'react';

type LeagueStatisticsProps = {
  topScorers: Array<{
    player_name: string;
    points_per_game?: number;
    points?: number;
  }>;
  topAssists: Array<{
    player_name: string;
    assists_per_game?: number;
    assists?: number;
  }>;
  topRebounders: Array<{
    player_name: string;
    rebounds_per_game?: number;
    rebounds?: number;
  }>;
  topSteals?: Array<{
    player_name: string;
    steals_per_game?: number;
    steals?: number;
  }>;
  topBlocks?: Array<{
    player_name: string;
    blocks_per_game?: number;
    blocks?: number;
  }>;
  topThreePoint?: Array<{
    player_name: string;
    three_point_percentage?: number;
    three_points_made?: number;
    three_points_attempted?: number;
  }>;
  teamStats?: Array<{
    team_name: string;
    team_id: string;
    wins: number;
    losses: number;
    win_percentage: number;
    points_for: number;
    points_against: number;
    point_differential: number;
    current_rp: number;
    logo_url?: string;
    teams?: {
      hybrid_score: number;
    };
  }>;
  teamMatchStats?: Array<{
    id: string;
    match_id: string;
    team_id: string;
    points: number | null;
    rebounds: number | null;
    assists: number | null;
    steals: number | null;
    blocks: number | null;
    turnovers: number | null;
    field_goals_made: number | null;
    field_goals_attempted: number | null;
    three_points_made: number | null;
    three_points_attempted: number | null;
    free_throws_made: number | null;
    free_throws_attempted: number | null;
    fouls: number | null;
    plus_minus: number | null;
    team_name?: string;
    logo_url?: string;
  }>;
  showCompleteStats?: boolean;
  showTopPerformers?: boolean;
  allPlayerStats?: Array<{
    player_name: string;
    points: number | null;
    assists: number | null;
    rebounds: number | null;
    steals: number | null;
    blocks: number | null;
    turnovers: number | null;
    field_goals_made: number | null;
    field_goals_attempted: number | null;
    three_points_made: number | null;
    three_points_attempted: number | null;
    free_throws_made: number | null;
    free_throws_attempted: number | null;
    fouls: number | null;
    plus_minus: number | null;
    team_name?: string;
    games_played: number;
  }>;
};

export default function LeagueStatistics({ 
  topScorers, 
  topAssists, 
  topRebounders,
  topSteals = [],
  topBlocks = [],
  topThreePoint = [],
  teamStats = [],
  teamMatchStats = [],
  showCompleteStats = false,
  showTopPerformers = false,
  allPlayerStats = []
}: LeagueStatisticsProps) {
  // Sorting state for player stats table
  const [playerSortField, setPlayerSortField] = useState<string>('points');
  const [playerSortDirection, setPlayerSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sorting state for team stats table
  const [teamSortField, setTeamSortField] = useState<string>('wins');
  const [teamSortDirection, setTeamSortDirection] = useState<'asc' | 'desc'>('desc');

  // Handle player stats sorting
  const handlePlayerSort = (field: string) => {
    if (playerSortField === field) {
      setPlayerSortDirection(playerSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setPlayerSortField(field);
      setPlayerSortDirection('desc');
    }
  };

  // Handle team stats sorting
  const handleTeamSort = (field: string) => {
    if (teamSortField === field) {
      setTeamSortDirection(teamSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setTeamSortField(field);
      setTeamSortDirection('desc');
    }
  };

  // Sort player stats
  const sortedPlayerStats = useMemo(() => {
    if (!showCompleteStats) return allPlayerStats;
    
    return [...allPlayerStats].sort((a, b) => {
      let aValue = a[playerSortField as keyof typeof a];
      let bValue = b[playerSortField as keyof typeof b];
      
      // Handle null/undefined values
      if (aValue == null) aValue = 0;
      if (bValue == null) bValue = 0;
      
      // Convert to numbers if they're strings
      if (typeof aValue === 'string') aValue = parseFloat(aValue) || 0;
      if (typeof bValue === 'string') bValue = parseFloat(bValue) || 0;
      
      if (playerSortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [allPlayerStats, playerSortField, playerSortDirection, showCompleteStats]);

  // Sort team stats
  const sortedTeamStats = useMemo(() => {
    if (!showCompleteStats) return teamStats;
    
    return [...teamStats].sort((a, b) => {
      let aValue = a[teamSortField as keyof typeof a];
      let bValue = b[teamSortField as keyof typeof b];
      
      // Handle nested objects (like teams.hybrid_score)
      if (teamSortField === 'hybrid_score') {
        aValue = a.teams?.hybrid_score;
        bValue = b.teams?.hybrid_score;
      }
      
      // Handle null/undefined values
      if (aValue == null) aValue = 0;
      if (bValue == null) bValue = 0;
      
      // Convert to numbers if they're strings
      if (typeof aValue === 'string') aValue = parseFloat(aValue) || 0;
      if (typeof bValue === 'string') bValue = parseFloat(bValue) || 0;
      
      if (teamSortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [teamStats, teamSortField, teamSortDirection, showCompleteStats]);

  // Helper component for sortable table headers
  const SortableHeader = ({ 
    field, 
    children, 
    onSort, 
    sortField, 
    sortDirection 
  }: { 
    field: string; 
    children: React.ReactNode; 
    onSort: (field: string) => void;
    sortField: string;
    sortDirection: 'asc' | 'desc';
  }) => (
    <TableCell 
      align="right"
      sx={{ 
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': { backgroundColor: 'action.hover' }
      }}
      onClick={() => onSort(field)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
        )}
      </Box>
    </TableCell>
  );

  const StatCard = ({ 
    title, 
    stats,
    showRanking = false,
    fieldName
  }: { 
    title: string; 
    stats: Array<{ player_name: string; [key: string]: any }>;
    showRanking?: boolean;
    fieldName?: string;
  }) => (
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {stats.map((stat, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              {showRanking && (
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 20 }}>
                  #{index + 1}
                </Typography>
              )}
              <Typography variant="body2" color="text.primary" sx={{ flex: 1 }}>
                {stat.player_name}
              </Typography>
            </Box>
            <Typography variant="body2" color="primary.main" fontWeight={600}>
              {(() => {
                // Check for three-point percentage first
                if (stat.three_point_percentage !== undefined) {
                  return `${stat.three_point_percentage.toFixed(1)}%`;
                }
                
                // Use the specified field name if provided
                if (fieldName && stat[fieldName] !== undefined) {
                  if (fieldName === 'three_point_percentage') {
                    return `${stat[fieldName].toFixed(1)}%`;
                  } else if (fieldName.includes('_per_game')) {
                    const statName = fieldName.replace('_per_game', '').toUpperCase();
                    return `${stat[fieldName].toFixed(1)} ${statName}/PG`;
                  }
                }
                
                // Check for per-game averages - prioritize the highest value
                const perGameKeys = ['points_per_game', 'assists_per_game', 'rebounds_per_game', 'steals_per_game', 'blocks_per_game'];
                let bestPerGameKey = null;
                let bestValue = -1;
                
                for (const key of perGameKeys) {
                  if (stat[key] !== undefined && stat[key] > bestValue) {
                    bestPerGameKey = key;
                    bestValue = stat[key];
                  }
                }
                
                if (bestPerGameKey) {
                  const statName = bestPerGameKey.replace('_per_game', '').toUpperCase();
                  return `${stat[bestPerGameKey].toFixed(1)} ${statName}/PG`;
                }
                
                // Fallback to any numeric value
                const numericValue = Object.values(stat).find((value, i) => i > 0 && typeof value === 'number');
                const numericKey = Object.keys(stat).find((key, i) => i > 0 && typeof stat[key] === 'number');
                if (!numericValue || !numericKey) return '—';
                
                // Format the value
                const formattedValue = numericKey.includes('_per_game') 
                  ? numericValue.toFixed(1) 
                  : Math.round(numericValue);
                
                // Format the unit
                const unit = numericKey.replace('_per_game', '').toUpperCase();
                return `${formattedValue}${unit}`;
              })()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  const TeamStatCard = ({ 
    title, 
    teams,
    showRanking = false,
    showLogo = false
  }: { 
    title: string; 
    teams: Array<{ team_name: string; [key: string]: any; logo_url?: string }>;
    showRanking?: boolean;
    showLogo?: boolean;
  }) => (
    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {teams.slice(0, 5).map((team, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
              {showRanking && (
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 20 }}>
                  #{index + 1}
                </Typography>
              )}
              {showLogo && (
                <Avatar src={team.logo_url} sx={{ width: 20, height: 20 }}>
                  {team.team_name?.slice(0, 2).toUpperCase()}
                </Avatar>
              )}
              <Typography variant="body2" color="text.primary" sx={{ flex: 1 }}>
                {team.team_name}
              </Typography>
            </Box>
            <Typography variant="body2" color="primary.main" fontWeight={600}>
              {Object.values(team).find((value, i) => i > 0 && typeof value === 'number')?.toFixed(1) || '—'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Show top performers when showTopPerformers is true or when not showing complete stats */}
      {(showTopPerformers || !showCompleteStats) && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            {showTopPerformers ? 'Top Performers' : 'Player Statistics'}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Top Scorers" 
                stats={topScorers || []}
                showRanking={true}
                fieldName="points_per_game"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Top Assists" 
                stats={topAssists || []}
                showRanking={true}
                fieldName="assists_per_game"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <StatCard 
                title="Top Rebounders" 
                stats={topRebounders || []}
                showRanking={true}
                fieldName="rebounds_per_game"
              />
            </Grid>

            {/* Additional statistics for top performers */}
            {showTopPerformers && (
              <>
                <Grid item xs={12} md={4}>
                  <StatCard 
                    title="Top Steals" 
                    stats={topSteals || []}
                    showRanking={true}
                    fieldName="steals_per_game"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <StatCard 
                    title="Top Blocks" 
                    stats={topBlocks || []}
                    showRanking={true}
                    fieldName="blocks_per_game"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <StatCard 
                    title="Top 3PT%" 
                    stats={topThreePoint || []}
                    showRanking={true}
                    fieldName="three_point_percentage"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      )}

      {!showCompleteStats && teamStats && teamStats.length > 0 && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Team Statistics
          </Typography>
          
          {/* League Overview Stats */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
              League Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h4" color="primary.main" fontWeight={800}>
                    {teamStats.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Teams
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h4" color="primary.main" fontWeight={800}>
                    {teamStats.reduce((sum, team) => sum + (team.wins || 0), 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Wins
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h4" color="primary.main" fontWeight={800}>
                    {teamStats.reduce((sum, team) => sum + (team.points_for || 0), 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Points
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h4" color="primary.main" fontWeight={800}>
                    {teamStats.length > 0 ? (teamStats.reduce((sum, team) => sum + (team.win_percentage || 0), 0) / teamStats.length).toFixed(1) : '0.0'}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg Win %
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Team Performance Stats */}
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Team Performance Rankings
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Best Offense (Points For)" 
                teams={teamStats
                  .sort((a, b) => (b.points_for || 0) - (a.points_for || 0))
                  .map(team => ({ team_name: team.team_name, points_for: team.points_for, logo_url: team.logo_url }))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Best Defense (Points Against)" 
                teams={teamStats
                  .sort((a, b) => (a.points_against || 0) - (b.points_against || 0))
                  .map(team => ({ team_name: team.team_name, points_against: team.points_against, logo_url: team.logo_url }))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Point Differential" 
                teams={teamStats
                  .sort((a, b) => (b.point_differential || 0) - (a.point_differential || 0))
                  .map(team => ({ 
                    team_name: team.team_name, 
                    point_differential: team.point_differential || 0, 
                    logo_url: team.logo_url 
                  }))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Win Percentage" 
                teams={teamStats
                  .sort((a, b) => (b.win_percentage || 0) - (a.win_percentage || 0))
                  .map(team => ({ team_name: team.team_name, win_percentage: team.win_percentage, logo_url: team.logo_url }))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Most Wins" 
                teams={teamStats
                  .sort((a, b) => (b.wins || 0) - (a.wins || 0))
                  .map(team => ({ team_name: team.team_name, wins: team.wins, logo_url: team.logo_url }))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Highest Hybrid Score" 
                teams={teamStats
                  .sort((a, b) => (b.teams?.hybrid_score || 0) - (a.teams?.hybrid_score || 0))
                  .map(team => ({ team_name: team.team_name, hybrid_score: team.teams?.hybrid_score, logo_url: team.logo_url }))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Most Losses" 
                teams={teamStats
                  .sort((a, b) => (b.losses || 0) - (a.losses || 0))
                  .map(team => ({ team_name: team.team_name, losses: team.losses, logo_url: team.logo_url }))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Highest Current RP" 
                teams={teamStats
                  .sort((a, b) => (b.current_rp || 0) - (a.current_rp || 0))
                  .map(team => ({ team_name: team.team_name, current_rp: team.current_rp, logo_url: team.logo_url }))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>
          </Grid>

          {/* Advanced Performance Statistics */}
          {teamMatchStats && teamMatchStats.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Advanced Performance Statistics
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Best Field Goal Percentage" 
                    teams={(() => {
                      // Calculate average FG% per team
                      const teamFgMap = new Map();
                      teamMatchStats.forEach(stat => {
                        if (stat.field_goals_made !== null && stat.field_goals_attempted !== null && stat.field_goals_attempted > 0) {
                          const fgPct = ((stat.field_goals_made || 0) / (stat.field_goals_attempted || 1)) * 100;
                          if (!teamFgMap.has(stat.team_id)) {
                            teamFgMap.set(stat.team_id, { totalFgPct: 0, games: 0, team_name: stat.team_name, logo_url: stat.logo_url });
                          }
                          const teamData = teamFgMap.get(stat.team_id);
                          teamData.totalFgPct += fgPct;
                          teamData.games += 1;
                        }
                      });
                      
                      return Array.from(teamFgMap.entries())
                        .map(([teamId, data]) => ({
                          team_name: data.team_name || `Team ${teamId}`,
                          fg_percentage: data.games > 0 ? data.totalFgPct / data.games : 0,
                          logo_url: data.logo_url
                        }))
                        .sort((a, b) => (b.fg_percentage || 0) - (a.fg_percentage || 0))
                        .slice(0, 5);
                    })()}
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Best 3-Point Percentage" 
                    teams={(() => {
                      // Calculate average 3PT% per team
                      const team3PtMap = new Map();
                      teamMatchStats.forEach(stat => {
                        if (stat.three_points_made !== null && stat.three_points_attempted !== null && stat.three_points_attempted > 0) {
                          const threePtPct = ((stat.three_points_made || 0) / (stat.three_points_attempted || 1)) * 100;
                          if (!team3PtMap.has(stat.team_id)) {
                            team3PtMap.set(stat.team_id, { total3PtPct: 0, games: 0, team_name: stat.team_name, logo_url: stat.logo_url });
                          }
                          const teamData = team3PtMap.get(stat.team_id);
                          teamData.total3PtPct += threePtPct;
                          teamData.games += 1;
                        }
                      });
                      
                      return Array.from(team3PtMap.entries())
                        .map(([teamId, data]) => ({
                          team_name: data.team_name || `Team ${teamId}`,
                          three_pt_percentage: data.games > 0 ? data.total3PtPct / data.games : 0,
                          logo_url: data.logo_url
                        }))
                        .sort((a, b) => (b.three_pt_percentage || 0) - (a.three_pt_percentage || 0))
                        .slice(0, 5);
                    })()}
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Assists Per Game" 
                    teams={(() => {
                      // Calculate average assists per team
                      const teamAssistsMap = new Map();
                      teamMatchStats.forEach(stat => {
                        if (stat.assists !== null) {
                          if (!teamAssistsMap.has(stat.team_id)) {
                            teamAssistsMap.set(stat.team_id, { totalAssists: 0, games: 0, team_name: stat.team_name, logo_url: stat.logo_url });
                          }
                          const teamData = teamAssistsMap.get(stat.team_id);
                          teamData.totalAssists += (stat.assists || 0);
                          teamData.games += 1;
                        }
                      });
                      
                      return Array.from(teamAssistsMap.entries())
                        .map(([teamId, data]) => ({
                          team_name: data.team_name || `Team ${teamId}`,
                          assists_per_game: data.games > 0 ? data.totalAssists / data.games : 0,
                          logo_url: data.logo_url
                        }))
                        .sort((a, b) => (b.assists_per_game || 0) - (a.assists_per_game || 0))
                        .slice(0, 5);
                    })()}
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Rebounds Per Game" 
                    teams={(() => {
                      // Calculate average rebounds per team
                      const teamReboundsMap = new Map();
                      teamMatchStats.forEach(stat => {
                        if (stat.rebounds !== null) {
                          if (!teamReboundsMap.has(stat.team_id)) {
                            teamReboundsMap.set(stat.team_id, { totalRebounds: 0, games: 0, team_name: stat.team_name, logo_url: stat.logo_url });
                          }
                          const teamData = teamReboundsMap.get(stat.team_id);
                          teamData.totalRebounds += (stat.rebounds || 0);
                          teamData.games += 1;
                        }
                      });
                      
                      return Array.from(teamReboundsMap.entries())
                        .map(([teamId, data]) => ({
                          team_name: data.team_name || `Team ${teamId}`,
                          rebounds_per_game: data.games > 0 ? data.totalRebounds / data.games : 0,
                          logo_url: data.logo_url
                        }))
                        .sort((a, b) => (b.rebounds_per_game || 0) - (a.rebounds_per_game || 0))
                        .slice(0, 5);
                    })()}
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Steals Per Game" 
                    teams={(() => {
                      // Calculate average steals per team
                      const teamStealsMap = new Map();
                      teamMatchStats.forEach(stat => {
                        if (stat.steals !== null) {
                          if (!teamStealsMap.has(stat.team_id)) {
                            teamStealsMap.set(stat.team_id, { totalSteals: 0, games: 0, team_name: stat.team_name, logo_url: stat.logo_url });
                          }
                          const teamData = teamStealsMap.get(stat.team_id);
                          teamData.totalSteals += (stat.steals || 0);
                          teamData.games += 1;
                        }
                      });
                      
                      return Array.from(teamStealsMap.entries())
                        .map(([teamId, data]) => ({
                          team_name: data.team_name || `Team ${teamId}`,
                          steals_per_game: data.games > 0 ? data.totalSteals / data.games : 0,
                          logo_url: data.logo_url
                        }))
                        .sort((a, b) => (b.steals_per_game || 0) - (a.steals_per_game || 0))
                        .slice(0, 5);
                    })()}
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Blocks Per Game" 
                    teams={(() => {
                      // Calculate average blocks per team
                      const teamBlocksMap = new Map();
                      teamMatchStats.forEach(stat => {
                        if (stat.blocks !== null) {
                          if (!teamBlocksMap.has(stat.team_id)) {
                            teamBlocksMap.set(stat.team_id, { totalBlocks: 0, games: 0, team_name: stat.team_name, logo_url: stat.logo_url });
                          }
                          const teamData = teamBlocksMap.get(stat.team_id);
                          teamData.totalBlocks += (stat.blocks || 0);
                          teamData.games += 1;
                        }
                      });
                      
                      return Array.from(teamBlocksMap.entries())
                        .map(([teamId, data]) => ({
                          team_name: data.team_name || `Team ${teamId}`,
                          blocks_per_game: data.games > 0 ? data.totalBlocks / data.games : 0,
                          logo_url: data.logo_url
                        }))
                        .sort((a, b) => (b.blocks_per_game || 0) - (a.blocks_per_game || 0))
                        .slice(0, 5);
                    })()}
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>
              </Grid>
            </>
          )}

          {/* Advanced Team Statistics */}
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Advanced Team Statistics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Best Point Differential Per Game" 
                teams={teamStats
                  .map(team => {
                    const gamesPlayed = (team.wins || 0) + (team.losses || 0);
                    const avgDifferential = gamesPlayed > 0 ? (team.point_differential || 0) / gamesPlayed : 0;
                    return { 
                      team_name: team.team_name, 
                      avg_differential: avgDifferential, 
                      logo_url: team.logo_url 
                    };
                  })
                  .sort((a, b) => (b.avg_differential || 0) - (a.avg_differential || 0))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Best Points Per Game" 
                teams={teamStats
                  .map(team => {
                    const gamesPlayed = (team.wins || 0) + (team.losses || 0);
                    const avgPointsFor = gamesPlayed > 0 ? (team.points_for || 0) / gamesPlayed : 0;
                    return { 
                      team_name: team.team_name, 
                      avg_points_for: avgPointsFor, 
                      logo_url: team.logo_url 
                    };
                  })
                  .sort((a, b) => (b.avg_points_for || 0) - (a.avg_points_for || 0))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Best Defense Per Game" 
                teams={teamStats
                  .map(team => {
                    const gamesPlayed = (team.wins || 0) + (team.losses || 0);
                    const avgPointsAgainst = gamesPlayed > 0 ? (team.points_against || 0) / gamesPlayed : 0;
                    return { 
                      team_name: team.team_name, 
                      avg_points_against: avgPointsAgainst, 
                      logo_url: team.logo_url 
                    };
                  })
                  .sort((a, b) => (a.avg_points_against || 0) - (b.avg_points_against || 0))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Most Games Played" 
                teams={teamStats
                  .map(team => {
                    const gamesPlayed = (team.wins || 0) + (team.losses || 0);
                    return { 
                      team_name: team.team_name, 
                      games_played: gamesPlayed, 
                      logo_url: team.logo_url 
                    };
                  })
                  .sort((a, b) => (b.games_played || 0) - (a.games_played || 0))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Best Win Streak Potential" 
                teams={teamStats
                  .filter(team => (team.wins || 0) > 0)
                  .sort((a, b) => {
                    const aWinRate = (a.wins || 0) / ((a.wins || 0) + (a.losses || 0));
                    const bWinRate = (b.wins || 0) / ((b.wins || 0) + (b.losses || 0));
                    return bWinRate - aWinRate;
                  })
                  .map(team => ({ 
                    team_name: team.team_name, 
                    win_rate: ((team.wins || 0) / ((team.wins || 0) + (team.losses || 0)) * 100), 
                    logo_url: team.logo_url 
                  }))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Most Efficient Offense" 
                teams={teamStats
                  .map(team => {
                    const gamesPlayed = (team.wins || 0) + (team.losses || 0);
                    const avgPointsFor = gamesPlayed > 0 ? (team.points_for || 0) / gamesPlayed : 0;
                    const efficiency = avgPointsFor > 0 ? avgPointsFor / Math.max(avgPointsFor, 1) : 0;
                    return { 
                      team_name: team.team_name, 
                      efficiency: efficiency * 100, 
                      logo_url: team.logo_url 
                    };
                  })
                  .sort((a, b) => (b.efficiency || 0) - (a.efficiency || 0))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>
          </Grid>

          {/* Team Performance Trends */}
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Team Performance Trends
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Highest Single Game Score" 
                teams={teamMatchStats
                  .filter(stat => stat.points !== null)
                  .sort((a, b) => (b.points || 0) - (a.points || 0))
                  .slice(0, 5)
                  .map(stat => ({ 
                    team_name: stat.team_name || `Team ${stat.team_id}`, 
                    single_game_high: stat.points, 
                    logo_url: stat.logo_url 
                  }))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Best Single Game Defense" 
                teams={(() => {
                  // Group by team and find the lowest points allowed per team
                  const teamDefenseMap = new Map();
                  teamMatchStats.forEach(stat => {
                    if (stat.points !== null && stat.team_id) {
                      if (!teamDefenseMap.has(stat.team_id) || stat.points < teamDefenseMap.get(stat.team_id).points) {
                        teamDefenseMap.set(stat.team_id, {
                          team_name: stat.team_name || `Team ${stat.team_id}`,
                          points_allowed: stat.points,
                          logo_url: stat.logo_url
                        });
                      }
                    }
                  });
                  return Array.from(teamDefenseMap.values())
                    .sort((a, b) => (a.points_allowed || 0) - (b.points_allowed || 0))
                    .slice(0, 5);
                })()}
                showRanking={true}
                showLogo={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Most Consistent Teams" 
                teams={teamStats
                  .map(team => {
                    const gamesPlayed = (team.wins || 0) + (team.losses || 0);
                    const winRate = gamesPlayed > 0 ? (team.wins || 0) / gamesPlayed : 0;
                    const consistency = Math.abs(winRate - 0.5); // Closer to 0.5 means more consistent
                    return { 
                      team_name: team.team_name, 
                      consistency: (1 - consistency) * 100, // Higher is more consistent
                      logo_url: team.logo_url 
                    };
                  })
                  .sort((a, b) => (b.consistency || 0) - (a.consistency || 0))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TeamStatCard 
                title="Most Dominant Teams" 
                teams={teamStats
                  .map(team => {
                    const totalPoints = (team.points_for || 0) + (team.points_against || 0);
                    const dominance = totalPoints > 0 ? ((team.points_for || 0) / totalPoints) * 100 : 0;
                    return { 
                      team_name: team.team_name, 
                      dominance: dominance, 
                      logo_url: team.logo_url 
                    };
                  })
                  .sort((a, b) => (b.dominance || 0) - (a.dominance || 0))
                }
                showRanking={true}
                showLogo={true}
              />
            </Grid>
          </Grid>

          {/* Single Game Performance Statistics */}
          {teamMatchStats && teamMatchStats.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
                Single Game Performance Records
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Most Assists in a Game" 
                    teams={teamMatchStats
                      .filter(stat => stat.assists !== null)
                      .sort((a, b) => (b.assists || 0) - (a.assists || 0))
                      .slice(0, 5)
                      .map(stat => ({ 
                        team_name: stat.team_name || `Team ${stat.team_id}`, 
                        assists: stat.assists, 
                        logo_url: stat.logo_url 
                      }))
                    }
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Most Rebounds in a Game" 
                    teams={teamMatchStats
                      .filter(stat => stat.rebounds !== null)
                      .sort((a, b) => (b.rebounds || 0) - (a.rebounds || 0))
                      .slice(0, 5)
                      .map(stat => ({ 
                        team_name: stat.team_name || `Team ${stat.team_id}`, 
                        rebounds: stat.rebounds, 
                        logo_url: stat.logo_url 
                      }))
                    }
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Most Steals in a Game" 
                    teams={teamMatchStats
                      .filter(stat => stat.steals !== null)
                      .sort((a, b) => (b.steals || 0) - (a.steals || 0))
                      .slice(0, 5)
                      .map(stat => ({ 
                        team_name: stat.team_name || `Team ${stat.team_id}`, 
                        steals: stat.steals, 
                        logo_url: stat.logo_url 
                      }))
                    }
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Most Blocks in a Game" 
                    teams={teamMatchStats
                      .filter(stat => stat.blocks !== null)
                      .sort((a, b) => (b.blocks || 0) - (a.blocks || 0))
                      .slice(0, 5)
                      .map(stat => ({ 
                        team_name: stat.team_name || `Team ${stat.team_id}`, 
                        blocks: stat.blocks, 
                        logo_url: stat.logo_url 
                      }))
                    }
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Best 3 Point Percentage" 
                    teams={teamMatchStats
                      .filter(stat => stat.three_points_made !== null && stat.three_points_attempted !== null && stat.three_points_attempted > 0)
                      .map(stat => ({
                        ...stat,
                        three_pt_percentage: ((stat.three_points_made || 0) / (stat.three_points_attempted || 1)) * 100
                      }))
                      .sort((a, b) => (b.three_pt_percentage || 0) - (a.three_pt_percentage || 0))
                      .slice(0, 5)
                      .map(stat => ({ 
                        team_name: stat.team_name || `Team ${stat.team_id}`, 
                        three_pt_percentage: stat.three_pt_percentage, 
                        logo_url: stat.logo_url 
                      }))
                    }
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TeamStatCard 
                    title="Best Field Goal Percentage" 
                    teams={teamMatchStats
                      .filter(stat => stat.field_goals_made !== null && stat.field_goals_attempted !== null && stat.field_goals_attempted > 0)
                      .map(stat => ({
                        ...stat,
                        fg_percentage: ((stat.field_goals_made || 0) / (stat.field_goals_attempted || 1)) * 100
                      }))
                      .sort((a, b) => (b.fg_percentage || 0) - (a.fg_percentage || 0))
                      .slice(0, 5)
                      .map(stat => ({ 
                        team_name: stat.team_name || `Team ${stat.team_id}`, 
                        fg_percentage: stat.fg_percentage, 
                        logo_url: stat.logo_url 
                      }))
                    }
                    showRanking={true}
                    showLogo={true}
                  />
                </Grid>
              </Grid>
            </>
          )}
        </Paper>
      )}

      {/* Complete Statistics Tables for Season Statistics tab */}
      {showCompleteStats && (
        <>
          {/* Complete Player Statistics Table */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Complete Player Statistics
            </Typography>
            
            {allPlayerStats.length > 0 ? (
              <TableContainer>
                <Table size="small" sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Player</TableCell>
                      <TableCell>Team</TableCell>
                      <SortableHeader 
                        field="games_played" 
                        onSort={handlePlayerSort} 
                        sortField={playerSortField} 
                        sortDirection={playerSortDirection}
                      >
                        Games
                      </SortableHeader>
                      <SortableHeader 
                        field="points" 
                        onSort={handlePlayerSort} 
                        sortField={playerSortField} 
                        sortDirection={playerSortDirection}
                      >
                        Points
                      </SortableHeader>
                      <SortableHeader 
                        field="assists" 
                        onSort={handlePlayerSort} 
                        sortField={playerSortField} 
                        sortDirection={playerSortDirection}
                      >
                        Assists
                      </SortableHeader>
                      <SortableHeader 
                        field="rebounds" 
                        onSort={handlePlayerSort} 
                        sortField={playerSortField} 
                        sortDirection={playerSortDirection}
                      >
                        Rebounds
                      </SortableHeader>
                      <SortableHeader 
                        field="steals" 
                        onSort={handlePlayerSort} 
                        sortField={playerSortField} 
                        sortDirection={playerSortDirection}
                      >
                        Steals
                      </SortableHeader>
                      <SortableHeader 
                        field="blocks" 
                        onSort={handlePlayerSort} 
                        sortField={playerSortField} 
                        sortDirection={playerSortDirection}
                      >
                        Blocks
                      </SortableHeader>
                      <SortableHeader 
                        field="turnovers" 
                        onSort={handlePlayerSort} 
                        sortField={playerSortField} 
                        sortDirection={playerSortDirection}
                      >
                        Turnovers
                      </SortableHeader>
                      <TableCell align="right">FG%</TableCell>
                      <TableCell align="right">3PT%</TableCell>
                      <TableCell align="right">FT%</TableCell>
                      <SortableHeader 
                        field="plus_minus" 
                        onSort={handlePlayerSort} 
                        sortField={playerSortField} 
                        sortDirection={playerSortDirection}
                      >
                        +/-
                      </SortableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedPlayerStats.map((player, index) => {
                      const fgPct = player.field_goals_attempted && player.field_goals_attempted > 0 
                        ? ((player.field_goals_made || 0) / player.field_goals_attempted * 100).toFixed(1)
                        : '—';
                      const threePtPct = player.three_points_attempted && player.three_points_attempted > 0 
                        ? ((player.three_points_made || 0) / player.three_points_attempted * 100).toFixed(1)
                        : '—';
                      const ftPct = player.free_throws_attempted && player.free_throws_attempted > 0 
                        ? ((player.free_throws_made || 0) / player.free_throws_attempted * 100).toFixed(1)
                        : '—';

                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {player.player_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {player.team_name || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {player.games_played || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              {player.points || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {player.assists || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {player.rebounds || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {player.steals || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {player.blocks || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {player.turnovers || 0}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">
                              {fgPct}%
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">
                              {threePtPct}%
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">
                              {ftPct}%
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color={player.plus_minus && player.plus_minus > 0 ? 'success.main' : player.plus_minus && player.plus_minus < 0 ? 'error.main' : 'text.secondary'}>
                              {player.plus_minus || 0}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">No player statistics available.</Typography>
            )}
          </Paper>

          {/* Complete Team Statistics Table */}
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Complete Team Statistics
            </Typography>
            
            {teamStats.length > 0 ? (
              <TableContainer>
                <Table size="small" sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <SortableHeader 
                        field="wins" 
                        onSort={handleTeamSort} 
                        sortField={teamSortField} 
                        sortDirection={teamSortDirection}
                      >
                        Wins
                      </SortableHeader>
                      <SortableHeader 
                        field="losses" 
                        onSort={handleTeamSort} 
                        sortField={teamSortField} 
                        sortDirection={teamSortDirection}
                      >
                        Losses
                      </SortableHeader>
                      <SortableHeader 
                        field="win_percentage" 
                        onSort={handleTeamSort} 
                        sortField={teamSortField} 
                        sortDirection={teamSortDirection}
                      >
                        Win %
                      </SortableHeader>
                      <SortableHeader 
                        field="points_for" 
                        onSort={handleTeamSort} 
                        sortField={teamSortField} 
                        sortDirection={teamSortDirection}
                      >
                        Points For
                      </SortableHeader>
                      <SortableHeader 
                        field="points_against" 
                        onSort={handleTeamSort} 
                        sortField={teamSortField} 
                        sortDirection={teamSortDirection}
                      >
                        Points Against
                      </SortableHeader>
                      <SortableHeader 
                        field="point_differential" 
                        onSort={handleTeamSort} 
                        sortField={teamSortField} 
                        sortDirection={teamSortDirection}
                      >
                        Point Diff
                      </SortableHeader>
                      <SortableHeader 
                        field="current_rp" 
                        onSort={handleTeamSort} 
                        sortField={teamSortField} 
                        sortDirection={teamSortDirection}
                      >
                        Current RP
                      </SortableHeader>
                      <SortableHeader 
                        field="hybrid_score" 
                        onSort={handleTeamSort} 
                        sortField={teamSortField} 
                        sortDirection={teamSortDirection}
                      >
                        Hybrid Score
                      </SortableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedTeamStats.map((team, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={team.logo_url} sx={{ width: 24, height: 24 }}>
                              {team.team_name?.slice(0, 2).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                              {team.team_name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            {team.wins || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="error.main">
                            {team.losses || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {team.win_percentage ? (team.win_percentage > 1 ? team.win_percentage.toFixed(1) + '%' : (team.win_percentage * 100).toFixed(1) + '%') : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {team.points_for || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {team.points_against || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color={team.point_differential && team.point_differential > 0 ? 'success.main' : team.point_differential && team.point_differential < 0 ? 'error.main' : 'text.secondary'}>
                            {team.point_differential || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {team.current_rp || 0}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="primary.main">
                            {team.teams?.hybrid_score ? Math.round(team.teams.hybrid_score) : '—'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary">No team statistics available.</Typography>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}
