import { Button, Col, Row, Select } from 'antd'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { useUser } from '~/hooks/index'
import {
  FeatureFunction,
  hasPermission,
  hasSomePermissions,
  TypeGrant,
} from '~/utils/hasPermission'

import BlockingProcesses from './components/blocking-processes'
import CpuUsage from './components/cpu-usage'
import Databases from './components/databases'
import ErrorLog from './components/error-log'
import MemoryUsage from './components/memory-usage'
import { Permissions } from './components/server-host-metrics'
import ServerMetrics from './components/server-host-metrics/server-metrics'
import SqlUserProcesses from './components/sql-user-processes'
import Temppdb from './components/tempdb'

const HOUR = 60
const DAY = 24 * HOUR
const HistoryInfo = ({ currentServer }) => {
  const { userState: user } = useUser()
  const router = useRouter()

  const [, setLastFetch] = useState(Date.now())

  const lastMinutesOptions = [
    { value: HOUR, label: '1 hour' },
    { value: 6 * HOUR, label: '6 hours' },
    { value: 12 * HOUR, label: '12 hours' },
    { value: 1 * DAY, label: '24 hours' },
    { value: 2 * DAY, label: '2 days' },
  ]

  const formik = useFormik({
    initialValues: {
      cpu: true,
      memory: true,
      disk: true,
      lastMinutes: Number(router.query.lastMinutes ?? 60),
    },
    onSubmit: () => {},
  })

  return (
    <div
      className="w-full flex flex-col gap-y-6 mt-6"
      style={{ overflow: 'hidden' }}
    >
      <div className="w-full flex gap-x-8 p-4 text-sm">
        <div className="flex gap-2 ml-auto">
          <Select
            className="w-40"
            name="lastMinutes"
            value={formik.values.lastMinutes}
            options={lastMinutesOptions}
            defaultValue={60}
            onChange={(value) => {
              const queryParameters = new URLSearchParams(router.query)
              queryParameters.set('lastMinutes', value)
              const newUrl = `${router.pathname}?${queryParameters.toString()}`
              router.push(newUrl)
              formik.setFieldValue('lastMinutes', value)
            }}
          />
          <Button onClick={() => setLastFetch(Date.now())}>Refresh</Button>
        </div>
      </div>

      <div id="allinstancemetrics">
        <Row gutter={16}>
          {hasPermission(user, FeatureFunction.MEMORY, TypeGrant.READ) && (
            <Col
              md={12}
              sm={24}
              style={{
                marginBottom: '16px',
              }}
            >
              <MemoryUsage currentServer={currentServer} />
            </Col>
          )}

          {hasPermission(user, FeatureFunction.CPU, TypeGrant.READ) && (
            <Col
              md={12}
              sm={24}
              style={{
                marginBottom: '16px',
              }}
            >
              <CpuUsage currentServer={currentServer} />
            </Col>
          )}
        </Row>

        <ServerMetrics />

        {hasPermission(user, FeatureFunction.DATABASES, TypeGrant.READ) && (
          <Databases currentServer={currentServer} />
        )}
        {hasSomePermissions(
          user,
          [
            FeatureFunction.TEMPDB_DATABASE,
            FeatureFunction.TEMPDB_LOGIN,
            FeatureFunction.TEMPDB_PROGRAM,
            FeatureFunction.TEMPDB_SESSION,
            FeatureFunction.TEMPDB_USAGE_SUMMARY,
          ],
          TypeGrant.READ
        ) && <Temppdb />}
        {hasPermission(user, FeatureFunction.PERMISSIONS, TypeGrant.READ) && (
          <Permissions currentServer={currentServer} />
        )}

        {hasPermission(
          user,
          FeatureFunction.BLOCKING_PROCESS_TOP_10_BY_TIME,
          TypeGrant.READ
        ) && <BlockingProcesses currentServer={currentServer} />}

        {hasPermission(
          user,
          FeatureFunction.SQL_USER_PROCESSES_TOP_10_BY_CPU,
          TypeGrant.READ
        ) && <SqlUserProcesses currentServer={currentServer} />}

        {hasPermission(user, FeatureFunction.ERROR_LOG, TypeGrant.READ) && (
          <ErrorLog currentServer={currentServer} />
        )}
      </div>
    </div>
  )
}

export default HistoryInfo
