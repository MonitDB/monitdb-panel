import { Table, Tag } from 'antd'
import moment from 'moment'

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
  {
    title: 'Event ID',
    dataIndex: 'eventid',
    key: 'eventid',
  },
  {
    title: 'Time',
    dataIndex: 'clock',
    key: 'clock',
    render: (value) => {
      return moment(Number(value)).format('HH:mm:ss')
    },
  },
  { title: 'Host Name', dataIndex: 'host', render: (value) => value.host },
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
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Object ID',
    dataIndex: 'objectid',
    key: 'objectid',
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
]

const ProblemsGetTable = (data) => {
  return <Table size="small" dataSource={data.result} columns={columns} />
}

export default ProblemsGetTable
