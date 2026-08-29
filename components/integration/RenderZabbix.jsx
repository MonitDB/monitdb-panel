/* eslint-disable sonarjs/no-small-switch */
import { Result, Typography } from 'antd'
import { useEffect, useState } from 'react'

import { execIntegration } from '~/services/integration'

import { default as Loading } from '../loading'
import { GenericTable } from '../table/genericTable'
import HostsGetTable from './components/zabbix/HostsGet'
import ProblemsGetTable from './components/zabbix/ProblemsGet'

const renderTable = (data) => {
  switch (data?.method) {
    case 'problem.get':
      return <ProblemsGetTable data={data} />
    case 'host.get':
      return <HostsGetTable data={data} />
    default:
      return (
        <GenericTable
          data={data.result}
          pagination={{
            hideOnSinglePage: true,
            total: data.result.length,
          }}
        />
      )
  }
}

const RenderZabbix = ({ id }) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchIntegration = async () => {
      try {
        setLoading(true)
        setError()
        const result = await execIntegration(id)
        setData(result)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchIntegration()
    } else {
      setLoading(false)
    }
  }, [id])

  if (loading) return <Loading />

  if (data?.error || error)
    return (
      <Result
        status="error"
        title="Error to load the integration"
        subTitle={data?.error?.data || error?.message}
      />
    )
  return (
    <>
      <Typography.Title level={4}>Zabbix</Typography.Title>
      {renderTable(data)}
    </>
  )
}

export default RenderZabbix
