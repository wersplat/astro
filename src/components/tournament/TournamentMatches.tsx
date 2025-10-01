import { Box, Paper, Typography, Avatar, Chip } from '@mui/material';
import { useState } from 'react';

type Match = {
  id: string;
  team_a_name: string;
  team_b_name: string;
  team_a_score: number;
  team_b_score: number;
  played_at: string;
  round?: string;
  team_a_logo?: string;
  team_b_logo?: string;
};

type TournamentMatchesProps = {
  recentMatches: Match[];
  upcomingMatches: Match[];
};

export default function TournamentMatches({ recentMatches, upcomingMatches }: TournamentMatchesProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const MatchCard = ({ match, isUpcoming = false }: { match: Match; isUpcoming?: boolean }) => (
    <Box sx={{ 
      p: 2, 
      bgcolor: 'background.paper', 
      borderRadius: 1, 
      border: '1px solid',
      borderColor: 'divider',
      '&:hover': { bgcolor: 'action.hover' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Avatar src={match.team_a_logo} sx={{ width: 20, height: 20 }}>
                {match.team_a_name?.slice(0, 2).toUpperCase()}
              </Avatar>
              <Typography variant="body2" fontWeight={600}>
                {match.team_a_name}
              </Typography>
            </Box>
            <Typography variant="h6" color={!isUpcoming && match.team_a_score > match.team_b_score ? 'primary.main' : 'text.primary'}>
              {isUpcoming ? '—' : match.team_a_score}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            vs
          </Typography>
          
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Avatar src={match.team_b_logo} sx={{ width: 20, height: 20 }}>
                {match.team_b_name?.slice(0, 2).toUpperCase()}
              </Avatar>
              <Typography variant="body2" fontWeight={600}>
                {match.team_b_name}
              </Typography>
            </Box>
            <Typography variant="h6" color={!isUpcoming && match.team_b_score > match.team_a_score ? 'primary.main' : 'text.primary'}>
              {isUpcoming ? '—' : match.team_b_score}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" color="text.secondary">
            {formatDate(match.played_at)}
          </Typography>
          {match.round && (
            <Typography variant="caption" color="text.secondary">
              {match.round}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Chip
          label="Recent Matches"
          color={activeTab === 'recent' ? 'primary' : 'default'}
          onClick={() => setActiveTab('recent')}
          clickable
        />
        <Chip
          label="Upcoming Matches"
          color={activeTab === 'upcoming' ? 'primary' : 'default'}
          onClick={() => setActiveTab('upcoming')}
          clickable
        />
      </Box>

      {activeTab === 'recent' && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Recent Matches
          </Typography>
          {recentMatches.length === 0 ? (
            <Typography color="text.secondary">No recent matches available.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentMatches.map((match) => (
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
    </Paper>
  );
}
