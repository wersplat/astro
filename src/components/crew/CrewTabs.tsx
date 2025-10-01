import { Box, Paper, Tab, Tabs as MuiTabs, Typography } from '@mui/material';

type Member = {
  player_id: string;
  role: string | null;
  joined_at: string | null;
  player: {
    id: string;
    gamertag: string | null;
    position: string | null;
    player_rp: number | null;
    performance_score: number | null;
  } | null;
};

type RecentMatch = {
  id: string;
  played_at: string | null;
  team_a_id: string;
  team_b_id: string;
  score_a: number | null;
  score_b: number | null;
  team_a: { name: string | null } | null;
  team_b: { name: string | null } | null;
};

export default function CrewTabs({ 
  crewId, 
  members, 
  recentMatches 
}: { 
  crewId: string; 
  members: Member[]; 
  recentMatches: RecentMatch[] 
}) {
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <MuiTabs value={0} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        <Tab label="Members" />
        <Tab label="Teams" />
        <Tab label="Recent Activity" />
      </MuiTabs>

      <Box sx={{ display: 'grid', gap: 3 }}>
        {/* Members */}
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Crew Members ({members.length})
          </Typography>
          {members.length === 0 ? (
            <Typography color="text.secondary">No members found.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {members.map((member) => (
                <Paper key={member.player_id} elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                  <Typography fontWeight={600}>
                    {member.player?.gamertag || 'Unknown Player'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.player?.position || 'No position'} • {Math.round(member.player?.player_rp || 0)} RP
                  </Typography>
                  {member.role && (
                    <Typography variant="caption" color="text.secondary">
                      Role: {member.role}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Box>
          )}
        </Box>

        {/* Teams */}
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Associated Teams
          </Typography>
          <Typography color="text.secondary">
            Team associations coming soon.
          </Typography>
        </Box>

        {/* Recent Activity */}
        <Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Recent Activity
          </Typography>
          {recentMatches.length === 0 ? (
            <Typography color="text.secondary">No recent activity.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {recentMatches.slice(0, 5).map((match) => (
                <Paper key={match.id} elevation={1} sx={{ p: 2, borderRadius: 1 }}>
                  <Typography variant="body2">
                    {match.team_a?.name || 'Team A'} vs {match.team_b?.name || 'Team B'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Score: {match.score_a || 0} - {match.score_b || 0}
                  </Typography>
                  {match.played_at && (
                    <Typography variant="caption" color="text.secondary">
                      {new Date(match.played_at).toLocaleDateString()}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
