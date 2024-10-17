import { Result, Table, Tag, Typography } from 'antd'

import { useIntegration } from '~/hooks/index'

import { default as Loading } from '../loading'

const severityMapping = {
  0: { label: 'Not Classified', color: 'default' },
  1: { label: 'Information', color: 'blue' },
  2: { label: 'Warning', color: 'orange' },
  3: { label: 'Average', color: 'gold' },
  4: { label: 'High', color: 'red' },
  5: { label: 'Disaster', color: 'volcano' },
}

const sourceMapping = {
  0: { label: 'Trigger Created', color: 'green' },
  3: { label: 'Internal Event', color: 'purple' },
  4: { label: 'Service Status Update', color: 'cyan' },
}

const acknowledgedMapping = {
  0: { label: 'Not Acknowledged', color: 'red' },
  1: { label: 'Acknowledged', color: 'green' },
}

const suppressedMapping = {
  0: { label: 'Normal State', color: 'blue' },
  1: { label: 'Suppressed', color: 'orange' },
}

const columns = [
  { title: 'Host Name', dataIndex: 'host', render: (value) => value.host },
  {
    title: 'Event ID',
    dataIndex: 'eventid',
    key: 'eventid',
  },
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
    render: (source) => {
      const { label, color } = sourceMapping[source] || {
        label: 'Unknown',
        color: 'default',
      }
      return <Tag color={color}>{label}</Tag>
    },
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
    render: (acknowledged) => {
      const { label, color } = acknowledgedMapping[acknowledged] || {
        label: 'Unknown',
        color: 'default',
      }
      return <Tag color={color}>{label}</Tag>
    },
  },
  {
    title: 'Suppressed',
    dataIndex: 'suppressed',
    key: 'suppressed',
    render: (suppressed) => {
      const { label, color } = suppressedMapping[suppressed] || {
        label: 'Unknown',
        color: 'default',
      }
      return <Tag color={color}>{label}</Tag>
    },
  },

  {
    title: 'Severity',
    dataIndex: 'severity',
    key: 'severity',
    render: (severity) => {
      const { label, color } = severityMapping[severity] || {
        label: 'Unknown',
        color: 'default',
      }
      return <Tag color={color}>{label}</Tag>
    },
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
