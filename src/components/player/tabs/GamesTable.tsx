
import { createClientBrowser } from '@/lib/supabaseClient';
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RowClient from './GamesTableRowClient';


export default async function GamesTable({ playerId }: { playerId: string }) {
  
  const supabase = createClientBrowser();
  
  // Get player's current team
  const { data: player } = await supabase
    .from('players')
    .select('current_team_id')
    .eq('id', playerId)
    .maybeSingle();

  if (!(player as any)?.current_team_id) {
    return (
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography color="text.secondary">Player not on a team - no games to display.</Typography>
      </Paper>
    );
  }

  // Get recent matches for the player's team
  const { data: matches } = await supabase
    .from('matches')
    .select(`
      id,
      played_at,
      team_a_id,
      team_b_id,
      score_a,
      score_b,
      team_a:team_a_id(name),
      team_b:team_b_id(name)
    `)
    .or(`team_a_id.eq.${(player as any).current_team_id},team_b_id.eq.${(player as any).current_team_id}`)
    .order('played_at', { ascending: false })
    .limit(20);

  // Get player stats for these matches
  const matchIds = matches?.map((m: any) => m.id) || [];
  const { data: playerStats } = matchIds.length > 0 ? await supabase
    .from('player_stats')
    .select('*')
    .in('match_id', matchIds)
    .eq('player_id', playerId) : { data: [] };

  const statsMap = new Map((playerStats || []).map((s: any) => [s.match_id, s]));
  
  // Combine data
  const data = (matches || []).map((match: any) => {
    const stats = statsMap.get(match.id) || {};
    const isTeamA = match.team_a_id === (player as any).current_team_id;
    const opponent = isTeamA ? match.team_b : match.team_a;
    const teamScore = isTeamA ? match.score_a : match.score_b;
    const opponentScore = isTeamA ? match.score_b : match.score_a;
    
    return {
      match_id: match.id,
      played_at: match.played_at,
      opponent_team_name: opponent?.name,
      pts: (stats as any).points || 0,
      ast: (stats as any).assists || 0,
      reb: (stats as any).rebounds || 0,
      stl: (stats as any).steals || 0,
      blk: (stats as any).blocks || 0,
      result: teamScore > opponentScore ? 'W' : 'L'
    };
  }).filter((game: any) => statsMap.has(game.match_id)); // Only show games where player actually played

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography color="text.secondary">No games logged yet this season.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Date</TableCell>
              <TableCell>Opponent</TableCell>
              <TableCell align="right">PTS</TableCell>
              <TableCell align="right">REB</TableCell>
              <TableCell align="right">AST</TableCell>
              <TableCell align="center">Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any, i: number) => (<RowClient row={row} key={i} />))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}


