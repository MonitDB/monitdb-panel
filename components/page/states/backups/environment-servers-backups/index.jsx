/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable react-hooks/exhaustive-deps */
import { Collapse, Table } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { separeteBackups } from '~/utils/backups'
import { getIntervalTimeBetweenDates } from '~/utils/global'

const StyledTable = styled(Table)`
  .ant-table-tbody > tr:nth-child(odd) {
    background-color: #ffffff;
  }
  .ant-table-tbody > tr:nth-child(even) {
    background-color: #f7f7f7;
  }
`

export const dateFormat = 'DD/MM/YYYY HH:mm:ss'

const getIntervalTime = (start, finish) => {
  if (!start || !finish) return ''
  const interval = getIntervalTimeBetweenDates(
    new Date(start),
    new Date(finish)
  )

  return `${interval.hours ? `${interval.hours}h ` : ''}${
    interval.minutes ? `${interval.minutes}m ` : ''
  }${`${interval.seconds}s`}`.trim()
}

const renderColumns = () => [
  {
    title: 'Database',
    dataIndex: 'database_name',
    key: 'database_name',
    width: 180,
  },
  {
    title: (
      <>
        <span
          className="w-2.5 h-2.5 bg-gray-dark mr-1 inline-block relative top-[0.5px]"
          style={{
            backgroundColor: 'rgba(80, 70, 229, 0.85)',
          }}
        />
        Full
      </>
    ),
    children: [
      {
        title: 'Start Date',
        dataIndex: ['Full', 'lastBackup', 'backup_start_date'],
        key: 'fullStartDate',
        width: 200,
        render: (value) => value && moment(value).format(dateFormat),
      },
      {
        title: 'Duration',
        dataIndex: ['Full', 'lastBackup', 'intervalTime'],
        key: 'fullDuration',
        width: 100,
      },
      {
        title: 'Size',
        dataIndex: ['Full', 'lastBackup', 'backup_size'],
        key: 'fullSize',
        width: 100,
        render: (size) =>
          size ? `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB` : '',
      },
    ],
  },
  {
    title: (
      <>
        <span
          className="w-2.5 h-2.5 mr-1 inline-block relative top-[0.5px]"
          style={{
            backgroundColor: 'rgba(0, 227, 150, 0.85)',
          }}
        />
        Differential
      </>
    ),
    children: [
      {
        title: 'Start Date',
        dataIndex: ['Differential', 'lastBackup', 'backup_start_date'],
        key: 'diffStartDate',
        width: 200,
        render: (value) => value && moment(value).format(dateFormat),
      },
      {
        title: 'Duration',
        dataIndex: ['Differential', 'lastBackup', 'intervalTime'],
        key: 'diffDuration',
        width: 100,
      },
      {
        title: 'Size',
        dataIndex: ['Differential', 'lastBackup', 'backup_size'],
        key: 'diffSize',
        width: 100,
        render: (size) =>
          size ? `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB` : '',
      },
    ],
  },
  {
    title: (
      <>
        <span
          className="w-2.5 h-2.5  mr-1 inline-block relative top-[0.5px]"
          style={{
            backgroundColor: 'rgba(254, 176, 25, 0.85)',
          }}
        />
        Log
      </>
    ),
    children: [
      {
        title: 'Start Date',
        dataIndex: ['Log', 'lastBackup', 'backup_start_date'],
        key: 'logStartDate',
        width: 200,
        render: (value) => value && moment(value).format(dateFormat),
      },
      {
        title: 'Duration',
        dataIndex: ['Log', 'lastBackup', 'intervalTime'],
        key: 'logDuration',
        width: 100,
      },
      {
        title: 'Size',
        dataIndex: ['Log', 'lastBackup', 'backup_size'],
        key: 'logSize',
        width: 100,
        render: (size) =>
          size ? `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB` : '',
      },
    ],
  },
]

const EnvironmentServersBackups = ({
  servers,
  onSetBackupsModal,
  backups,
  expand,
}) => {
  const [serverExpandedIndices, setServerExpandedIndices] = useState([])

  useEffect(() => {
    setServerExpandedIndices(expand ? servers.map((_, index) => index) : [])
  }, [expand, servers])

  const handleRowClick = (serverId, serverName, databaseName, data) => {
    onSetBackupsModal({
      isOpen: true,
      data,
      id: serverId,
      serverName,
      databaseName,
    })
  }

  return (
    <div className="p-3 pb-0 space-y-3">
      <Collapse
        activeKey={serverExpandedIndices}
        onChange={setServerExpandedIndices}
        items={servers.map(({ id, serverName }, index) => {
          const serverBackups = backups.filter(
            (backup) => backup.ServerId === id
          )
          if (serverBackups.length === 0) return

          const separatedBackups = separeteBackups(serverBackups)
          const databases = Object.keys(separatedBackups).map(
            (databaseName) => {
              const fullBackup = separatedBackups[databaseName].Full?.[0] || {}
              const diffBackup =
                separatedBackups[databaseName].Differential?.[0] || {}
              const logBackup = separatedBackups[databaseName].Log?.[0] || {}

              return {
                database_name: databaseName,
                Full: {
                  lastBackup: {
                    backup_start_date: fullBackup.backup_start_date,
                    backup_size: fullBackup.backup_size,
                    intervalTime:
                      getIntervalTime(
                        fullBackup.backup_start_date,
                        fullBackup.backup_finish_date
                      ) ?? '0s',
                  },
                },
                Differential: {
                  lastBackup: {
                    backup_start_date: diffBackup.backup_start_date,
                    backup_size: diffBackup.backup_size,
                    intervalTime:
                      getIntervalTime(
                        diffBackup.backup_start_date,
                        diffBackup.backup_finish_date
                      ) ?? '0s',
                  },
                },
                Log: {
                  lastBackup: {
                    backup_start_date: logBackup.backup_start_date,
                    backup_size: logBackup.backup_size,
                    intervalTime:
                      getIntervalTime(
                        logBackup.backup_start_date,
                        logBackup.backup_finish_date
                      ) ?? '0s',
                  },
                },
              }
            }
          )

          return {
            label: serverName,
            key: index,
            children: (
              <StyledTable
                dataSource={databases}
                columns={renderColumns()}
                pagination={false}
                bordered
                onRow={(record) => ({
                  onClick: () =>
                    handleRowClick(
                      id,
                      serverName,
                      record.database_name,
                      record
                    ),
                  style: {
                    cursor: 'pointer',
                  },
                })}
                style={{
                  '--table-zebra-odd-bg': '#f5f5f5', // Tonalidade mais escura para linhas ímpares
                  '--table-zebra-even-bg': '#ffffff', // Cor normal para linhas pares
                }}
                rowClassName={(record, index) =>
                  index % 2 === 1 ? 'zebra-odd' : 'zebra-even'
                }
              />
            ),
          }
        })}
      />
    </div>
  )
}

export default EnvironmentServersBackups
