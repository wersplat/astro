import { Grid, Paper, Stack, Typography } from '@mui/material';

type SeasonStats = {
  pts: number | null;
  ast: number | null;
  reb: number | null;
  stl: number | null;
  blk: number | null;
  fg3_pct: number | null;
  tov: number | null;
  oreb_pct: number | null;
} | null;

type GameRow = {
  pts: number | null;
  ast: number | null;
  reb: number | null;
  stl: number | null;
  blk: number | null;
  fg3_pct?: number | null;
  tov?: number | null;
  oreb_pct?: number | null;
};

function delta(current: number | null | undefined, last10: (number | null | undefined)[]): number | null {
  const valid = last10.map(v => (typeof v === 'number' ? v : null)).filter((v): v is number => v !== null);
  if (current == null || valid.length === 0) return null;
  const avg = valid.reduce((a,b)=>a+b,0)/valid.length;
  return Number((current - avg).toFixed(2));
}

function Tile({ label, value, deltaValue }: { label: string; value: number | string | null | undefined; deltaValue: number | null }) {
  const up = (deltaValue ?? 0) > 0;
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="h5" fontWeight={800}>{value ?? '—'}</Typography>
        {deltaValue !== null && (
          <Typography variant="caption" sx={{ color: up ? 'success.main' : deltaValue < 0 ? 'error.main' : 'text.secondary' }}>
            {up ? '▲' : deltaValue < 0 ? '▼' : '–'} {Math.abs(deltaValue)} vs last 10
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default function StatTiles({ player, seasonStats, last10 }: { player: { position: string | null } | null; seasonStats: SeasonStats; last10: GameRow[] }) {
  const role = player?.position;
  const last = last10 || [];
  const tiles: { label: string; value: number | string | null | undefined; delta: number | null }[] = [];

  if (role === 'Point Guard' || role === 'Shooting Guard') {
    tiles.push(
      { label: 'PTS', value: seasonStats?.pts ?? null, delta: delta(seasonStats?.pts ?? null, last.map(g => g.pts)) },
      { label: 'AST', value: seasonStats?.ast ?? null, delta: delta(seasonStats?.ast ?? null, last.map(g => g.ast)) },
      { label: '3PT%', value: seasonStats?.fg3_pct != null ? `${Math.round((seasonStats.fg3_pct || 0) > 1 ? (seasonStats.fg3_pct || 0) : (seasonStats.fg3_pct || 0) * 100)}%` : null, delta: null },
      { label: 'AST/TO', value: seasonStats?.tov != null ? (seasonStats?.ast ?? 0) && (seasonStats?.tov ?? 0) ? Number(((seasonStats?.ast ?? 0)/(seasonStats?.tov || 1)).toFixed(2)) : null : null, delta: null }
    );
  } else if (role === 'Lock') {
    tiles.push(
      { label: 'STL', value: seasonStats?.stl ?? null, delta: delta(seasonStats?.stl ?? null, last.map(g => g.stl)) },
      { label: 'BLK', value: seasonStats?.blk ?? null, delta: delta(seasonStats?.blk ?? null, last.map(g => g.blk)) },
      { label: 'Opp FG%', value: '—', delta: null },
      { label: 'TOV Forced', value: '—', delta: null }
    );
  } else {
    // Power Forward, Center, or unknown
    tiles.push(
      { label: 'REB', value: seasonStats?.reb ?? null, delta: delta(seasonStats?.reb ?? null, last.map(g => g.reb)) },
      { label: 'BLK', value: seasonStats?.blk ?? null, delta: delta(seasonStats?.blk ?? null, last.map(g => g.blk)) },
      { label: 'PTS', value: seasonStats?.pts ?? null, delta: delta(seasonStats?.pts ?? null, last.map(g => g.pts)) },
      { label: 'OREB%', value: seasonStats?.oreb_pct != null ? `${Math.round((seasonStats.oreb_pct || 0) > 1 ? (seasonStats.oreb_pct || 0) : (seasonStats.oreb_pct || 0) * 100)}%` : null, delta: null }
    );
  }

  return (
    <Grid container spacing={2}>
      {tiles.map((t, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Tile label={t.label} value={t.value} deltaValue={t.delta} />
        </Grid>
      ))}
    </Grid>
  );
}


