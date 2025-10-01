"use client";
import { useState } from 'react';
import { Box, Paper, Tab, Tabs as MuiTabs, Typography, Table, TableBody, TableCell, TableHead, TableRow, Avatar, Chip } from '@mui/material';

import LeagueInformation from './LeagueInformation';
import LeagueMatches from './LeagueMatches';
import LeagueStatistics from './LeagueStatistics';

type LeagueTabsProps = {
  leagueId: string;
  teams: any[];
  standings: any[];
  league?: any;
  recentMatches?: any[];
  upcomingMatches?: any[];
  seasonMatches?: any[];
  topScorers?: any[];
  topAssists?: any[];
  topRebounders?: any[];
  topSteals?: any[];
  topBlocks?: any[];
  topThreePoint?: any[];
  teamStats?: any[];
  teamMatchStats?: any[];
  allPlayerStats?: any[];
};

export default function LeagueTabs({ 
  leagueId, 
  teams, 
  standings, 
  league,
  recentMatches = [],
  upcomingMatches = [],
  seasonMatches = [],
  topScorers = [],
  topAssists = [],
  topRebounders = [],
  topSteals = [],
  topBlocks = [],
  topThreePoint = [],
  teamStats = [],
  teamMatchStats = [],
  allPlayerStats = []
}: LeagueTabsProps) {
  const [value, setValue] = useState(0);

  const rows = standings || teams || [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
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
          <Tab label="Standings" />
          <Tab label="Teams" />
          <Tab label="Information" />
          <Tab label="Matches" />
          <Tab label="Top Performers" />
          <Tab label="Season Statistics" />
        </MuiTabs>

        {value === 0 && (
          <Box>
            {(!rows || rows.length === 0) ? (
              <Typography color="text.secondary">No standings available.</Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Wins</TableCell>
                      <TableCell align="right">Losses</TableCell>
                      <TableCell align="right">Win %</TableCell>
                      <TableCell align="right">ELO</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((t: any, i: number) => (
                      <TableRow key={t.team_id || i}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {i + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={t.logo_url || undefined} sx={{ width: 24, height: 24 }}>{t.team_name?.slice(0,2).toUpperCase()}</Avatar>
                            <Typography fontWeight={600}>{t.team_name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{t.wins ?? '—'}</TableCell>
                        <TableCell align="right">{t.losses ?? '—'}</TableCell>
                        <TableCell align="right">{t.win_percentage != null ? (t.win_percentage > 1 ? t.win_percentage.toFixed(1) + '%' : (t.win_percentage * 100).toFixed(1) + '%') : '—'}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {t.elo_rating ? Math.round(t.elo_rating) : '—'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Box>
        )}

        {value === 1 && (
          <Box>
            {(!teams || teams.length === 0) ? (
              <Typography color="text.secondary">No teams available.</Typography>
            ) : (
              <Box sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <TableCell align="right">Global Rank</TableCell>
                      <TableCell align="right">ELO</TableCell>
                      <TableCell align="right">Hybrid Score</TableCell>
                      <TableCell align="right">Tier</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(teams as any[]).map((t: any, i: number) => (
                      <TableRow key={t.team_id || i}>
                        <TableCell>
                          <a href={`/team/${t.team_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar src={t.logo_url || undefined} sx={{ width: 24, height: 24 }}>
                                {t.team_name?.slice(0,2).toUpperCase()}
                              </Avatar>
                              <Typography fontWeight={600}>{t.team_name}</Typography>
                            </Box>
                          </a>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            {t.teams?.global_rank ? `#${t.teams.global_rank}` : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {t.elo_rating ? Math.round(t.elo_rating) : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {t.teams?.hybrid_score ? Math.round(t.teams.hybrid_score) : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            size="small" 
                            label={t.teams?.leaderboard_tier || '—'} 
                            color={t.teams?.leaderboard_tier === 'S' ? 'error' : 
                                   t.teams?.leaderboard_tier === 'A' ? 'warning' : 
                                   t.teams?.leaderboard_tier === 'B' ? 'success' : 
                                   t.teams?.leaderboard_tier === 'C' ? 'info' : 'default'}
                            sx={{ 
                              fontWeight: 600,
                              minWidth: 32
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Box>
        )}

        {value === 2 && (
          <LeagueInformation league={league} />
        )}

        {value === 3 && (
          <LeagueMatches 
            recentMatches={recentMatches} 
            upcomingMatches={upcomingMatches}
            seasonMatches={seasonMatches}
          />
        )}

        {value === 4 && (
          <LeagueStatistics 
            topScorers={topScorers}
            topAssists={topAssists}
            topRebounders={topRebounders}
            topSteals={topSteals}
            topBlocks={topBlocks}
            topThreePoint={topThreePoint}
            teamStats={teamStats}
            teamMatchStats={teamMatchStats}
            showTopPerformers={true}
            allPlayerStats={allPlayerStats}
          />
        )}

        {value === 5 && (
          <LeagueStatistics 
            topScorers={topScorers}
            topAssists={topAssists}
            topRebounders={topRebounders}
            teamStats={teamStats}
            teamMatchStats={teamMatchStats}
            showCompleteStats={true}
            allPlayerStats={allPlayerStats}
          />
        )}
      </Paper>
    </Box>
  );
}
