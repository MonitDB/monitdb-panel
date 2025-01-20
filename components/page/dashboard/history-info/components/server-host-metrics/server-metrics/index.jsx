/* eslint-disable sonarjs/cognitive-complexity */
import { Col, Row } from 'antd'
import { useRouter } from 'next/router'
import { memo, useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useSingleDashboard, useUser } from '~/hooks/index'
import useLogContext from '~/services/state-manager/logs'
import {
  FeatureFunction,
  hasPermission,
  hasSomePermissions,
  TypeGrant,
} from '~/utils/hasPermission'

import AvgLatchWait from './avg-latch-wait'
import BatchRequests from './batch-requests'
import FullScansSec from './full-scans-sec'
import LockTimeoutsSec from './lock-timeouts-sec'
import LockWaitsSec from './lock-waits-sec'
import PageSplitsBatchRequests from './page-splits-batch-requests'
import PageSplitsSec from './page-splits-sec'
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
  const { userState: user } = useUser()

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

  useEffect(fetchData, [fetchData, lastMinutes])

  return (
    <div className="mt-6" key={key} id="sql-server-metrics">
      {hasSomePermissions(user, [
        FeatureFunction.SQL_SERVER_METRICS_BATCH_REQUESTS,
        FeatureFunction.SQL_SERVER_METRICS_SQLCOMPILATIONS_BATCH_REQUESTS,
        FeatureFunction.SQL_SERVER_METRICS_PAGE_SPLITS_BATCH_REQUESTS,
        FeatureFunction.SQL_SERVER_METRICS_SQLCOMPILATIONS_SEC,
        FeatureFunction.SQL_SERVER_METRICS_PAGE_SPLITS_SEC,
        FeatureFunction.SQL_SERVER_METRICS_FULL_SCANS_SEC,
        FeatureFunction.SQL_SERVER_METRICS_USER_CONNECTIONS,
      ]) && (
        <>
          <h3 className="font-bold mb-6">SQL Server metrics</h3>
          <div>
            <h4 className="mb-6 text-sm">General</h4>
            <Row gutter={[16, 16]}>
              {hasPermission(
                user,
                FeatureFunction.SQL_SERVER_METRICS_BATCH_REQUESTS,
                TypeGrant.READ
              ) && (
                <Col xs={24} md={12} lg={8}>
                  <BatchRequests
                    isLoading={isLoading}
                    seriesData={data?.batchRequest?.map(formatData) ?? []}
                    group={'opa'}
                  />
                </Col>
              )}
              {hasPermission(
                user,
                FeatureFunction.SQL_SERVER_METRICS_SQLCOMPILATIONS_BATCH_REQUESTS,
                TypeGrant.READ
              ) && (
                <Col xs={24} md={12} lg={8}>
                  <SqlCompilationsBatchRequests
                    isLoading={isLoading}
                    seriesData={
                      data?.sqlCompilationsPerBatchRequests?.map(formatData) ??
                      []
                    }
                    group={'opa'}
                  />
                </Col>
              )}
              {hasPermission(
                user,
                FeatureFunction.SQL_SERVER_METRICS_PAGE_SPLITS_BATCH_REQUESTS,
                TypeGrant.READ
              ) && (
                <Col xs={24} md={12} lg={8}>
                  <PageSplitsBatchRequests
                    isLoading={isLoading}
                    seriesData={
                      data?.pageSplitsDataPerBatchRequests?.map(formatData) ??
                      []
                    }
                  />
                </Col>
              )}
              {hasPermission(
                user,
                FeatureFunction.SQL_SERVER_METRICS_SQLCOMPILATIONS_SEC,
                TypeGrant.READ
              ) && (
                <Col xs={24} md={12} lg={8}>
                  <SqlCompilationsSec
                    isLoading={isLoading}
                    seriesData={data?.sqlCompilations?.map(formatData) ?? []}
                  />
                </Col>
              )}
              {hasPermission(
                user,
                FeatureFunction.SQL_SERVER_METRICS_PAGE_SPLITS_SEC,
                TypeGrant.READ
              ) && (
                <Col xs={24} md={12} lg={8}>
                  <PageSplitsSec
                    isLoading={isLoading}
                    seriesData={data?.pageSplits?.map(formatData) ?? []}
                  />
                </Col>
              )}
              {hasPermission(
                user,
                FeatureFunction.SQL_SERVER_METRICS_FULL_SCANS_SEC,
                TypeGrant.READ
              ) && (
                <Col xs={24} md={12} lg={8}>
                  <FullScansSec
                    isLoading={isLoading}
                    seriesData={data?.fullScans?.map(formatData) ?? []}
                  />
                </Col>
              )}
              {hasPermission(
                user,
                FeatureFunction.SQL_SERVER_METRICS_USER_CONNECTIONS,
                TypeGrant.READ
              ) && (
                <Col xs={24} md={12} lg={8}>
                  <UserConnections
                    isLoading={isLoading}
                    seriesData={data?.userConnections?.map(formatData) ?? []}
                  />
                </Col>
              )}
            </Row>
          </div>
        </>
      )}

      {hasSomePermissions(
        user,
        [
          FeatureFunction.LATCHES_AND_LOCKS_AVG_LATCH_WAIT,
          FeatureFunction.LATCHES_AND_LOCKS_LOCKS_TIMEOUTS_SEC,
          FeatureFunction.LATCHES_AND_LOCKS_LOCKS_WAITS_SEC,
        ],
        TypeGrant.READ
      ) && (
        <>
          <Row>
            <h4 className="mb-4 mt-6 text-sm">Latches and locks</h4>
          </Row>
          <Row gutter={[16, 16]} className="mt-6">
            {hasPermission(
              user,
              FeatureFunction.LATCHES_AND_LOCKS_AVG_LATCH_WAIT,
              TypeGrant.READ
            ) && (
              <Col xs={24} md={12} lg={8}>
                <AvgLatchWait
                  isLoading={isLoading}
                  seriesData={data?.averageLatchWaitTime?.map(formatData) ?? []}
                />
              </Col>
            )}
            {hasPermission(
              user,
              FeatureFunction.LATCHES_AND_LOCKS_LOCKS_TIMEOUTS_SEC,
              TypeGrant.READ
            ) && (
              <Col xs={24} md={12} lg={8}>
                <LockTimeoutsSec
                  isLoading={isLoading}
                  seriesData={data?.lockTimeout?.map(formatData) ?? []}
                />
              </Col>
            )}

            {hasPermission(
              user,
              FeatureFunction.LATCHES_AND_LOCKS_LOCKS_WAITS_SEC,
              TypeGrant.READ
            ) && (
              <Col xs={24} md={12} lg={8}>
                <LockWaitsSec
                  key={key}
                  isLoading={isLoading}
                  seriesData={data?.lockWaits?.map(formatData) ?? []}
                />
              </Col>
            )}
          </Row>
        </>
      )}
    </div>
  )
}

export default memo(ServerMetrics)
