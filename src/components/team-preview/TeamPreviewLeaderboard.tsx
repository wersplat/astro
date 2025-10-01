import { Paper, Typography, Stack, Box, Chip, Avatar, Divider } from '@mui/material';

import { createClientBrowser } from '@/lib/supabaseClient';


export default async function TeamPreviewLeaderboard() {
  
  const supabase = createClientBrowser();

  // Get team data with hybrid_score for ranking
  const { data: teamData, error: teamError } = await supabase
    .from('teams')
    .select(`
      id,
      name,
      logo_url,
      leaderboard_tier,
      global_rank,
      elo_rating,
      hybrid_score,
      current_rp
    `)
    .eq('is_active', true)
    .order('hybrid_score', { ascending: false })
    .limit(8);

  const error = teamError;

  type TeamRow = {
    id: string;
    name: string;
    logo_url: string | null;
    leaderboard_tier: string | null;
    global_rank: number | null;
    elo_rating: number | null;
    hybrid_score: number | null;
    current_rp: number | null;
  };

  const teams: TeamRow[] = (teamData as any) || [];

  function getTierColor(tier: string | null) {
    if (!tier) return '#9E9E9E';
    switch (tier) {
      case 'S': return '#9C27B0';
      case 'A': return '#2196F3';
      case 'B': return '#4CAF50';
      case 'C': return '#FF9800';
      case 'D': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Top Teams - 2K26
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Leading teams based on ranking points and performance
      </Typography>
      
      {error && (
        <Typography color="error.main" variant="body2" sx={{ mb: 2 }}>
          Failed to load teams.
        </Typography>
      )}
      
      <Stack spacing={2}>
        {teams.length === 0 && (
          <Typography color="text.secondary">No teams found.</Typography>
        )}
        {teams.map((team: TeamRow, index) => (
          <Box key={team.id}>
            <a href={`/team/${team.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                {/* Ranking Position */}
                <Box
                  sx={{
                    height: 32,
                    width: 32,
                    borderRadius: '50%',
                    bgcolor: index < 3 ? 'primary.main' : 'action.hover',
                    color: index < 3 ? 'white' : 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    flexShrink: 0
                  }}
                >
                  {index + 1}
                </Box>
                
                {/* Team Logo */}
                <Avatar
                  src={team.logo_url || undefined}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    flexShrink: 0
                  }}
                >
                  {(team.name || 'T').charAt(0).toUpperCase()}
                </Avatar>
                
                {/* Team Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" fontWeight={600} noWrap>
                    {team.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} alignItems="center">
                    {team.leaderboard_tier && (
                      <Chip 
                        label={team.leaderboard_tier} 
                        size="small" 
                        sx={{ 
                          bgcolor: getTierColor(team.leaderboard_tier),
                          color: 'white',
                          fontWeight: 600,
                          height: 20,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                    {team.global_rank && (
                      <Typography variant="caption" color="text.secondary">
                        #{team.global_rank}
                      </Typography>
                    )}
                  </Stack>
                </Box>
                
                {/* Stats */}
                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography variant="body1" fontWeight={700} color="primary.main">
                    {Math.round(team.hybrid_score || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Hybrid Score</Typography>
                  {team.elo_rating && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      ELO: {Math.round(team.elo_rating)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </a>
            {index < teams.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Stack>
      
      {teams.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Showing top {teams.length} teams • Rankings updated daily
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
