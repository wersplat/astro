import { Paper, Typography, Stack, Box } from '@mui/material';

import { createClientBrowser } from '@/lib/supabaseClient';
import { Preview, TrendingUp, EmojiEvents, People, Speed, Shield } from '@mui/icons-material';

export default async function TeamPreviewFeatures() {
  
  const supabase = createClientBrowser();

  // Get top teams with their roster counts
  const { data: topTeams } = await supabase
    .from('team_performance_by_game_year')
    .select(`
      team_id,
      team_name,
      current_ranking_points,
      teams!inner(
        id,
        name,
        logo_url,
        leaderboard_tier
      )
    `)
    .eq('game_year', '2K26')
    .order('current_ranking_points', { ascending: false })
    .limit(5);

  const features = [
    {
      icon: <Preview />,
      title: 'Team Analysis',
      description: 'In-depth analysis of team compositions and strategies for 2K26.',
      color: '#3B82F6'
    },
    {
      icon: <TrendingUp />,
      title: 'Performance Projections',
      description: 'Predictions based on historical data and current rosters.',
      color: '#9BF00B'
    },
    {
      icon: <EmojiEvents />,
      title: 'Tournament Readiness',
      description: 'Assessment of team preparedness for upcoming competitions.',
      color: '#9C27B0'
    },
    {
      icon: <People />,
      title: 'Roster Strength',
      description: 'Evaluation of individual player contributions and team chemistry.',
      color: '#10B981'
    }
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Team Analysis Features
      </Typography>
      <Stack spacing={3}>
        {features.map((feature, index) => (
          <Box 
            key={index}
            sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 2,
              p: 2,
              borderRadius: 2,
              border: 1,
              borderColor: `${feature.color}30`,
              '&:hover': {
                borderColor: `${feature.color}60`,
                bgcolor: `${feature.color}10`,
                transition: 'all 0.2s ease'
              }
            }}
          >
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: `${feature.color}15`,
              color: feature.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {feature.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
