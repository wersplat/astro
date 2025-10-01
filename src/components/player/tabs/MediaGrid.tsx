
import { createClientBrowser } from '@/lib/supabaseClient';
import { Paper, Typography, Grid, Box, Link as MuiLink, Chip } from '@mui/material';

// Local type to describe the expected shape of player_media
// Using existing tables/fields only (no migrations generated here)
type PlayerMedia = {
  id: string;
  player_id: string;
  title: string | null;
  description: string | null;
  provider: 'youtube' | 'twitch' | 'x' | 'cf_stream' | 'other' | string | null;
  url: string | null; // canonical watch URL
  thumbnail_url: string | null;
  created_at: string | null;
};

function getProviderColor(provider: string | null | undefined) {
  switch ((provider || '').toLowerCase()) {
    case 'youtube': return '#FF0000';
    case 'twitch': return '#9146FF';
    case 'x': return '#000000';
    case 'cf_stream': return '#00AEFF';
    default: return '#64748b';
  }
}

export default async function MediaGrid({ playerId }: { playerId: string }) {
  
  const supabase = createClientBrowser();

  // Attempt to read from a `player_media` table (must already exist in DB)
  const { data, error } = await supabase
    .from('player_media' as any)
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(24);

  const rows: PlayerMedia[] = (data as any) || [];

  if (error) {
    return (
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography color="error">Failed to load media.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Media
      </Typography>

      {rows.length === 0 ? (
        <Typography color="text.secondary">No media found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {rows.map((m) => {
            const providerColor = getProviderColor(m.provider);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={m.id}>
                <Box sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}>
                  {/* Thumbnail */}
                  {m.thumbnail_url ? (
                    <a href={m.url || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.thumbnail_url}
                        alt={m.title || 'media thumbnail'}
                        style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                      />
                    </a>
                  ) : (
                    <Box sx={{ height: 160, bgcolor: 'action.hover' }} />
                  )}

                  {/* Meta */}
                  <Box sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={700} noWrap>
                        {m.title || 'Untitled'}
                      </Typography>
                      {m.provider && (
                        <Chip size="small" label={(m.provider || '').toUpperCase()} sx={{ bgcolor: `${providerColor}26`, color: providerColor, fontWeight: 700 }} />
                      )}
                    </Box>

                    {m.description && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }} noWrap>
                        {m.description}
                      </Typography>
                    )}

                    {m.url && (
                      <MuiLink href={m.url} target="_blank" rel="noopener noreferrer" underline="hover" color="primary" variant="caption">
                        Open
                      </MuiLink>
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Paper>
  );
}


