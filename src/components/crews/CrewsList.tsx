
import { createClientBrowser } from '@/lib/supabaseClient';
import { 
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  Stack
} from '@mui/material';

import { People, TrendingUp } from '@mui/icons-material';
import PaginationClient from '../players/PaginationClient';

type SearchParamsType = {
  search?: string;
  sort?: string;
  page?: string;
};

const ITEMS_PER_PAGE = 25;

export default async function CrewsList({ searchParams }: { searchParams: SearchParamsType }) {
  
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

  // Query city_crews and show ranked crews
  let query = supabase
    .from('city_crews')
    .select('id, crewName, crewRegion, crewRank, crewLead, crew_logo', { count: 'exact' })
    .order('crewRank', { ascending: true });

  if (searchParams.search) {
    query = query.ilike('crewName', `%${searchParams.search}%`);
  }

  query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

  const { data: crews, count } = await query;
  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <Box>
      <Grid container spacing={3}>
        {crews?.map((crew: any) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={crew.id}>
            <a href={`/crew/${crew.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Paper 
                elevation={2}
                sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar src={crew.crew_logo || undefined} sx={{ width: 40, height: 40 }}>
                    {(crew.crewName || 'CR').slice(0,2).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>
                      {crew.crewName || 'Crew'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {crew.crewRegion || '—'}
                    </Typography>
                  </Box>
                  {typeof crew.crewRank === 'number' && (
                    <Chip label={`#${crew.crewRank}`} size="small" sx={{ ml: 'auto' }} />
                  )}
                </Box>
              </Paper>
            </a>
          </Grid>
        ))}
      </Grid>

      {(!crews || crews.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No crews found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      <PaginationClient count={totalPages} page={page} basePath="/crews" />

      {/* Results Summary */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {crews?.length || 0} of {count || 0} crews
          {searchParams.search && ` matching "${searchParams.search}"`}
        </Typography>
      </Box>
    </Box>
  );
}
