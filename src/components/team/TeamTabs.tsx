"use client";
import React, { useState, useEffect } from 'react';
import { Box, Paper, Tab, Tabs as MuiTabs, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog, DialogContent, DialogTitle, IconButton, Button, Tabs, Tab as MuiTab, CircularProgress, Alert, Avatar } from '@mui/material';
import { Close as CloseIcon, Visibility as VisibilityIcon, SportsBasketball as BasketballIcon, Group as GroupIcon } from '@mui/icons-material';

import TeamStatistics from './TeamStatistics';

type Player = {
  player_id: string;
  position: string | null;
  joined_at: string | null;
  is_captain?: boolean | null;
  is_player_coach?: boolean | null;
  player: {
    id: string;
    gamertag: string | null;
    position: string | null;
    player_rp: number | null;
    performance_score: number | null;
  } | null;
};

type RecentMatch = {
  id: string;
  played_at: string | null;
  team_a_id: string;
  team_b_id: string;
  score_a: number | null;
  score_b: number | null;
  boxscore_url?: string | null;
  team_a: { name: string | null } | null;
  team_b: { name: string | null } | null;
};

type PlayerStat = {
  id: string;
  player_id: string;
  player_name: string;
  team_id: string;
  position?: string;
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fgm: number;
  fga: number;
  ftm: number;
  fta: number;
  three_points_made: number;
  three_points_attempted: number;
  plus_minus: number;
  ps: number;
};

type TeamStat = {
  id: string;
  team_id: string;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  fouls: number;
  turnovers: number;
  field_goals_made: number;
  field_goals_attempted: number;
  free_throws_made: number;
  free_throws_attempted: number;
  three_points_made: number;
  three_points_attempted: number;
  plus_minus: number;
  teams?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
};

type TeamHistoryEntry = {
  gamertag: string | null;
  position: string | null;
  joined_at: string | null;
  left_at: string | null;
  season_number: number | null;
  league_name: string | null;
  team_logo: string | null;
  team_name: string | null;
  is_captain: boolean | null;
  is_player_coach: boolean | null;
};

type Championship = {
  id: string;
  team_name: string | null;
  year: string | null;
  league_name: string | null;
  season: number | null;
  is_tournament: boolean;
  tournament_date: string | null;
  event_tier: string | null;
  champion_logo: string | null;
  created_at: string;
};

type YearStats = {
  game_year: string | null;
  team_name: string | null;
  total_matches: number | null;
  matches_won: number | null;
  matches_lost: number | null;
  win_percentage: number | null;
  avg_points_scored: number | null;
  avg_points_allowed: number | null;
  best_placement: number | null;
  current_ranking_points: number | null;
  total_prize_amount: number | null;
};

export default function TeamTabs({ 
  teamId, 
  players, 
  recentMatches,
  allMatches,
  teamHistory,
  championships,
  yearStats,
  teamPerformance
}: { 
  teamId: string; 
  players: Player[]; 
  recentMatches: RecentMatch[];
  allMatches: RecentMatch[];
  teamHistory: TeamHistoryEntry[];
  championships: Championship[];
  yearStats: YearStats[];
  teamPerformance: any;
}) {
  const [value, setValue] = useState(0);
  const [boxscoreModal, setBoxscoreModal] = useState<{ 
    open: boolean; 
    imageUrl: string | null; 
    matchInfo: string;
    matchId: string | null;
  }>({
    open: false,
    imageUrl: null,
    matchInfo: '',
    matchId: null
  });
  const [statsTab, setStatsTab] = useState<'screenshot' | 'player-stats' | 'team-stats'>('screenshot');
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const fetchMatchStats = async (matchId: string) => {
    setLoadingStats(true);
    setStatsError(null);
    
    try {
      // Fetch player stats
      const playerStatsResponse = await fetch(`/api/player-stats?match_id=${matchId}`);
      if (!playerStatsResponse.ok) {
        throw new Error('Failed to fetch player stats');
      }
      const playerStatsData = await playerStatsResponse.json();
      
      // Fetch team stats
      const teamStatsResponse = await fetch(`/api/team-stats?match_id=${matchId}`);
      if (!teamStatsResponse.ok) {
        throw new Error('Failed to fetch team stats');
      }
      const teamStatsData = await teamStatsResponse.json();
      
      setPlayerStats(playerStatsData.playerStats || []);
      setTeamStats(teamStatsData.teamStats || []);
    } catch (error) {
      console.error('Error fetching match stats:', error);
      setStatsError('Failed to load match statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleBoxscoreClick = (match: RecentMatch) => {
    if (match.boxscore_url) {
      const isTeamA = match.team_a_id === teamId;
      const opponent = isTeamA ? match.team_b : match.team_a;
      const teamScore = isTeamA ? match.score_a : match.score_b;
      const opponentScore = isTeamA ? match.score_b : match.score_a;
      
      setBoxscoreModal({
        open: true,
        imageUrl: match.boxscore_url,
        matchInfo: `vs ${opponent?.name || 'Unknown Team'} (${teamScore || 0}-${opponentScore || 0})`,
        matchId: match.id
      });
      
      // Fetch stats for this match
      fetchMatchStats(match.id);
    }
  };

  const handleCloseBoxscore = () => {
    setBoxscoreModal({
      open: false,
      imageUrl: null,
      matchInfo: '',
      matchId: null
    });
    setPlayerStats([]);
    setTeamStats([]);
    setStatsError(null);
  };

  const PlayerStatsTable = ({ stats }: { stats: PlayerStat[] }) => {
    // Sort stats by team and position
    const sortedStats = [...stats].sort((a, b) => {
      // First sort by team_id
      if (a.team_id !== b.team_id) {
        return a.team_id.localeCompare(b.team_id);
      }
      
      // Then sort by position within each team
      const positionOrder = ['Point Guard', 'Shooting Guard', 'Lock', 'Power Forward', 'Center'];
      const aPosition = a.position || (a as any).players?.position || '';
      const bPosition = b.position || (b as any).players?.position || '';
      const aPositionIndex = positionOrder.indexOf(aPosition);
      const bPositionIndex = positionOrder.indexOf(bPosition);
      
      // If position not found, put at end
      if (aPositionIndex === -1 && bPositionIndex === -1) return 0;
      if (aPositionIndex === -1) return 1;
      if (bPositionIndex === -1) return -1;
      
      return aPositionIndex - bPositionIndex;
    });

    // Group stats by team for display
    const teamGroups = sortedStats.reduce((groups, stat) => {
      const teamId = stat.team_id;
      if (!groups[teamId]) {
        groups[teamId] = [];
      }
      groups[teamId].push(stat);
      return groups;
    }, {} as Record<string, PlayerStat[]>);

    const teamIds = Object.keys(teamGroups);

    return (
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell align="center">PTS</TableCell>
              <TableCell align="center">REB</TableCell>
              <TableCell align="center">AST</TableCell>
              <TableCell align="center">STL</TableCell>
              <TableCell align="center">BLK</TableCell>
              <TableCell align="center">TO</TableCell>
              <TableCell align="center">PF</TableCell>
              <TableCell align="center">FG%</TableCell>
              <TableCell align="center">3P%</TableCell>
              <TableCell align="center">FT%</TableCell>
              <TableCell align="center">+/-</TableCell>
              <TableCell align="center">PS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teamIds.map((teamId, teamIndex) => (
              <React.Fragment key={teamId}>
                {/* Team Header */}
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell colSpan={13}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Team {teamIndex === 0 ? 'A' : 'B'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                
                {/* Team Players */}
                {teamGroups[teamId].map((stat) => {
                  const fgPercentage = stat.fga > 0 ? ((stat.fgm / stat.fga) * 100).toFixed(1) : '0.0';
                  const threePointPercentage = stat.three_points_attempted > 0 ? ((stat.three_points_made / stat.three_points_attempted) * 100).toFixed(1) : '0.0';
                  const ftPercentage = stat.fta > 0 ? ((stat.ftm / stat.fta) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <TableRow key={stat.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={600}>
                            {stat.player_name || `Player ${stat.player_id}`}
                          </Typography>
                          {(stat.position || (stat as any).players?.position) && (
                            <Typography variant="caption" color="text.secondary">
                              ({stat.position || (stat as any).players?.position})
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">{stat.points}</TableCell>
                      <TableCell align="center">{stat.rebounds}</TableCell>
                      <TableCell align="center">{stat.assists}</TableCell>
                      <TableCell align="center">{stat.steals}</TableCell>
                      <TableCell align="center">{stat.blocks}</TableCell>
                      <TableCell align="center">{stat.turnovers}</TableCell>
                      <TableCell align="center">{stat.fouls}</TableCell>
                      <TableCell align="center">{fgPercentage}%</TableCell>
                      <TableCell align="center">{threePointPercentage}%</TableCell>
                      <TableCell align="center">{ftPercentage}%</TableCell>
                      <TableCell align="center">{stat.plus_minus}</TableCell>
                      <TableCell align="center">{stat.ps.toFixed(1)}</TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Box>
    );
  };

  const TeamStatsTable = ({ stats }: { stats: TeamStat[] }) => (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Team</TableCell>
            <TableCell align="center">PTS</TableCell>
            <TableCell align="center">REB</TableCell>
            <TableCell align="center">AST</TableCell>
            <TableCell align="center">STL</TableCell>
            <TableCell align="center">BLK</TableCell>
            <TableCell align="center">TO</TableCell>
            <TableCell align="center">PF</TableCell>
            <TableCell align="center">FG%</TableCell>
            <TableCell align="center">3P%</TableCell>
            <TableCell align="center">FT%</TableCell>
            <TableCell align="center">+/-</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stats.map((stat) => {
            const fgPercentage = stat.field_goals_attempted > 0 ? ((stat.field_goals_made / stat.field_goals_attempted) * 100).toFixed(1) : '0.0';
            const threePointPercentage = stat.three_points_attempted > 0 ? ((stat.three_points_made / stat.three_points_attempted) * 100).toFixed(1) : '0.0';
            const ftPercentage = stat.free_throws_attempted > 0 ? ((stat.free_throws_made / stat.free_throws_attempted) * 100).toFixed(1) : '0.0';
            const teamName = stat.teams?.name || `Team ${stat.team_id}`;
            const teamLogo = stat.teams?.logo_url;
            
            return (
              <TableRow key={stat.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {teamLogo && (
                      <Avatar
                        src={teamLogo}
                        alt={teamName}
                        sx={{ width: 24, height: 24 }}
                      />
                    )}
                    <Typography variant="body2" fontWeight={600}>
                      {teamName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{stat.points}</TableCell>
                <TableCell align="center">{stat.rebounds}</TableCell>
                <TableCell align="center">{stat.assists}</TableCell>
                <TableCell align="center">{stat.steals}</TableCell>
                <TableCell align="center">{stat.blocks}</TableCell>
                <TableCell align="center">{stat.turnovers}</TableCell>
                <TableCell align="center">{stat.fouls}</TableCell>
                <TableCell align="center">{fgPercentage}%</TableCell>
                <TableCell align="center">{threePointPercentage}%</TableCell>
                <TableCell align="center">{ftPercentage}%</TableCell>
                <TableCell align="center">{stat.plus_minus}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <MuiTabs 
        value={value} 
        onChange={(_, v) => setValue(v)} 
        variant="scrollable" 
        scrollButtons="auto" 
        sx={{ 
          mb: 2,
          '& .MuiTab-root': {
            minWidth: 'auto',
            px: 2,
            fontSize: '0.875rem'
          }
        }}
      >
        <Tab label="Roster" />
        <Tab label="Recent Matches" />
        <Tab label="All Matches" />
        <Tab label="Past Players" />
        <Tab label="Team History" />
        <Tab label="Statistics" />
      </MuiTabs>

      <Box sx={{ display: 'grid', gap: 3 }}>
        {/* Roster */}
        {value === 0 && (
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Current Roster ({players.length})
          </Typography>
          {players.length === 0 ? (
            <Typography color="text.secondary">No players found.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {players.map((player) => (
                <Paper key={player.player_id} elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Link 
                        href={`/player/${player.player?.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Typography 
                          fontWeight={600}
                          sx={{ '&:hover': { color: 'primary.main' } }}
                        >
                          {player.player?.gamertag || 'Unknown Player'}
                          {player.is_captain && ' (C)'}
                          {player.is_player_coach && ' (PC)'}
                        </Typography>
                      </a>
                      <Typography variant="body2" color="text.secondary">
                        {player.player?.position || player.position || 'No position'}
                      </Typography>
                      {player.joined_at && (
                        <Typography variant="caption" color="text.secondary">
                          Joined: {new Date(player.joined_at).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                    <Box textAlign="right">
                      {player.player?.player_rp !== null && player.player?.player_rp !== undefined ? (
                        <Typography variant="body2" fontWeight={600}>
                          {Math.round(player.player.player_rp)} RP
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No RP data
                        </Typography>
                      )}
                      {player.player?.performance_score !== null && player.player?.performance_score !== undefined ? (
                        <Typography variant="caption" color="text.secondary">
                          {Math.round(player.player.performance_score)} OVR
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No OVR data
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
        )}

        {/* Recent Matches */}
        {value === 1 && (
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Recent Matches
          </Typography>
          {recentMatches.length === 0 ? (
            <Typography color="text.secondary">No recent matches.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {recentMatches.slice(0, 5).map((match) => {
                const isTeamA = match.team_a_id === teamId;
                const opponent = isTeamA ? match.team_b : match.team_a;
                const teamScore = isTeamA ? match.score_a : match.score_b;
                const opponentScore = isTeamA ? match.score_b : match.score_a;
                const result = (teamScore || 0) > (opponentScore || 0) ? 'W' : 'L';
                
                return (
                  <Paper 
                    key={match.id} 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 1,
                      cursor: match.boxscore_url ? 'pointer' : 'default',
                      '&:hover': { 
                        bgcolor: match.boxscore_url ? 'action.hover' : 'background.paper',
                        transform: match.boxscore_url ? 'translateY(-1px)' : 'none',
                        boxShadow: match.boxscore_url ? 2 : 1
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => match.boxscore_url && handleBoxscoreClick(match)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          vs {opponent?.name || 'Unknown Team'}
                        </Typography>
                        {match.played_at && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(match.played_at).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight={700}
                          sx={{ color: result === 'W' ? 'success.main' : 'error.main' }}
                        >
                          {result} {teamScore || 0}-{opponentScore || 0}
                        </Typography>
                        {match.boxscore_url && (
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBoxscoreClick(match);
                            }}
                            sx={{ 
                              minWidth: 'auto',
                              px: 1,
                              py: 0.5,
                              fontSize: '0.75rem'
                            }}
                          >
                            Boxscore
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Box>
        )}

        {/* All Matches */}
        {value === 2 && (
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            All Matches ({allMatches.length})
          </Typography>
          {allMatches.length === 0 ? (
            <Typography color="text.secondary">No matches found.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {allMatches.map((match) => {
                const isTeamA = match.team_a_id === teamId;
                const opponent = isTeamA ? match.team_b : match.team_a;
                const teamScore = isTeamA ? match.score_a : match.score_b;
                const opponentScore = isTeamA ? match.score_b : match.score_a;
                const result = (teamScore || 0) > (opponentScore || 0) ? 'W' : 'L';
                
                return (
                  <Paper 
                    key={match.id} 
                    elevation={1} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 1,
                      cursor: match.boxscore_url ? 'pointer' : 'default',
                      '&:hover': { 
                        bgcolor: match.boxscore_url ? 'action.hover' : 'background.paper',
                        transform: match.boxscore_url ? 'translateY(-1px)' : 'none',
                        boxShadow: match.boxscore_url ? 2 : 1
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => match.boxscore_url && handleBoxscoreClick(match)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          vs {opponent?.name || 'Unknown Team'}
                        </Typography>
                        {match.played_at && (
                          <Typography variant="caption" color="text.secondary">
                            {new Date(match.played_at).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight={700}
                          sx={{ color: result === 'W' ? 'success.main' : 'error.main' }}
                        >
                          {result} {teamScore || 0}-{opponentScore || 0}
                        </Typography>
                        {match.boxscore_url && (
                          <Button
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBoxscoreClick(match);
                            }}
                            sx={{ 
                              minWidth: 'auto',
                              px: 1,
                              py: 0.5,
                              fontSize: '0.75rem'
                            }}
                          >
                            Boxscore
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Box>
        )}

        {/* Past Players */}
        {value === 3 && (
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Past Players
          </Typography>
          {teamHistory.length === 0 ? (
            <Typography color="text.secondary">No team history available.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {teamHistory.map((entry, i) => (
                <Paper key={i} elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {entry.gamertag || 'Unknown Player'}
                        {entry.is_captain && ' (Captain)'}
                        {entry.is_player_coach && ' (Player-Coach)'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {entry.position || 'No position'} • {entry.league_name || 'No league'}
                        {entry.season_number && ` • Season ${entry.season_number}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {entry.joined_at ? new Date(entry.joined_at).toLocaleDateString() : 'Unknown'} - {entry.left_at ? new Date(entry.left_at).toLocaleDateString() : 'Present'}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="caption" color="text.secondary">
                        {entry.left_at ? 'Former Player' : 'Current Player'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
        )}

        {/* Team History */}
        {value === 4 && (
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Team History
          </Typography>
          
          <Grid container spacing={3}>
            {/* Championships */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Championships ({championships.length})
                </Typography>
                {championships.length === 0 ? (
                  <Typography color="text.secondary">No championships yet.</Typography>
                ) : (
                  <Box sx={{ display: 'grid', gap: 2 }}>
                    {championships.map((champ, i) => (
                      <Paper key={i} elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {champ.league_name || 'Unknown League'}
                              {champ.season && ` Season ${champ.season}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {champ.year || 'Unknown Year'}
                              {champ.tournament_date && ` • ${new Date(champ.tournament_date).toLocaleDateString()}`}
                            </Typography>
                            {champ.event_tier && (
                              <Chip 
                                label={champ.event_tier} 
                                size="small" 
                                sx={{ mt: 1 }}
                                color={champ.event_tier.toLowerCase().includes('pro') ? 'primary' : 'default'}
                              />
                            )}
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="caption" color="text.secondary">
                              {champ.is_tournament ? 'Tournament' : 'League'} Champion
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Year-by-Year Stats */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Year-by-Year Performance
                </Typography>
                {yearStats.length === 0 ? (
                  <Typography color="text.secondary">No performance data available.</Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Year</TableCell>
                          <TableCell align="right">W-L</TableCell>
                          <TableCell align="right">Win%</TableCell>
                          <TableCell align="right">PPG</TableCell>
                          <TableCell align="right">PAPG</TableCell>
                          <TableCell align="right">RP</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {yearStats.map((stat, i) => (
                          <TableRow key={i}>
                            <TableCell component="th" scope="row">
                              {stat.game_year || 'N/A'}
                            </TableCell>
                            <TableCell align="right">
                              {stat.matches_won || 0}-{stat.matches_lost || 0}
                            </TableCell>
                            <TableCell align="right">
                              {(() => {
                                const wins = stat.matches_won || 0;
                                const losses = stat.matches_lost || 0;
                                const totalGames = wins + losses;
                                
                                if (totalGames === 0) return '0.0%';
                                
                                // If win_percentage is provided and seems to be a decimal (0-1), use it
                                if (stat.win_percentage !== null && stat.win_percentage !== undefined) {
                                  // Check if it's already a percentage (0-100) or decimal (0-1)
                                  if (stat.win_percentage > 1) {
                                    return `${stat.win_percentage.toFixed(1)}%`;
                                  } else {
                                    return `${(stat.win_percentage * 100).toFixed(1)}%`;
                                  }
                                }
                                
                                // Fallback: calculate manually
                                return `${((wins / totalGames) * 100).toFixed(1)}%`;
                              })()}
                            </TableCell>
                            <TableCell align="right">
                              {stat.avg_points_scored ? stat.avg_points_scored.toFixed(1) : '0.0'}
                            </TableCell>
                            <TableCell align="right">
                              {stat.avg_points_allowed ? stat.avg_points_allowed.toFixed(1) : '0.0'}
                            </TableCell>
                            <TableCell align="right">
                              {stat.current_ranking_points ? Math.round(stat.current_ranking_points) : '0'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
        )}

        {/* Statistics */}
        {value === 5 && (
        <TeamStatistics 
          teamPerformance={teamPerformance}
          yearStats={yearStats}
        />
        )}
      </Box>

      {/* Enhanced Boxscore Modal */}
      <Dialog
        open={boxscoreModal.open}
        onClose={handleCloseBoxscore}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6">
            Boxscore - {boxscoreModal.matchInfo}
          </Typography>
          <IconButton
            onClick={handleCloseBoxscore}
            size="small"
            sx={{ ml: 2 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={statsTab} 
            onChange={(_, newValue) => setStatsTab(newValue)}
            sx={{ px: 2 }}
          >
            <Tab 
              icon={<VisibilityIcon />} 
              label="Screenshot" 
              value="screenshot"
              iconPosition="start"
            />
            <Tab 
              icon={<BasketballIcon />} 
              label="Player Stats" 
              value="player-stats"
              iconPosition="start"
            />
            <Tab 
              icon={<GroupIcon />} 
              label="Team Stats" 
              value="team-stats"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <DialogContent sx={{ p: 0, flex: 1, overflow: 'hidden' }}>
          {statsTab === 'screenshot' && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              bgcolor: 'grey.100',
              p: 2
            }}>
              {boxscoreModal.imageUrl && (
                <Box
                  component="img"
                  src={boxscoreModal.imageUrl}
                  alt="Boxscore"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                    borderRadius: 1
                  }}
                  onError={(e) => {
                    console.error('Failed to load boxscore image:', boxscoreModal.imageUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </Box>
          )}

          {statsTab === 'player-stats' && (
            <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
              {loadingStats ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                  <CircularProgress />
                </Box>
              ) : statsError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {statsError}
                </Alert>
              ) : playerStats.length > 0 ? (
                <PlayerStatsTable stats={playerStats} />
              ) : (
                <Typography color="text.secondary" textAlign="center">
                  No player statistics available for this match.
                </Typography>
              )}
            </Box>
          )}

          {statsTab === 'team-stats' && (
            <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
              {loadingStats ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                  <CircularProgress />
                </Box>
              ) : statsError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {statsError}
                </Alert>
              ) : teamStats.length > 0 ? (
                <TeamStatsTable stats={teamStats} />
              ) : (
                <Typography color="text.secondary" textAlign="center">
                  No team statistics available for this match.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
