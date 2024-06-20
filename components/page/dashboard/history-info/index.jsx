import { Button, Col, Row, Select } from 'antd'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import RdpButton from '~/components/rdpButton'
import SshButon from '~/components/sshButton'
import { useUser } from '~/hooks/index'
import { getServerMetrics } from '~/services/servers'
import {
  FeatureFunction,
  hasPermission,
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

  const [lastFetch, setLastFetch] = useState(Date.now())
  const [serverMetrics, setServerMetrics] = useState()
  useEffect(() => {
    if (router?.query?.id) {
      const fetch = async () => {
        try {
          const { data } = await getServerMetrics({ id: router?.query?.id })
          setServerMetrics(data)
        } catch {
          /* empty */
        }
      }

      fetch()
    }
  }, [router?.query?.id])

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
      lastMinutes: Number(router.query.lastMinutes),
    },
    onSubmit: () => {},
  })

  return (
    <div
      className="w-full flex flex-col gap-y-6 mt-6"
      style={{ overflow: 'hidden' }}
    >
      <div className="w-full flex gap-x-8 p-4 border border-gray-light bg-white text-sm">
        <div className="flex gap-2 mr-auto">
          {serverMetrics?.osProperties?.['host_platform'] === 'Windows' && (
            <RdpButton
              serverName={currentServer.serverName}
              address={currentServer.serverHost}
            />
          )}

          {serverMetrics?.osProperties?.['host_platform'] === 'Linux' && (
            <SshButon
              serverName={currentServer.serverName}
              address={currentServer.serverHost}
            />
          )}
        </div>

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

        {/* <Server /> */}
        <ServerMetrics key={lastFetch} />
        <Permissions currentServer={currentServer} />
        <div>
          <br />
          <h4 className="mb-4 text-sm">OS Properties</h4>
          <div className="w-full mb-4 prose max-w-full prose-p:m-0 prose-td:align-top prose-tr:border-gray-light prose-headings:m-0">
            <table className="m-0 py-4 prose-tr:last:!border-b">
              <tbody>
                <tr>
                  <td>Edition</td>
                  <td>{serverMetrics?.osProperties?.['OS_Version']}</td>
                </tr>
                <tr>
                  <td>Version</td>
                  <td> {serverMetrics?.osProperties?.['OS_Release']}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Temppdb />
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

        {hasPermission(user, FeatureFunction.DATABASES, TypeGrant.READ) && (
          <Databases
            key={router.query.lastMinutes}
            currentServer={currentServer}
          />
        )}
      </div>
    </div>
  )
}

export default HistoryInfo
