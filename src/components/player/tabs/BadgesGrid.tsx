
import { createClientBrowser } from '@/lib/supabaseClient';
import { Grid, Paper, Stack, Typography, Avatar, Link as MuiLink } from '@mui/material';

export default async function BadgesGrid({ playerId }: { playerId: string }) {
  
  const supabase = createClientBrowser();
  const { data } = await supabase
    .from('badges')
    .select('*')
    .eq('player_id', playerId);

  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Typography color="text.secondary">No badges yet.</Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2}>
      {data.map((b: any) => (
        <Grid item xs={12} sm={6} md={4} key={b.id}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={b.image_url || undefined} alt={b.name || undefined} />
              <div>
                <Typography fontWeight={700}>{b.name}</Typography>
                <Typography variant="caption" color="text.secondary">{b.tier}</Typography>
              </div>
            </Stack>
            {b.metadata_uri && (
              <MuiLink href={b.metadata_uri} target="_blank" rel="noreferrer" sx={{ mt: 1, display: 'inline-block' }}>
                View metadata
              </MuiLink>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}


