import { Box, Paper, Typography, Grid, Chip, Link } from '@mui/material';

type LeagueData = {
  // League season data (from league_seasons table)
  id?: string | null; // season_id
  league_id?: string | null;
  league_name?: string | null;
  season_number?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  is_active?: boolean | null;
  game_year?: string | null;
  entry_fee?: number | null; // From league_seasons table
  prize_pool?: number | null; // From league_seasons table
  year?: string | null;
  
  // League info data (from leagues_info table)
  league_logo?: string | null;
  league_status?: string | null;
  league_website?: string | null;
  discord_link?: string | null;
  twitch_url?: string | null;
  twitter_id?: string | null;
  registration_deadline?: string | null;
  max_teams?: number | null;
  current_teams?: number | null;
  league_format?: string | null;
  rules_url?: string | null;
  
  // Nested leagues_info object
  leagues_info?: {
    id: string;
    league: string | null;
    lg_logo_url: string | null;
    lg_url: string | null;
    lg_discord: string | null;
    lg_rules_url: string | null;
    twitch_url: string | null;
    twitter_id: string | null;
    sponsor_info: string | null;
  };
};

type LeagueInformationProps = {
  league: LeagueData | null;
};

export default function LeagueInformation({ league }: LeagueInformationProps) {
  if (!league) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>League Information</Typography>
        <Typography color="text.secondary">No league information available.</Typography>
      </Paper>
    );
  }

  const getRegistrationStatusColor = (status: string | null | undefined) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'open': 
      case 'active': 
        return 'success';
      case 'closed': 
      case 'inactive': 
        return 'error';
      case 'pending': 
      case 'upcoming': 
        return 'warning';
      default: 
        return 'default';
    }
  };

  const getLeagueStatus = () => {
    if (league?.is_active === true) return 'Active';
    if (league?.is_active === false) return 'Inactive';
    if (league?.league_status) return league.league_status;
    return 'Unknown';
  };

  const getLeagueDescription = () => {
    if (league?.leagues_info?.sponsor_info) {
      return league.leagues_info.sponsor_info;
    }
    return `${league?.league_name || 'League'} - A competitive ${league?.game_year || '2K26'} league featuring the best teams competing for glory and prizes.`;
  };

  const getLeagueFormat = () => {
    if (league?.league_format) {
      return league.league_format;
    }
    if (league?.season_number) {
      return `Season ${league.season_number} - Regular Season with playoffs`;
    }
    return 'Regular Season with playoffs';
  };

  const getEntryFee = () => {
    if (league?.entry_fee !== null && league?.entry_fee !== undefined) {
      if (league.entry_fee === 0) {
        return 'Free';
      }
      return `$${league.entry_fee.toLocaleString()}`;
    }
    return 'Contact league for entry fee details';
  };

  const getPrizePool = () => {
    if (league?.prize_pool !== null && league?.prize_pool !== undefined) {
      if (league.prize_pool === 0) {
        return 'No prize pool';
      }
      return `$${league.prize_pool.toLocaleString()}`;
    }
    
    // Calculate prize pool as 80% of (teams × entry fee) when prize pool is null
    if (league?.current_teams && league?.entry_fee && league.entry_fee > 0) {
      const calculatedPrizePool = Math.round(league.current_teams * league.entry_fee * 0.8);
      return `$${calculatedPrizePool.toLocaleString()} (calculated)`;
    }
    
    return 'TBD';
  };

  const getRegistrationInfo = () => {
    const info = [];
    if (league?.registration_deadline) {
      info.push(`Deadline: ${new Date(league.registration_deadline).toLocaleDateString()}`);
    }
    if (league?.current_teams && league?.max_teams) {
      info.push(`Teams: ${league.current_teams}/${league.max_teams}`);
    } else if (league?.current_teams) {
      info.push(`Teams: ${league.current_teams}`);
    }
    return info.length > 0 ? info.join(' | ') : 'Contact league for details';
  };

  const getRulesUrl = () => {
    return league?.rules_url || league?.leagues_info?.lg_rules_url || league?.league_website || '#';
  };

  const getContactInfo = () => {
    const contacts = [];
    if (league?.leagues_info?.lg_discord || league?.discord_link) {
      contacts.push('Discord: ' + (league?.leagues_info?.lg_discord || league?.discord_link));
    }
    if (league?.leagues_info?.twitter_id || league?.twitter_id) {
      contacts.push('Twitter: @' + (league?.leagues_info?.twitter_id || league?.twitter_id));
    }
    if (league?.leagues_info?.twitch_url || league?.twitch_url) {
      contacts.push('Twitch: ' + (league?.leagues_info?.twitch_url || league?.twitch_url));
    }
    return contacts.length > 0 ? contacts.join(' | ') : 'Contact league for details';
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        League Information
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1">
                {getLeagueDescription()}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Format
              </Typography>
              <Typography variant="body1">
                {getLeagueFormat()}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                League Status
              </Typography>
              <Chip 
                label={getLeagueStatus()} 
                color={getRegistrationStatusColor(getLeagueStatus()) as any}
                size="small"
              />
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Season Information
              </Typography>
              <Typography variant="body1">
                {league?.season_number ? `Season ${league.season_number}` : 'Current Season'}
                {league?.start_date && (
                  <Typography variant="body2" color="text.secondary" component="span">
                    {' '}({new Date(league.start_date).toLocaleDateString()}
                    {league?.end_date && ` - ${new Date(league.end_date).toLocaleDateString()}`})
                  </Typography>
                )}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Entry Fee & Prize Pool
              </Typography>
              <Typography variant="body1">
                Entry Fee: {getEntryFee()}
              </Typography>
              <Typography variant="body1">
                Prize Pool: {getPrizePool()}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Entry fee and prize pool from league_seasons table
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Registration
              </Typography>
              <Typography variant="body1">
                {getRegistrationInfo()}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Rules & Website
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {getRulesUrl() !== '#' && (
                  <a href={getRulesUrl()} color="primary" underline="hover" target="_blank">
                    View League Rules
                  </a>
                )}
                {(league?.leagues_info?.lg_url || league?.league_website) && (
                  <Link 
                    href={league?.leagues_info?.lg_url || league?.league_website || '#'} 
                    color="primary" 
                    underline="hover" 
                    target="_blank"
                  >
                    Visit League Website
                  </a>
                )}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Contact & Social
              </Typography>
              <Typography variant="body1">
                {getContactInfo()}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
