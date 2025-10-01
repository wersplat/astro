
import { createClientBrowser } from '@/lib/supabaseClient';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  Avatar
} from '@mui/material';


function getTierColor(rank: number) {
  if (rank <= 4) return '#9C27B0'; // S-tier
  if (rank <= 12) return '#2196F3'; // A-tier
  if (rank <= 30) return '#4CAF50'; // B-tier
  if (rank <= 100) return '#FF9800'; // C-tier
  return '#9E9E9E'; // Unranked
}

function getTierLabel(rank: number) {
  if (rank <= 4) return 'S';
  if (rank <= 12) return 'A';
  if (rank <= 30) return 'B';
  if (rank <= 100) return 'C';
  return 'Unranked';
}

export default async function TeamPreviewLeaderboard() {
  
  const supabase = createClientBrowser();

  // Server-safe alpha function
  const withAlpha = (hexColor: string, opacity: number) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Try to fetch top teams for 2K26
  let { data: perf, error } = await supabase
    .from('team_performance_by_game_year')
    .select('team_id, team_name, current_ranking_points, game_year')
    .eq('game_year', '2K26')
    .order('current_ranking_points', { ascending: false })
    .limit(15);

  let gameYear = '2K26';
  let isFallback = false;

  // Fallback 1: if no 2K26 data, get the most recent year available
  if (!perf || perf.length === 0) {
    const { data: fallbackPerf } = await supabase
      .from('team_performance_by_game_year')
      .select('team_id, team_name, current_ranking_points, game_year')
      .order('game_year', { ascending: false })
      .order('current_ranking_points', { ascending: false })
      .limit(15);
    
    if (fallbackPerf && fallbackPerf.length > 0) {
      perf = fallbackPerf;
      gameYear = (fallbackPerf[0] as any)?.game_year || '2K26';
      isFallback = true;
    }
  }

  // Fallback 2: if no performance data at all, get teams from teams table
  if (!perf || perf.length === 0) {
    const { data: teamsData } = await supabase
      .from('teams')
      .select('id, name, logo_url, current_rp')
      .eq('is_active', true)
      .order('current_rp', { ascending: false })
      .limit(15);
    
    if (teamsData && teamsData.length > 0) {
      perf = teamsData.map((team: any) => ({
        team_id: team.id,
        team_name: team.name,
        current_ranking_points: team.current_rp,
        game_year: 'Current'
      })) as any;
      gameYear = 'Current';
      isFallback = true;
    }
  }

  const teamIds = Array.from(new Set((perf || []).map((t: any) => t.team_id).filter(Boolean)));
  type TeamDetails = { id: string; name: string | null; logo_url: string | null };
  const { data: teamDetails } = teamIds.length > 0 ? await supabase
    .from('teams')
    .select('id, name, logo_url')
    .in('id', teamIds) : { data: [] as TeamDetails[] } as any;

  const detailsMap = new Map<string, TeamDetails>((teamDetails as TeamDetails[] || []).map((t) => [t.id, t]));

  const teams = (perf || []).map((t: any, index: number) => {
    const details = detailsMap.get(t.team_id) as TeamDetails | undefined;
    return {
      id: t.team_id,
      name: details?.name || t.team_name,
      logo_url: details?.logo_url,
      current_rp: t.current_ranking_points,
      rank: index + 1
    };
  });

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={800}>
          Top Teams ({gameYear})
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isFallback ? `Showing ${gameYear} data` : 'Preview rankings'}
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>RP</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tier</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team: any) => {
              const tierColor = getTierColor(team.rank);
              const tierLabel = getTierLabel(team.rank);
              return (
                <TableRow key={team.id} hover>
                  <TableCell>#{team.rank}</TableCell>
                  <TableCell>
                    <a href={`/team/${team.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={team.logo_url || undefined}
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: withAlpha('#3B82F6', 0.2),
                            fontSize: 12,
                            fontWeight: 700
                          }}
                        >
                          {(team.name || 'TM').slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Typography fontWeight={600}>{team.name || 'Unknown Team'}</Typography>
                      </Box>
                    </a>
                  </TableCell>
                  <TableCell align="right">
                    <Chip 
                      label={`${Math.round(team.current_rp || 0).toLocaleString()} RP`}
                      size="small"
                      sx={{ bgcolor: withAlpha('#9BF00B', 0.15), color: '#9BF00B', fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={tierLabel}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: tierColor, color: tierColor }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {teams.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary" variant="body1" gutterBottom>
                      No teams found for {gameYear}
                    </Typography>
                    {error && (
                      <Typography color="error.main" variant="body2">
                        Error loading team data
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
