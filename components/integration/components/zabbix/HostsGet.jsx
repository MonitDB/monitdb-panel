/* eslint-disable sonarjs/no-identical-functions */
import { Table, Tag } from 'antd'

import useColumnSearch from '~/components/table/useColumnSearch'

const statusMapping = {
  0: { label: 'Monitored', color: 'default' },
  1: { label: 'Unmonitored', color: 'blue' },
}
const maintenceStatusMapping = {
  0: { label: 'No maintenance', color: 'default' },
  1: { label: 'Maintenance in effect', color: 'blue' },
}

const flagsMapping = {
  0: { label: 'Plain host', color: 'green' },
  3: { label: 'Discovered host', color: 'purple' },
}

const tlsMapping = {
  1: { label: '(default) No encryption', color: 'red' },
  2: { label: 'PSK', color: 'green' },
  4: { label: 'Certificate', color: 'green' },
}

const HostsGetTable = (info) => {
  const { data } = info

  const hostSearch = useColumnSearch('host')
  const nameSearch = useColumnSearch('name')

  const columns = [
    {
      title: 'Host ID',
      dataIndex: 'hostid',
      key: 'hostId',
    },
    {
      title: 'Host ',
      dataIndex: 'host',
      key: 'host',
      ...hostSearch,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...nameSearch,
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
        const { label, color } = statusMapping[Number(status)] || {
          label: 'Unknown',
          color: 'default',
        }
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Maintence Status',
      dataIndex: 'maintenance_status',
      render: (status) => {
        const { label, color } = maintenceStatusMapping[Number(status)] || {
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
        const { label, color } = flagsMapping[Number(flag)] || {
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
      dataIndex: 'tls_connect',
      key: 'tlsconnect',
      render: (tls) => {
        const { label, color } = tlsMapping[Number(tls)] || {
          label: 'Unknown',
          color: 'default',
        }
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'TLS Accept',
      dataIndex: 'tls_accept',
      key: 'tlsaccept',
      render: (tls) => {
        const { label, color } = tlsMapping[Number(tls)] || {
          label: 'Unknown',
          color: 'default',
        }
        return <Tag color={color}>{label}</Tag>
      },
    },
  ]
  return (
    <Table
      size="small"
      dataSource={data.result}
      columns={columns}
      pagination={{
        total: data.result.length,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
    />
  )
}

export default HostsGetTable
