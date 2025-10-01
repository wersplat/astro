import { Box, Paper, Typography, Grid, Avatar, Chip } from '@mui/material';

type Match = {
  id: string;
  team_a_name: string;
  team_b_name: string;
  team_a_score?: number;
  team_b_score?: number;
  round: string;
  team_a_logo?: string;
  team_b_logo?: string;
  winner?: string;
};

type TournamentBracketProps = {
  matches: Match[];
};

export default function TournamentBracket({ matches }: TournamentBracketProps) {
  if (!matches || matches.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Tournament Bracket</Typography>
        <Typography color="text.secondary">No bracket information available.</Typography>
      </Paper>
    );
  }

  // Group matches by round
  const rounds = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const roundOrder = ['Round 1', 'Quarter Finals', 'Semi Finals', 'Finals'];
  const orderedRounds = roundOrder.filter(round => rounds[round]);

  const MatchCard = ({ match }: { match: Match }) => (
    <Box sx={{ 
      p: 2, 
      bgcolor: 'background.paper', 
      borderRadius: 1, 
      border: '1px solid',
      borderColor: match.winner ? 'primary.main' : 'divider',
      minWidth: 200,
      '&:hover': { bgcolor: 'action.hover' }
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src={match.team_a_logo} sx={{ width: 20, height: 20 }}>
            {match.team_a_name?.slice(0, 2).toUpperCase()}
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {match.team_a_name}
          </Typography>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
          vs
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src={match.team_b_logo} sx={{ width: 20, height: 20 }}>
            {match.team_b_name?.slice(0, 2).toUpperCase()}
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {match.team_b_name}
          </Typography>
        </Box>
        
        {match.team_a_score !== undefined && match.team_b_score !== undefined ? (
          <Typography variant="caption" color="primary.main" sx={{ textAlign: 'center', fontWeight: 600 }}>
            {match.team_a_score} - {match.team_b_score}
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            Upcoming
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Tournament Bracket
      </Typography>
      
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 4, minWidth: 'max-content' }}>
          {orderedRounds.map((roundName) => (
            <Box key={roundName} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
                {roundName}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {rounds[roundName].map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
