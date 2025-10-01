
import { createClientBrowser } from '@/lib/supabaseClient';
import { 
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  Grid
} from '@mui/material';

import { CalendarToday, LocationOn, EmojiEvents } from '@mui/icons-material';
import PaginationClient from '../players/PaginationClient';

type SearchParamsType = {
  search?: string;
  tier?: string;
  status?: string;
  sort?: string;
  page?: string;
};

const ITEMS_PER_PAGE = 25;

function getTierColor(tier: number) {
  const colors = {
    1: '#9C27B0', // T1 - Purple
    2: '#2196F3', // T2 - Blue  
    3: '#4CAF50', // T3 - Green
    4: '#FF9800', // T4 - Orange
    5: '#9E9E9E', // T5 - Gray
  };
  return colors[tier as keyof typeof colors] || '#9E9E9E';
}

function getTierLabel(tier: number) {
  const labels = {
    1: 'T1',
    2: 'T2',
    3: 'T3',
    4: 'T4',
    5: 'T5',
  };
  return labels[tier as keyof typeof labels] || `T${tier}`;
}

function getStatusInfo(eventDate: string | null) {
  if (!eventDate) return { status: 'unknown', color: '#9E9E9E' };
  
  const date = new Date(eventDate);
  const now = new Date();
  const daysDiff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 3600 * 24));
  
  if (daysDiff > 7) return { status: 'upcoming', color: '#2196F3' };
  if (daysDiff > 0) return { status: 'soon', color: '#FF9800' };
  if (daysDiff === 0) return { status: 'today', color: '#4CAF50' };
  return { status: 'completed', color: '#9E9E9E' };
}

export default async function EventsList({ searchParams }: { searchParams: SearchParamsType }) {
  
  const supabase = createClientBrowser();
  const page = parseInt(searchParams.page || '1');
  const offset = (page - 1) * ITEMS_PER_PAGE;
  
  // Server-safe alpha function
  const withAlpha = (hexColor: string, opacity: number) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Build query combining tournaments and league events like the existing JS
  const [tournamentsRes, leaguesRes] = await Promise.all([
    supabase
      .from('tournament_calendar')
      .select('id, tournament_name as name, start_date, end_date, tier, organizer_name as location, prize_pool as max_rp, description')
      .order('start_date', { ascending: false })
      .limit(50),
    supabase
      .from('league_calendar')
      .select('season_id as id, league_name as name, start_date, end_date')
      .order('start_date', { ascending: false })
      .limit(50)
  ]);

  const tournaments = (tournamentsRes.data || []).map((t: any) => ({ ...t, event_date: t.start_date, type: 'tournament' }));
  const leagues = (leaguesRes.data || []).map((l: any) => ({ ...l, event_date: l.start_date, type: 'league', tier: null, max_rp: null, location: null, description: null }));
  let allEvents = [...tournaments, ...leagues];

  // Apply filters
  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase();
    allEvents = allEvents.filter(event => 
      event.name.toLowerCase().includes(searchTerm)
    );
  }
  
  if (searchParams.tier) {
    const tierNum = parseInt(searchParams.tier);
    allEvents = allEvents.filter(event => event.tier === tierNum);
  }

  // Apply sorting
  const sort = searchParams.sort || 'date-desc';
  switch (sort) {
    case 'date-asc':
      allEvents.sort((a, b) => new Date(a.event_date || 0).getTime() - new Date(b.event_date || 0).getTime());
      break;
    case 'date-desc':
      allEvents.sort((a, b) => new Date(b.event_date || 0).getTime() - new Date(a.event_date || 0).getTime());
      break;
    case 'name-asc':
      allEvents.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'rp-desc':
      allEvents.sort((a, b) => (b.max_rp || 0) - (a.max_rp || 0));
      break;
  }

  // Apply pagination
  const events = allEvents.slice(offset, offset + ITEMS_PER_PAGE);
  const count = allEvents.length;

  return (
    <Box>
      <Stack spacing={3}>
        {events?.map((event) => {
          const tierColor = getTierColor(event.tier || 5);
          const tierLabel = getTierLabel(event.tier || 5);
          const statusInfo = getStatusInfo(event.event_date);
          
          return (
            <Link 
              key={event.id}
              href={event.type === 'league' ? `/league/${event.id}` : `/tournament/${event.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Paper 
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: 1,
                  borderColor: withAlpha(tierColor, 0.3),
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.4)',
                    borderColor: withAlpha(tierColor, 0.6)
                  }
                }}
              >
              <Grid container spacing={3} alignItems="center">
                {/* Main Info */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h6" fontWeight={800}>
                          {event.name}
                        </Typography>
                        <Chip 
                          label={tierLabel}
                          size="small"
                          sx={{ 
                            bgcolor: withAlpha(tierColor, 0.15),
                            color: tierColor,
                            fontWeight: 700
                          }}
                        />
                        <Chip 
                          label={statusInfo.status.charAt(0).toUpperCase() + statusInfo.status.slice(1)}
                          size="small"
                          sx={{ 
                            bgcolor: withAlpha(statusInfo.color, 0.15),
                            color: statusInfo.color,
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      
                      {event.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {event.description.slice(0, 150)}
                          {event.description.length > 150 && '...'}
                        </Typography>
                      )}
                      
                      <Stack direction="row" spacing={3} flexWrap="wrap">
                        {event.event_date && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(event.event_date).toLocaleDateString('en-US', {
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        )}
                        
                        {event.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {event.location}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                </Grid>

                {/* RP Prize */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                    {event.max_rp && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <EmojiEvents sx={{ fontSize: 20, color: '#9BF00B' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Max Prize
                          </Typography>
                          <Typography variant="h6" fontWeight={800} sx={{ color: '#9BF00B' }}>
                            {event.max_rp} RP
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
              </Paper>
            </a>
          );
        })}
      </Stack>

      {(!events || events.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or filters
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      <PaginationClient count={Math.ceil(count / ITEMS_PER_PAGE)} page={page} basePath="/events" />

      {/* Results Summary */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {events?.length || 0} of {count || 0} events
          {searchParams.search && ` matching "${searchParams.search}"`}
        </Typography>
      </Box>
    </Box>
  );
}
