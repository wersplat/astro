"use client";
import { useState } from 'react';
import { Box, Paper, Tab, Tabs as MuiTabs, Typography, Table, TableBody, TableCell, TableHead, TableRow, Avatar, Chip } from '@mui/material';

import TournamentInformation from './TournamentInformation';
import TournamentBracket from './TournamentBracket';
import TournamentMatches from './TournamentMatches';
import TournamentStatistics from './TournamentStatistics';

type TournamentTabsProps = {
  tournamentId: string;
  participants: any[];
  matches: any[];
  tournament?: any;
  recentMatches?: any[];
  upcomingMatches?: any[];
  bracketMatches?: any[];
  tournamentLeaders?: any[];
  bestPerformances?: any[];
  tournamentRecords?: any[];
};

export default function TournamentTabs({ 
  tournamentId, 
  participants, 
  matches,
  tournament,
  recentMatches = [],
  upcomingMatches = [],
  bracketMatches = [],
  tournamentLeaders = [],
  bestPerformances = [],
  tournamentRecords = []
}: TournamentTabsProps) {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <MuiTabs value={value} onChange={(_, v) => setValue(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
          <Tab label="Bracket" />
          <Tab label="Participants" />
          <Tab label="Matches" />
          <Tab label="Information" />
          <Tab label="Statistics" />
        </MuiTabs>

        {value === 0 && (
          <TournamentBracket matches={bracketMatches} />
        )}

        {value === 1 && (
          <Box>
            {(!participants || participants.length === 0) ? (
              <Typography color="text.secondary">No participants available.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Team</TableCell>
                    <TableCell align="right">Seed</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {participants.map((participant: any, i: number) => (
                    <TableRow key={participant.team_id || i}>
                      <TableCell>
                        <a href={`/team/${participant.team_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={participant.logo_url || undefined} sx={{ width: 24, height: 24 }}>
                              {participant.team_name?.slice(0,2).toUpperCase()}
                            </Avatar>
                            <Typography fontWeight={600}>{participant.team_name}</Typography>
                          </Box>
                        </a>
                      </TableCell>
                      <TableCell align="right">
                        <Chip size="small" label={`#${participant.seed || i + 1}`} />
                      </TableCell>
                      <TableCell align="right">
                        <Chip 
                          size="small" 
                          label={participant.status || 'Active'} 
                          color={participant.status === 'Eliminated' ? 'error' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        )}

        {value === 2 && (
          <TournamentMatches 
            recentMatches={recentMatches} 
            upcomingMatches={upcomingMatches} 
          />
        )}

        {value === 3 && (
          <TournamentInformation tournament={tournament} />
        )}

        {value === 4 && (
          <TournamentStatistics 
            tournamentLeaders={tournamentLeaders}
            bestPerformances={bestPerformances}
            tournamentRecords={tournamentRecords}
          />
        )}
      </Paper>
    </Box>
  );
}
