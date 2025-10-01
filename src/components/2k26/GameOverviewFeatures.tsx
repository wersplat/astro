import { Paper, Typography, Stack, Box, Chip } from '@mui/material';
import { SportsBasketball, TrendingUp, EmojiEvents, People, Speed, Shield } from '@mui/icons-material';

export default async function GameOverviewFeatures() {
  const features = [
    {
      icon: <SportsBasketball />,
      title: 'Enhanced Pro-Am Mechanics',
      description: 'Improved ball handling, shooting mechanics, and defensive systems for more realistic gameplay.',
      color: '#3B82F6'
    },
    {
      icon: <TrendingUp />,
      title: 'Real-Time Performance Tracking',
      description: 'Advanced analytics and live performance monitoring with detailed statistics.',
      color: '#9BF00B'
    },
    {
      icon: <EmojiEvents />,
      title: 'Expanded Tournament Formats',
      description: 'New competitive modes and tournament structures for diverse competition.',
      color: '#9C27B0'
    },
    {
      icon: <People />,
      title: 'Improved Team Management',
      description: 'Better tools for roster management and team coordination.',
      color: '#10B981'
    },
    {
      icon: <Speed />,
      title: 'Enhanced Visual Experience',
      description: 'Upgraded graphics and smoother gameplay experience.',
      color: '#FF9800'
    },
    {
      icon: <Shield />,
      title: 'Cross-Platform Compatibility',
      description: 'Seamless play across different gaming platforms.',
      color: '#607D8B'
    }
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Key Features
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
