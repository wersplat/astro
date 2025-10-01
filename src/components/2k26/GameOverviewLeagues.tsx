import { Paper, Typography, Stack, Box, Chip, Link } from '@mui/material';

import { createClientBrowser } from '@/lib/supabaseClient';

export default async function GameOverviewLeagues() {
  
  const supabase = createClientBrowser();

  // Get 2K26 leagues from league_calendar view
  let { data: leagueCalendar, error } = await supabase
    .from('league_calendar')
    .select(`
      league_id,
      league_name,
      league_logo,
      is_active,
      game_year,
      season_id,
      season_number,
      start_date,
      end_date
    `)
    .eq('game_year', '2K26')
    .in('is_active', [true, false]) // Include both active and inactive (upcoming)
    .order('start_date', { ascending: false })
    .limit(6);

  // Fallback: if no 2K26 leagues, get the most recent leagues available
  if (!leagueCalendar || leagueCalendar.length === 0) {
    const { data: fallbackCalendar } = await supabase
      .from('league_calendar')
      .select(`
        league_id,
        league_name,
        league_logo,
        is_active,
        game_year,
        season_id,
        season_number,
        start_date,
        end_date
      `)
      .order('game_year', { ascending: false })
      .order('start_date', { ascending: false })
      .limit(6);
    leagueCalendar = fallbackCalendar;
  }

  // Get league info data for all unique league_ids
  const uniqueLeagueIds = [...new Set((leagueCalendar || []).map((cal: any) => cal.league_id).filter(Boolean))];
  const { data: leagueInfoData } = uniqueLeagueIds.length > 0 ? await supabase
    .from('leagues_info')
    .select('id, league, lg_logo_url, lg_url, lg_discord, twitch_url, twitter_id')
    .in('id', uniqueLeagueIds) : { data: [] };

  // Create a map of league info by league_id
  const leagueInfoMap = new Map<string, any>();
  (leagueInfoData || []).forEach((info: any) => {
    leagueInfoMap.set(info.id, info);
  });

  // Combine calendar data with league info
  const leagues = (leagueCalendar || []).map((cal: any) => {
    const info = leagueInfoMap.get(cal.league_id);
    return {
      id: cal.league_id,
      league: info?.league || cal.league_name,
      lg_logo_url: info?.lg_logo_url || cal.league_logo,
      lg_url: info?.lg_url,
      lg_discord: info?.lg_discord,
      twitch_url: info?.twitch_url,
      twitter_id: info?.twitter_id,
      is_active: cal.is_active,
      game_year: cal.game_year,
      season_id: cal.season_id,
      season_number: cal.season_number,
      start_date: cal.start_date,
      end_date: cal.end_date
    };
  });

  type LeagueRow = {
    id: string;
    league: string | null;
    lg_logo_url: string | null;
    lg_url: string | null;
    lg_discord: string | null;
    twitch_url: string | null;
    twitter_id: string | null;
    is_active?: boolean | null;
    game_year?: string | null;
    season_id?: string | null;
    season_number?: number | null;
    start_date?: string | null;
    end_date?: string | null;
  };

  const leagueData: LeagueRow[] = leagues || [];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Active Leagues
      </Typography>
      {error && (
        <Typography color="error.main" variant="body2" sx={{ mb: 2 }}>
          Failed to load leagues.
        </Typography>
      )}
      <Stack spacing={2}>
        {leagueData.length === 0 && (
          <Typography color="text.secondary">No leagues found.</Typography>
        )}
        {leagueData.map((league: LeagueRow) => (
          <Box 
            key={league.id} 
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
            <Box
              sx={{
                height: 48,
                width: 48,
                borderRadius: 1,
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {league.lg_logo_url ? (
                <img 
                  src={league.lg_logo_url} 
                  alt={league.league || 'League'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Typography variant="h6" fontWeight={800} color="text.secondary">
                  {(league.league || 'L').charAt(0).toUpperCase()}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="h6" fontWeight={600} noWrap>
                  {league.league || 'Unnamed League'}
                </Typography>
                {league.is_active && (
                  <Chip 
                    label="Active" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                  />
                )}
                {league.season_number && (
                  <Chip 
                    label={`Season ${league.season_number}`} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
                {league.game_year && (
                  <Chip 
                    label={league.game_year} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Box>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                {league.lg_url && (
                  <Chip 
                    label="Website" 
                    size="small" 
                    component={Link}
                    href={league.lg_url}
                    target="_blank"
                    clickable
                    sx={{ textDecoration: 'none' }}
                  />
                )}
                {league.lg_discord && (
                  <Chip 
                    label="Discord" 
                    size="small" 
                    component={Link}
                    href={league.lg_discord}
                    target="_blank"
                    clickable
                    sx={{ textDecoration: 'none' }}
                  />
                )}
                {league.twitch_url && (
                  <Chip 
                    label="Twitch" 
                    size="small" 
                    component={Link}
                    href={league.twitch_url}
                    target="_blank"
                    clickable
                    sx={{ textDecoration: 'none' }}
                  />
                )}
                {league.twitter_id && (
                  <Chip 
                    label="Twitter" 
                    size="small" 
                    component={Link}
                    href={`https://twitter.com/${league.twitter_id}`}
                    target="_blank"
                    clickable
                    sx={{ textDecoration: 'none' }}
                  />
                )}
              </Stack>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
