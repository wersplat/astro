import { Suspense } from 'react';
import TabsClient from './TabsClient';
import { Box } from '@mui/material';
import GamesTable from './tabs/GamesTable';
import BadgesGrid from './tabs/BadgesGrid';
import MediaGrid from './tabs/MediaGrid';
import Overview from './tabs/Overview';
import Career from './tabs/Career';
import { GamesTableSkeleton, GridSkeleton } from './skeletons';

export default function PlayerTabs({ playerId }: { playerId: string }) {
  return (
    <TabsClient
      overview={(
        <Suspense fallback={<GridSkeleton />}>
          <Overview playerId={playerId} />
        </Suspense>
      )}
      games={(
        <Suspense fallback={<GamesTableSkeleton />}>
          <GamesTable playerId={playerId} />
        </Suspense>
      )}
      career={(
        <Suspense fallback={<GridSkeleton />}>
          <Career playerId={playerId} />
        </Suspense>
      )}
      badges={(
        <Suspense fallback={<GridSkeleton />}>
          <BadgesGrid playerId={playerId} />
        </Suspense>
      )}
      media={(
        <Suspense fallback={<GridSkeleton />}>
          <MediaGrid playerId={playerId} />
        </Suspense>
      )}
    />
  );
}


