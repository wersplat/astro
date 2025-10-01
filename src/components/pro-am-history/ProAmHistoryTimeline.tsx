import { Paper, Typography, Stack, Box, Chip, Avatar } from '@mui/material';

import { createClientBrowser } from '@/lib/supabaseClient';

export default async function ProAmHistoryTimeline() {
  
  const supabase = createClientBrowser();

  // Load all league champions and tournament champions with tournament names
  const [leaguesRes, tourneysRes] = await Promise.all([
    supabase
      .from('past_champions')
      .select('id, season, year, console, league_name, event_tier, team_name, champion_logo, lg_logo, is_tournament, tournament_date')
      .eq('is_tournament', false)
      .order('year', { ascending: false }),
    supabase
      .from('past_champions')
      .select(`
        id, season, year, console, league_name, event_tier, team_name, champion_logo, lg_logo, is_tournament, tournament_date,
        tournament_id,
        tournaments!inner(name)
      `)
      .eq('is_tournament', true)
      .order('tournament_date', { ascending: false })
  ]);

  const makeKey = (r: any) =>
    `${r.is_tournament ? 'T' : 'L'}-${r.year || ''}-${r.tournament_date || ''}-${r.team_name || ''}-${r.league_name || ''}-${r.id}`;

  const merged = new Map<string, any>();
  (leaguesRes.data || []).forEach((r) => merged.set(makeKey(r), r));
  (tourneysRes.data || []).forEach((r) => merged.set(makeKey(r), r));

  const rows = Array.from(merged.values()).sort((a, b) => {
    const ay = Number(a.year || 0), by = Number(b.year || 0);
    if (ay !== by) return by - ay;
    const ad = a.tournament_date ? new Date(a.tournament_date).getTime() : 0;
    const bd = b.tournament_date ? new Date(b.tournament_date).getTime() : 0;
    return bd - ad;
  });

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Past Pro Am Champions
      </Typography>
      {rows.length === 0 ? (
        <Typography color="text.secondary">No champions yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {rows.map((row) => {
            const yr = row.year || (row.tournament_date ? new Date(row.tournament_date).getFullYear() : '');
            const season = row.season || '';
            const isTournament = row.is_tournament;
            
            return (
              <Box 
                key={makeKey(row)} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transition: 'background-color 0.2s ease'
                  }
                }}
              >
                {/* League Logo */}
                <Avatar
                  src={row.lg_logo}
                  alt={row.league_name || 'League'}
                  sx={{ 
                    width: 48, 
                    height: 48,
                    bgcolor: 'action.hover'
                  }}
                >
                  {(row.league_name || 'L').charAt(0).toUpperCase()}
                </Avatar>
                
                {/* Champion Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" fontWeight={700} noWrap>
                      {row.team_name || 'Unknown Team'}
                    </Typography>
                    {isTournament && (
                      <Chip 
                        label="Tournament" 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    )}
                    {!isTournament && (
                      <Chip 
                        label="League" 
                        size="small" 
                        color="success" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                      {row.league_name || 'Unknown League'}
                    </Typography>
                    {isTournament && row.tournaments?.name && (
                      <Typography variant="body2" color="primary.main" fontWeight={600}>
                        {row.tournaments.name}
                      </Typography>
                    )}
                    {row.event_tier && (
                      <Chip 
                        label={row.event_tier} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                    {season && (
                      <Chip 
                        label={`Season ${season}`} 
                        size="small" 
                        color="info" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                    {row.console && (
                      <Chip 
                        label={row.console} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>
                
                {/* Year */}
                <Box sx={{ textAlign: 'right', minWidth: 60 }}>
                  <Typography variant="h6" fontWeight={800} color="primary.main">
                    {yr || '—'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isTournament ? 'Tournament' : 'Champion'}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}
