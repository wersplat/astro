import { Box, Paper, Typography, Grid, Avatar, Chip, Table, TableBody, TableCell, TableHead, TableRow, Pagination, Dialog, DialogContent, DialogTitle, IconButton, Button, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import { Close as CloseIcon, Visibility as VisibilityIcon, SportsBasketball as BasketballIcon, Group as GroupIcon } from '@mui/icons-material';
import React, { useState, useEffect } from 'react';


type Match = {
  id: string;
  team_a_name: string | { name: string };
  team_b_name: string | { name: string };
  team_a_score?: number;
  score_a?: number;
  team_b_score?: number;
  score_b?: number;
  played_at: string;
  stage?: string;
  team_a_logo?: string | { logo_url: string | null };
  team_b_logo?: string | { logo_url: string | null };
  boxscore_url?: string;
  season_id?: string;
  match_type?: string;
};

type SeasonMatch = {
  id: string;
  team_a_name: string | { name: string };
  team_b_name: string | { name: string };
  team_a_score?: number;
  score_a?: number;
  team_b_score?: number;
  score_b?: number;
  played_at: string;
  stage?: string;
  team_a_logo?: string | { logo_url: string | null };
  team_b_logo?: string | { logo_url: string | null };
  boxscore_url?: string;
  season_id?: string;
  match_type?: string;
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

type LeagueMatchesProps = {
  recentMatches: Match[];
  upcomingMatches: Match[];
  seasonMatches?: SeasonMatch[];
};

export default function LeagueMatches({ recentMatches, upcomingMatches, seasonMatches = [] }: LeagueMatchesProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming' | 'season'>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 25;
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
  
  
  
  // Get 5 most recent completed season matches for Recent Matches tab
  // Use seasonMatches if available, otherwise fall back to recentMatches prop
  const recentSeasonMatches = seasonMatches.length > 0 
    ? seasonMatches
        .filter(match => {
          const scoreA = match.team_a_score ?? match.score_a;
          const scoreB = match.team_b_score ?? match.score_b;
          return scoreA !== null && scoreB !== null;
        })
        .slice(0, 5)
    : recentMatches || [];
  
  // Pagination logic for Season Results
  const totalPages = Math.ceil(seasonMatches.length / matchesPerPage);
  const paginatedSeasonMatches = seasonMatches.slice(
    (currentPage - 1) * matchesPerPage,
    currentPage * matchesPerPage
  );
  
  // Reset pagination when switching tabs
  useEffect(() => {
    if (activeTab !== 'season') {
      setCurrentPage(1);
    }
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const fetchMatchStats = async (matchId: string) => {
    setLoadingStats(true);
    setStatsError(null);
    
    try {
      // Fetch player stats
      const playerStatsResponse = await fetch(`/api/player-stats?match_id=${matchId}`);
      if (playerStatsResponse.ok) {
        const playerData = await playerStatsResponse.json();
        setPlayerStats(playerData.playerStats || []);
      }
      
      // Fetch team stats
      const teamStatsResponse = await fetch(`/api/team-stats?match_id=${matchId}`);
      if (teamStatsResponse.ok) {
        const teamData = await teamStatsResponse.json();
        setTeamStats(teamData.teamStats || []);
      }
    } catch (error) {
      console.error('Error fetching match stats:', error);
      setStatsError('Failed to load match statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleBoxscoreClick = (match: Match | SeasonMatch) => {
    if (match.boxscore_url) {
      const teamAName = typeof match.team_a_name === 'string' ? match.team_a_name : match.team_a_name?.name || 'Unknown';
      const teamBName = typeof match.team_b_name === 'string' ? match.team_b_name : match.team_b_name?.name || 'Unknown';
      const scoreA = match.team_a_score ?? match.score_a ?? 0;
      const scoreB = match.team_b_score ?? match.score_b ?? 0;
      
      setBoxscoreModal({
        open: true,
        imageUrl: match.boxscore_url,
        matchInfo: `${teamAName} vs ${teamBName} (${scoreA}-${scoreB})`,
        matchId: match.id
      });
      
      // Reset stats tab and fetch stats
      setStatsTab('screenshot');
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

  const MatchCard = ({ match, isUpcoming = false }: { match: Match; isUpcoming?: boolean }) => {
    const scoreA = match.team_a_score ?? match.score_a ?? 0;
    const scoreB = match.team_b_score ?? match.score_b ?? 0;
    
    // Handle nested object structure for team names and logos
    const teamAName = typeof match.team_a_name === 'string' ? match.team_a_name : match.team_a_name?.name || 'Unknown';
    const teamBName = typeof match.team_b_name === 'string' ? match.team_b_name : match.team_b_name?.name || 'Unknown';
    const teamALogo = typeof match.team_a_logo === 'string' ? match.team_a_logo : match.team_a_logo?.logo_url || undefined;
    const teamBLogo = typeof match.team_b_logo === 'string' ? match.team_b_logo : match.team_b_logo?.logo_url || undefined;
    
    return (
      <Box sx={{ 
        p: 2, 
        bgcolor: 'background.paper', 
        borderRadius: 1, 
        border: '1px solid',
        borderColor: 'divider',
        cursor: match.boxscore_url ? 'pointer' : 'default',
        '&:hover': { 
          bgcolor: match.boxscore_url ? 'action.hover' : 'background.paper',
          transform: match.boxscore_url ? 'translateY(-1px)' : 'none',
          boxShadow: match.boxscore_url ? 2 : 'none'
        },
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={() => match.boxscore_url && handleBoxscoreClick(match)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Avatar src={teamALogo} sx={{ width: 20, height: 20 }}>
                  {teamAName?.slice(0, 2).toUpperCase()}
                </Avatar>
                <Typography variant="body2" fontWeight={600}>
                  {teamAName}
                </Typography>
              </Box>
              <Typography variant="h6" color={!isUpcoming && scoreA > scoreB ? 'primary.main' : 'text.primary'}>
                {isUpcoming ? '—' : scoreA}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              vs
            </Typography>
            
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Avatar src={teamBLogo} sx={{ width: 20, height: 20 }}>
                  {teamBName?.slice(0, 2).toUpperCase()}
                </Avatar>
                <Typography variant="body2" fontWeight={600}>
                  {teamBName}
                </Typography>
              </Box>
              <Typography variant="h6" color={!isUpcoming && scoreB > scoreA ? 'primary.main' : 'text.primary'}>
                {isUpcoming ? '—' : scoreB}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {formatDate(match.played_at)}
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
            {match.stage && (
              <Typography variant="caption" color="text.secondary">
                {match.stage}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
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
                      {/* Note: Team logos for player stats would require additional API calls to get team info for each team_id */}
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

  const SeasonMatchesTable = ({ matches }: { matches: SeasonMatch[] }) => (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Stage</TableCell>
            <TableCell>Teams</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {matches.map((match) => {
          // Handle nested object structure for team names and logos
          const teamAName = typeof match.team_a_name === 'string' ? match.team_a_name : match.team_a_name?.name || 'Unknown';
          const teamBName = typeof match.team_b_name === 'string' ? match.team_b_name : match.team_b_name?.name || 'Unknown';
          const teamALogo = typeof match.team_a_logo === 'string' ? match.team_a_logo : match.team_a_logo?.logo_url || undefined;
          const teamBLogo = typeof match.team_b_logo === 'string' ? match.team_b_logo : match.team_b_logo?.logo_url || undefined;
          
          return (
            <TableRow 
              key={match.id}
              sx={{ 
                cursor: match.boxscore_url ? 'pointer' : 'default',
                '&:hover': { 
                  bgcolor: match.boxscore_url ? 'action.hover' : 'transparent'
                }
              }}
              onClick={() => match.boxscore_url && handleBoxscoreClick(match)}
            >
              <TableCell>
                <Typography variant="body2">
                  {formatDate(match.played_at)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {match.stage || '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={teamALogo} sx={{ width: 20, height: 20 }}>
                    {teamAName?.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2" fontWeight={600}>
                    {teamAName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
                    vs
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {teamBName}
                  </Typography>
                  <Avatar src={teamBLogo} sx={{ width: 20, height: 20 }}>
                    {teamBName?.slice(0, 2).toUpperCase()}
                  </Avatar>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {(match.team_a_score ?? match.score_a)} - {(match.team_b_score ?? match.score_b)}
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
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
    </Box>
  );

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 3,
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none'
      }}>
        <Chip
          label="Recent Matches"
          color={activeTab === 'recent' ? 'primary' : 'default'}
          onClick={() => setActiveTab('recent')}
          clickable
          sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
        />
        <Chip
          label="Upcoming Matches"
          color={activeTab === 'upcoming' ? 'primary' : 'default'}
          onClick={() => setActiveTab('upcoming')}
          clickable
          sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
        />
        <Chip
          label="Season Results"
          color={activeTab === 'season' ? 'primary' : 'default'}
          onClick={() => setActiveTab('season')}
          clickable
          sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
        />
      </Box>

      {activeTab === 'recent' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Recent Season Results
          </Typography>
          {recentSeasonMatches.length === 0 ? (
            <Typography color="text.secondary">No recent season matches available.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentSeasonMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </Box>
          )}
        </Box>
      )}

      {activeTab === 'upcoming' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Upcoming Matches
          </Typography>
          {upcomingMatches.length === 0 ? (
            <Typography color="text.secondary">No upcoming matches scheduled.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} isUpcoming />
              ))}
            </Box>
          )}
        </Box>
      )}

      {activeTab === 'season' && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              All Season Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {seasonMatches.length} total matches
            </Typography>
          </Box>
          {seasonMatches.length === 0 ? (
            <Typography color="text.secondary">No season matches available.</Typography>
          ) : (
            <>
              <SeasonMatchesTable matches={paginatedSeasonMatches} />
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    color="primary"
                    size="small"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Showing {((currentPage - 1) * matchesPerPage) + 1}-{Math.min(currentPage * matchesPerPage, seasonMatches.length)} of {seasonMatches.length} matches
              </Typography>
            </>
          )}
        </Box>
      )}

      {/* Boxscore Modal */}
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
        
        <DialogContent sx={{ 
          p: 0, 
          flex: 1,
          overflow: 'hidden'
        }}>
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
                    maxHeight: '70vh',
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
              ) : playerStats.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No player statistics available for this match.
                </Typography>
              ) : (
                <PlayerStatsTable stats={playerStats} />
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
              ) : teamStats.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No team statistics available for this match.
                </Typography>
              ) : (
                <TeamStatsTable stats={teamStats} />
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
