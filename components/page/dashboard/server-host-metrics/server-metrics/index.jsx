import { memo } from 'react'

import Grid from '~/components/grid'

import AvgLatchWait from './avg-latch-wait'
import BatchRequests from './batch-requests'
import FullScansSec from './full-scans-sec'
import LockTimeoutsSec from './lock-timeouts-sec'
import LockWaitsSec from './lock-waits-sec'
import PageSplitsBatchRequests from './page-splits-batch-requests'
import PageSplitsSec from './page-splits-sec'
import { ServerProperties } from './server-properties'
import SqlCompilationsBatchRequests from './sql-compilations-batch-requests'
import SqlCompilationsSec from './sql-compilations-sec'
import UserConnections from './user-connections'

const ServerMetrics = (properties) => {
  const { key } = properties

  return (
    <div className="mt-6">
      <h3 className="font-bold mb-6">SQL Server metrics</h3>
      <div>
        <h4 className="mb-6 text-sm">General</h4>
        <Grid>
          <div className="cols-span-2 md:col-span-4">
            <BatchRequests key={key} />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <SqlCompilationsBatchRequests key={key} />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <PageSplitsBatchRequests key={key} />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <SqlCompilationsSec key={key} />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <PageSplitsSec key={key} />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <FullScansSec key={key} />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <UserConnections key={key} />
          </div>
        </Grid>
      </div>

      <Grid className="mt-6">
        <div className="col-span-2 space-y-4 md:col-span-6">
          <h4 className="mb-4 text-sm">Latches and locks</h4>
          <AvgLatchWait />
          <LockTimeoutsSec />
          <LockWaitsSec />
        </div>
        <ServerProperties />
      </Grid>
    </div>
  )
}

export default memo(ServerMetrics)
