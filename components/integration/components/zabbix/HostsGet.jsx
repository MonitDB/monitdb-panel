/* eslint-disable sonarjs/no-identical-functions */
import { Table, Tag } from 'antd'

import ColumnSearch from '~/components/table/searchFilter'

const statusMapping = {
  0: { label: 'Monitored', color: 'default' },
  1: { label: 'Unmonitored', color: 'blue' },
}

const flagsMapping = {
  1: { label: 'Plain host', color: 'green' },
  3: { label: 'Discovered host', color: 'purple' },
}

const tlsMapping = {
  1: { label: '(default) No encryption', color: 'red' },
  2: { label: 'PSK', color: 'green' },
  4: { label: 'Certificate', color: 'green' },
}

const HostsGetTable = (info) => {
  const { data } = info

  const columns = [
    {
      title: 'Host ID',
      dataIndex: 'hostId',
      key: 'hostId',
    },
    {
      title: 'Host ',
      dataIndex: 'host',
      key: 'host',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...ColumnSearch('name'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        const { label, color } = statusMapping[status] || {
          label: 'Unknown',
          color: 'default',
        }
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Flags',
      dataIndex: 'flags',
      key: 'flags',
      render: (flag) => {
        const { label, color } = flagsMapping[flag] || {
          label: 'Unknown',
          color: 'default',
        }
        return <Tag color={color}>{label}</Tag>
      },
    },

    {
      title: 'Template ID',
      dataIndex: 'templateid',
      key: 'templateid',
    },

    {
      title: 'TLS Connect',
      dataIndex: 'tlsconnect',
      key: 'tlsconnect',
      render: (tls) => {
        const { label, color } = tlsMapping[tls] || {
          label: 'Unknown',
          color: 'default',
        }
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'TLS Accept',
      dataIndex: 'tlsaccept',
      key: 'tlsaccept',
      render: (tls) => {
        const { label, color } = tlsMapping[tls] || {
          label: 'Unknown',
          color: 'default',
        }
        return <Tag color={color}>{label}</Tag>
      },
    },
  ]
  return <Table size="small" dataSource={data.result} columns={columns} />
}

export default HostsGetTable
