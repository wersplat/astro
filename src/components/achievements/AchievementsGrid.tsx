'use client';

import React, { useState, useMemo } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  useTheme
} from '@mui/material';
import { 
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  Grade as GradeIcon
} from '@mui/icons-material';
import { achievements } from '@/data/achievements';
import { Achievement, AchievementCategory } from '@/types/achievements';

type SearchParamsType = {
  search?: string;
  category?: string;
  rarity?: string;
  view?: string;
};

const rarityStyles = {
  common: { color: 'text.secondary', bgcolor: 'grey.100', icon: TrophyIcon },
  rare: { color: 'primary.main', bgcolor: 'primary.50', icon: StarIcon },
  epic: { color: 'secondary.main', bgcolor: 'secondary.50', icon: DiamondIcon },
  legendary: { color: 'warning.main', bgcolor: 'warning.50', icon: GradeIcon }
};

const categoryIcons: Record<AchievementCategory, string> = {
  scoring: '🏀',
  assists: '🎯',
  defense: '🛡️',
  rebounding: '🪣',
  mixed: '📊',
  streak: '🔥',
  legendary: '🌟'
};

export default function AchievementsGrid({ searchParams }: { searchParams: SearchParamsType }) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const theme = useTheme();

  const filteredAchievements = useMemo(() => {
    return achievements.filter(achievement => {
      const matchesSearch = !searchParams.search || 
        achievement.title.toLowerCase().includes(searchParams.search.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchParams.search.toLowerCase()) ||
        achievement.badge.toLowerCase().includes(searchParams.search.toLowerCase());
      
      const matchesCategory = !searchParams.category || achievement.category === searchParams.category;
      const matchesRarity = !searchParams.rarity || achievement.rarity === searchParams.rarity;
      
      return matchesSearch && matchesCategory && matchesRarity;
    });
  }, [searchParams]);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  const handleCloseModal = () => {
    setSelectedAchievement(null);
  };

  if (filteredAchievements.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          🔍
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          No achievements found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search or filters
        </Typography>
      </Box>
    );
  }

  const view = searchParams.view || 'grid';

  if (view === 'list') {
    return (
      <React.Fragment>
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden' }}>
          {filteredAchievements.map((achievement) => {
            const rarityStyle = rarityStyles[achievement.rarity];
            const RarityIcon = rarityStyle.icon;
            
            return (
              <ListItem
                key={achievement.id}
                onClick={() => handleAchievementClick(achievement)}
                sx={{
                  cursor: 'pointer',
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:hover': { bgcolor: 'action.hover' },
                  '&:last-child': { borderBottom: 0 }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: rarityStyle.bgcolor,
                      color: rarityStyle.color,
                      width: 56,
                      height: 56,
                      fontSize: '1.5rem'
                    }}
                  >
                    {achievement.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" component="span">
                        {achievement.title}
                      </Typography>
                      <Chip
                        label={achievement.badge}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {achievement.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={<RarityIcon />}
                          label={achievement.rarity}
                          size="small"
                          sx={{
                            bgcolor: rarityStyle.bgcolor,
                            color: rarityStyle.color,
                            textTransform: 'capitalize'
                          }}
                        />
                        <Chip
                          label={categoryIcons[achievement.category]}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {achievement.type}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        <Dialog
          open={!!selectedAchievement}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
        >
          {selectedAchievement && (() => {
            const rarityStyle = rarityStyles[selectedAchievement.rarity];
            const RarityIcon = rarityStyle.icon;
            
            return (
              <Box>
                <DialogTitle sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {selectedAchievement.icon}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {selectedAchievement.title}
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Chip
                      label={selectedAchievement.badge}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {selectedAchievement.description}
                    </Typography>
                    
                    <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Requirements
                      </Typography>
                      <Typography variant="body2">
                        {selectedAchievement.requirements}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<RarityIcon />}
                        label={selectedAchievement.rarity}
                        size="small"
                        sx={{
                          bgcolor: rarityStyle.bgcolor,
                          color: rarityStyle.color,
                          textTransform: 'capitalize'
                        }}
                      />
                      <Chip
                        label={categoryIcons[selectedAchievement.category]}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={selectedAchievement.type}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseModal}>Close</Button>
                </DialogActions>
              </Box>
            );
          })()}
        </Dialog>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Grid container spacing={3}>
        {filteredAchievements.map((achievement) => {
          const rarityStyle = rarityStyles[achievement.rarity];
          const RarityIcon = rarityStyle.icon;
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={achievement.id}>
              <Card
                onClick={() => handleAchievementClick(achievement)}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: rarityStyle.bgcolor,
                      color: rarityStyle.color,
                      fontSize: '2rem',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    {achievement.icon}
                  </Avatar>
                  
                  <Chip
                    label={achievement.badge}
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    {achievement.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {achievement.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<RarityIcon />}
                      label={achievement.rarity}
                      size="small"
                      sx={{
                        bgcolor: rarityStyle.bgcolor,
                        color: rarityStyle.color,
                        textTransform: 'capitalize',
                        fontSize: '0.75rem'
                      }}
                    />
                    <Chip
                      label={categoryIcons[achievement.category]}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {achievement.type}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={!!selectedAchievement}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        {selectedAchievement && (() => {
          const rarityStyle = rarityStyles[selectedAchievement.rarity];
          const RarityIcon = rarityStyle.icon;
          
          return (
            <Box>
              <DialogTitle sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                  {selectedAchievement.icon}
                </Typography>
                <Typography variant="h5" component="h2">
                  {selectedAchievement.title}
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Chip
                    label={selectedAchievement.badge}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {selectedAchievement.description}
                  </Typography>
                  
                  <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Requirements
                    </Typography>
                    <Typography variant="body2">
                      {selectedAchievement.requirements}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<RarityIcon />}
                      label={selectedAchievement.rarity}
                      size="small"
                      sx={{
                        bgcolor: rarityStyle.bgcolor,
                        color: rarityStyle.color,
                        textTransform: 'capitalize'
                      }}
                    />
                    <Chip
                      label={categoryIcons[selectedAchievement.category]}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={selectedAchievement.type}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal}>Close</Button>
              </DialogActions>
            </Box>
          );
        })()}
      </Dialog>
    </div>
  );
}

