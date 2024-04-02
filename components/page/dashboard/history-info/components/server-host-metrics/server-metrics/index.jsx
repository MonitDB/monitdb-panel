import { useRouter } from 'next/router'
import { memo, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Grid from '~/components/grid'
import UserContext from '~/contexts/user'
import { useSingleDashboard } from '~/hooks/index'
import useLogContext from '~/services/state-manager/logs'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

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

const formatData = (item) => [
  new Date(item?.createDate ?? '').getTime(),
  item?.count === 'Infinity' ? '99999999' : Number(item?.count),
]

const ServerMetrics = ({ key }) => {
  const { currentServer } = useSingleDashboard()
  const { getSQLServerMetrics } = useLogContext()
  const route = useRouter()
  const { userState: user } = UserContext()

  const lastMinutes = route.query.lastMinutes

  const [data, setData] = useState({})
  const [isLoading, setIsloading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setIsloading(true)
      const response = await getSQLServerMetrics(currentServer.id, {
        lastMinutes,
      })
      setData(response)
    } catch {
      toast.error('Error to load the Server Metrics')
    } finally {
      setIsloading(false)
    }
  }, [currentServer.id, getSQLServerMetrics, lastMinutes])

  useEffect(fetchData, [fetchData])

  return (
    <div className="mt-6" key={key}>
      <h3 className="font-bold mb-6">SQL Server metrics</h3>
      <div>
        <h4 className="mb-6 text-sm">General</h4>
        <Grid>
          <div className="cols-span-2 md:col-span-4">
            {hasPermission(
              user,
              FeatureFunction.SQL_SERVER_METRICS_BATCH_REQUESTS,
              TypeGrant.READ
            ) && (
              <BatchRequests
                isLoading={isLoading}
                seriesData={data?.batchRequest?.map(formatData) ?? []}
              />
            )}
          </div>
          <div className="cols-span-2 md:col-span-4">
            {hasPermission(
              user,
              FeatureFunction.SQL_SERVER_METRICS_SQLCOMPILATIONS_BATCH_REQUESTS,
              TypeGrant.READ
            ) && (
              <SqlCompilationsBatchRequests
                isLoading={isLoading}
                seriesData={
                  data?.sqlCompilationsPerBatchRequests?.map(formatData) ?? []
                }
              />
            )}
          </div>
          <div className="cols-span-2 md:col-span-4">
            {hasPermission(
              user,
              FeatureFunction.SQL_SERVER_METRICS_PAGE_SPLITS_BATCH_REQUESTS,
              TypeGrant.READ
            ) && (
              <PageSplitsBatchRequests
                isLoading={isLoading}
                seriesData={
                  data?.pageSplitsDataPerBatchRequests?.map(formatData) ?? []
                }
              />
            )}
          </div>
          <div className="cols-span-2 md:col-span-4">
            {hasPermission(
              user,
              FeatureFunction.SQL_SERVER_METRICS_SQLCOMPILATIONS_SEC,
              TypeGrant.READ
            ) && (
              <SqlCompilationsSec
                isLoading={isLoading}
                seriesData={data?.sqlCompilations?.map(formatData) ?? []}
              />
            )}
          </div>
          <div className="cols-span-2 md:col-span-4">
            {hasPermission(
              user,
              FeatureFunction.SQL_SERVER_METRICS_PAGE_SPLITS_SEC,
              TypeGrant.READ
            ) && (
              <PageSplitsSec
                isLoading={isLoading}
                seriesData={data?.pageSplits?.map(formatData) ?? []}
              />
            )}
          </div>
          <div className="cols-span-2 md:col-span-4">
            {hasPermission(
              user,
              FeatureFunction.SQL_SERVER_METRICS_FULL_SCANS_SEC,
              TypeGrant.READ
            ) && (
              <FullScansSec
                isLoading={isLoading}
                seriesData={data?.fullScans?.map(formatData) ?? []}
              />
            )}
          </div>
          <div className="cols-span-2 md:col-span-4">
            {hasPermission(
              user,
              FeatureFunction.SQL_SERVER_METRICS_USER_CONNECTIONS,
              TypeGrant.READ
            ) && (
              <UserConnections
                isLoading={isLoading}
                seriesData={data?.userConnections?.map(formatData) ?? []}
              />
            )}
          </div>
        </Grid>
      </div>

      <Grid className="mt-6">
        <div className="col-span-2 space-y-4 md:col-span-6">
          <h4 className="mb-4 text-sm">Latches and locks</h4>
          <AvgLatchWait
            isLoading={isLoading}
            seriesData={data?.averageLatchWaitTime?.map(formatData) ?? []}
          />
          <LockTimeoutsSec
            isLoading={isLoading}
            seriesData={data?.lockTimeout?.map(formatData) ?? []}
          />
          <LockWaitsSec
            key={key}
            isLoading={isLoading}
            seriesData={data?.lockWaits?.map(formatData) ?? []}
          />
        </div>
        {hasPermission(
          user,
          FeatureFunction.SQL_PROPERTIES,
          TypeGrant.READ
        ) && <ServerProperties />}
      </Grid>
    </div>
  )
}

export default memo(ServerMetrics)
