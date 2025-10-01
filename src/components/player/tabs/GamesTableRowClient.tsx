"use client";
import * as React from 'react';
import { Box, Collapse, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function RowClient({ row }: { row: any }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.played_at ? new Date(row.played_at).toLocaleDateString() : '—'}</TableCell>
        <TableCell>{row.opponent_team_name ?? '—'}</TableCell>
        <TableCell align="right">{row.pts ?? 0}</TableCell>
        <TableCell align="right">{row.reb ?? 0}</TableCell>
        <TableCell align="right">{row.ast ?? 0}</TableCell>
        <TableCell align="center">{row.result ?? '—'}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Full Box Score</Typography>
              <Typography variant="body2" color="text.secondary">STL: {row.stl ?? 0} • BLK: {row.blk ?? 0}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}


