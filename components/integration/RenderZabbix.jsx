import { Result, Table, Typography } from 'antd'

import { useIntegration } from '~/hooks/index'

import { default as Loading } from '../loading'

const columns = [
  {
    title: 'Event ID',
    dataIndex: 'eventid',
    key: 'eventid',
  },
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
  },
  {
    title: 'Object',
    dataIndex: 'object',
    key: 'object',
  },
  {
    title: 'Object ID',
    dataIndex: 'objectid',
    key: 'objectid',
  },
  {
    title: 'Clock',
    dataIndex: 'clock',
    key: 'clock',
  },
  {
    title: 'NS',
    dataIndex: 'ns',
    key: 'ns',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Acknowledged',
    dataIndex: 'acknowledged',
    key: 'acknowledged',
  },
  {
    title: 'Severity',
    dataIndex: 'severity',
    key: 'severity',
  },
]

const RenderZabbix = ({ id }) => {
  const { data, error, loading } = useIntegration({ id })

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
      <Typography.Title level={4}>Zabbix - Problems</Typography.Title>
      <Table size="small" dataSource={data.result} columns={columns} />
    </>
  )
}

export default RenderZabbix
