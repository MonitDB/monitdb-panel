/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable sonarjs/cognitive-complexity */
import { Collapse, Table } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

import { separeteBackups } from '~/utils/backups'
import { getIntervalTimeBetweenDates } from '~/utils/global'

export const dateFormat = "dd MMM yyyy kk':'mm"

function getIntervalTime(backup_start_date, backup_finish_date) {
  const intervalTimeBetweenDates = getIntervalTimeBetweenDates(
    new Date(backup_start_date),
    new Date(backup_finish_date)
  )

  return `${
    intervalTimeBetweenDates.hours ? `${intervalTimeBetweenDates.hours}h` : ''
  } ${
    intervalTimeBetweenDates.minutes
      ? `${intervalTimeBetweenDates.minutes}m`
      : ''
  } ${
    intervalTimeBetweenDates.seconds
      ? `${intervalTimeBetweenDates.seconds}s`
      : ``
  }`
}

const EnvironmentServersBackups = ({
  servers,
  onSetBackupsModal,
  backups,
  expand,
}) => {
  const [serverExpandedIndices, setServerExpandedIndices] = useState(new Set())

  useEffect(() => {
    if (expand) {
      const allEnvironmentIndices = servers.map((_, index) => index)
      setServerExpandedIndices(allEnvironmentIndices)
    } else setServerExpandedIndices(new Set())
  }, [expand])

  return (
    <div className="p-3 pb-0 space-y-3">
      <Collapse
        activeKey={serverExpandedIndices}
        onChange={setServerExpandedIndices}
        items={servers
          .map(({ id, serverName }, index) => {
            const serverBackups = backups.filter(
              (backup) => backup.ServerId === id
            )

            if (serverBackups.length === 0) return

            const separetedBackups = separeteBackups(serverBackups)

            const DATABASES = []

            for (let backup in separetedBackups) {
              DATABASES.push({
                database_name: backup,
                ...separetedBackups[backup],
              })
            }

            return {
              label: serverName,
              key: index,
              children: DATABASES.map((DATABASE, index) => {
                const fullBackup = DATABASE.Full ? DATABASE.Full[0] : {}
                const differentialBackup = DATABASE.Differential
                  ? DATABASE.Differential[0]
                  : {}
                const logBackup = DATABASE.Log ? DATABASE.Log[0] : {}

                const DATA = {
                  database_name: DATABASE.database_name,

                  Full: {
                    lastBackup: {
                      backup_start_date: fullBackup.backup_start_date,
                      backup_size: fullBackup.backup_size,
                      intervalTime:
                        fullBackup.backup_start_date &&
                        fullBackup.backup_finish_date
                          ? getIntervalTime(
                              fullBackup.backup_start_date,
                              fullBackup.backup_finish_date
                            ).trim() || '0s'
                          : '',
                    },
                    allBackups: DATABASE.Full || [],
                  },
                  Differential: {
                    lastBackup: {
                      backup_start_date: differentialBackup.backup_start_date,
                      backup_size: differentialBackup.backup_size,
                      intervalTime:
                        differentialBackup.backup_start_date &&
                        differentialBackup.backup_finish_date
                          ? getIntervalTime(
                              differentialBackup.backup_start_date,
                              differentialBackup.backup_finish_date
                            ).trim() || '0s'
                          : '',
                    },
                    allBackups: DATABASE.Differential || [],
                  },
                  Log: {
                    lastBackup: {
                      backup_start_date: logBackup.backup_start_date,
                      backup_size: logBackup.backup_size,
                      intervalTime:
                        logBackup.backup_start_date &&
                        logBackup.backup_finish_date
                          ? getIntervalTime(
                              logBackup.backup_start_date,
                              logBackup.backup_finish_date
                            ).trim() || '0s'
                          : '',
                    },
                    allBackups: DATABASE.Log || [],
                  },
                }

                return (
                  <Table
                    size="middle"
                    dataSource={[DATA]}
                    key={index}
                    pagination={false}
                    bordered
                    onRow={(data) => {
                      return {
                        style: {
                          cursor: 'pointer',
                        },
                        onClick: () => {
                          onSetBackupsModal({
                            isOpen: true,
                            data,
                            id,
                            serverName,
                            databaseName: DATABASE.database_name,
                          })
                        },
                      }
                    }}
                  >
                    <Table.Column
                      title="Database"
                      align="left"
                      dataIndex={'database_name'}
                      key={'dbName'}
                      width={200}
                    />
                    <Table.ColumnGroup
                      title={
                        <>
                          <span
                            className="w-2.5 h-2.5 bg-gray-dark mr-1 inline-block relative top-[0.5px]"
                            style={{
                              backgroundColor: 'rgba(80, 70, 229, 0.85)',
                            }}
                          />
                          Full
                        </>
                      }
                    >
                      <Table.Column
                        dataIndex={'Full'}
                        title="Start Date"
                        align="left"
                        render={(value) =>
                          value?.lastBackup?.backup_start_date &&
                          moment(value?.lastBackup?.backup_start_date).format(
                            'DD/MM/YYYY HH:mm:ss'
                          )
                        }
                      />
                      <Table.Column
                        dataIndex={'Full'}
                        title="Duration"
                        align="left"
                        render={(value) => (
                          <>{value?.lastBackup?.intervalTime}</>
                        )}
                      />
                      <Table.Column
                        dataIndex={'Full'}
                        title="Size"
                        align="left"
                        render={(value) => (
                          <>
                            {value?.lastBackup?.backup_size &&
                              `${(
                                value.lastBackup.backup_size /
                                (1024 * 1024 * 1024)
                              ).toFixed(2)} GB`}
                          </>
                        )}
                      />
                    </Table.ColumnGroup>
                    <Table.ColumnGroup
                      title={
                        <>
                          <span
                            className="w-2.5 h-2.5 mr-1 inline-block relative top-[0.5px]"
                            style={{
                              backgroundColor: 'rgba(0, 227, 150, 0.85)',
                            }}
                          />
                          Differential
                        </>
                      }
                    >
                      <Table.Column
                        dataIndex={'Differential'}
                        title="Start Date"
                        render={(value) =>
                          value?.lastBackup?.backup_start_date &&
                          moment(value?.lastBackup?.backup_start_date).format(
                            'DD/MM/YYYY HH:mm:ss'
                          )
                        }
                        align="left"
                      />
                      <Table.Column
                        dataIndex={'Differential'}
                        title="Duration"
                        render={(value) => (
                          <>{value?.lastBackup?.intervalTime}</>
                        )}
                        align="left"
                      />
                      <Table.Column
                        dataIndex={'Differential'}
                        title="Size"
                        align="left"
                        render={(value) => (
                          <>
                            {value?.lastBackup?.backup_size &&
                              `${(
                                value.lastBackup.backup_size /
                                (1024 * 1024 * 1024)
                              ).toFixed(2)} GB`}
                          </>
                        )}
                      />
                    </Table.ColumnGroup>
                    <Table.ColumnGroup
                      title={
                        <>
                          <span
                            className="w-2.5 h-2.5  mr-1 inline-block relative top-[0.5px]"
                            style={{
                              backgroundColor: 'rgba(254, 176, 25, 0.85)',
                            }}
                          />
                          Log
                        </>
                      }
                    >
                      <Table.Column
                        dataIndex={'Log'}
                        title="Start Date"
                        align="left"
                        render={(value) =>
                          value?.lastBackup?.backup_start_date &&
                          moment(value?.lastBackup?.backup_start_date).format(
                            'DD/MM/YYYY HH:mm:ss'
                          )
                        }
                      />
                      <Table.Column
                        dataIndex={'Log'}
                        title="Duration"
                        align="left"
                        render={(value) => (
                          <>{value?.lastBackup?.intervalTime}</>
                        )}
                      />
                      <Table.Column
                        dataIndex={'Log'}
                        title="Size"
                        align="left"
                        render={(value) => (
                          <>
                            {value?.lastBackup?.backup_size &&
                              `${(
                                value.lastBackup.backup_size /
                                (1024 * 1024 * 1024)
                              ).toFixed(2)} GB`}
                          </>
                        )}
                      />
                    </Table.ColumnGroup>
                  </Table>
                )
              }),
            }
          })
          .filter((item) => item?.children)}
      />
    </div>
  )
}

export default EnvironmentServersBackups
