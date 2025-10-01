'use client';

import { useState } from 'react';
import { Box, Paper, Tab, Tabs as MuiTabs } from '@mui/material';

type TabsClientProps = {
  overview: React.ReactNode;
  games: React.ReactNode;
  career: React.ReactNode;
  badges: React.ReactNode;
  media: React.ReactNode;
};

export default function TabsClient(props: TabsClientProps) {
  const [value, setValue] = useState(0);

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <MuiTabs value={value} onChange={(_, v) => setValue(v)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
        <Tab label="Overview" />
        <Tab label="Games" />
        <Tab label="Career" />
        <Tab label="Badges" />
        <Tab label="Media" />
      </MuiTabs>

      <Box sx={{ display: 'grid', gap: 3 }}>
        {value === 0 && props.overview}
        {value === 1 && props.games}
        {value === 2 && props.career}
        {value === 3 && props.badges}
        {value === 4 && props.media}
      </Box>
    </Paper>
  );
}


