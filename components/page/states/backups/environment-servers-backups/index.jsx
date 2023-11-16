/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable sonarjs/cognitive-complexity */
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'

import Reveal from '~/helpers/reveal'
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

  const handleServerExpandedIndices = useCallback(
    (index) => {
      const indices = new Set(serverExpandedIndices)

      if (indices.has(index)) {
        indices.delete(index)
      } else {
        indices.add(index)
      }

      setServerExpandedIndices(indices)
    },
    [serverExpandedIndices]
  )

  useEffect(() => {
    if (expand) {
      const allEnvironmentIndices = servers.map((_, index) => index)
      setServerExpandedIndices(new Set(allEnvironmentIndices))
    } else setServerExpandedIndices(new Set())
  }, [expand])

  return (
    <div className="p-3 pb-0 space-y-3">
      {servers.map(({ id, serverName }, index) => {
        const serverBackups = backups.filter((backup) => backup.ServerId === id)

        if (serverBackups.length === 0) return

        const separetedBackups = separeteBackups(serverBackups)

        const DATABASES = []

        for (let backup in separetedBackups) {
          DATABASES.push({
            database_name: backup,
            ...separetedBackups[backup],
          })
        }

        return (
          <div key={`environment-server-${index}`}>
            <button
              type="button"
              className={classNames(
                `w-full py-2 px-4 bg-white border space-x-4
                        rounded-sm font-bold text-left text-sm lg:hover:border-gray`,
                {
                  'border-gray': serverExpandedIndices.has(index),
                  'border-gray-light': !serverExpandedIndices.has(index),
                }
              )}
              onClick={() => handleServerExpandedIndices(index)}
              disabled={serverBackups.length === 0}
            >
              <FontAwesomeIcon
                icon={faChevronDown}
                className={classNames(
                  'transition-all duration-300 ease-in-out transform',
                  {
                    'rotate-180': serverExpandedIndices.has(index),
                  }
                )}
              />
              <span>{serverName}</span>
            </button>
            <Reveal active={serverExpandedIndices.has(index)}>
              <div
                className="w-full prose max-w-full mt-3
              prose-p:m-0 prose-th:align-middle prose-td:align-middle prose-tr:border prose-th:border prose-tr:border-gray-light prose-th:border-gray-light prose-td:border prose-td:border-gray-light prose-headings:m-0
               prose-ul:m-0 prose-ul:pl-0 prose-li:m-0 prose-li:pl-0 prose-th:px-2.5 prose-td:px-2.5 prose-table:table-fixed"
              >
                <div className="py-4 px-8 bg-white">
                  <table className="m-0">
                    <thead>
                      <tr>
                        <th
                          rowSpan={2}
                          className="px-4 align-middle border-r border-r-gray-light w-1/5"
                        >
                          Database
                        </th>
                        <th colSpan={3} className="text-center w-[26.666%]">
                          <span className="w-2.5 h-2.5 bg-gray-dark mr-1 inline-block relative top-[0.5px]" />
                          Full
                        </th>
                        <th colSpan={3} className="text-center w-[26.666%]">
                          <span className="w-2.5 h-2.5 bg-blue mr-1 inline-block relative top-[0.5px]" />
                          Differential
                        </th>
                        <th colSpan={3} className="text-center w-[26.666%]">
                          <span className="w-2.5 h-2.5 bg-blue bg-opacity-60 mr-1 inline-block relative top-[0.5px]" />
                          Log
                        </th>
                      </tr>
                      <tr>
                        <th className="lowercase first-letter:uppercase text-left !border-r-white">
                          Start date
                        </th>
                        <th className="lowercase first-letter:uppercase text-center !border-r-white">
                          Duration
                        </th>
                        <th className="lowercase first-letter:uppercase text-right">
                          Size
                        </th>
                        <th className="lowercase first-letter:uppercase text-left !border-r-white">
                          Start date
                        </th>
                        <th className="lowercase first-letter:uppercase text-center !border-r-white">
                          Duration
                        </th>
                        <th className="lowercase first-letter:uppercase text-right">
                          Size
                        </th>
                        <th className="lowercase first-letter:uppercase text-left !border-r-white">
                          Start date
                        </th>
                        <th className="lowercase first-letter:uppercase text-center !border-r-white">
                          Duration
                        </th>
                        <th className="lowercase first-letter:uppercase text-right">
                          Size
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {DATABASES?.map((DATABASE) => {
                        const fullBackup = DATABASE.Full ? DATABASE.Full[0] : {}
                        const diferentialBackup = DATABASE.Diferencial
                          ? DATABASE.Diferencial[0]
                          : {}
                        const logBackup = DATABASE.Log ? DATABASE.Log[0] : {}

                        const DATA = {
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
                          Diferential: {
                            lastBackup: {
                              backup_start_date:
                                diferentialBackup.backup_start_date,
                              backup_size: diferentialBackup.backup_size,
                              intervalTime:
                                diferentialBackup.backup_start_date &&
                                diferentialBackup.backup_finish_date
                                  ? getIntervalTime(
                                      diferentialBackup.backup_start_date,
                                      diferentialBackup.backup_finish_date
                                    ).trim() || '0s'
                                  : '',
                            },
                            allBackups: DATABASE.Diferencial || [],
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
                          <tr
                            key={DATABASE.database_name}
                            className="cursor-pointer"
                            onClick={() =>
                              onSetBackupsModal({
                                isOpen: true,
                                data: DATA,
                                id,
                                serverName,
                                databaseName: DATABASE.database_name,
                              })
                            }
                          >
                            <td>{DATABASE.database_name}</td>
                            <td className="text-left !border-r-white">
                              {DATA.Full.lastBackup.backup_start_date ? (
                                <>
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="mr-2 text-blue"
                                  />{' '}
                                  <span>
                                    {format(
                                      parseISO(
                                        DATA.Full.lastBackup.backup_start_date
                                      ),
                                      dateFormat
                                    )}
                                  </span>
                                </>
                              ) : undefined}
                            </td>
                            <td className="text-center !border-r-white">
                              {DATA.Full.lastBackup.intervalTime}
                            </td>
                            <td className="text-right">
                              {DATA.Full.lastBackup.backup_size
                                ? `${(
                                    DATA.Full.lastBackup.backup_size /
                                    1024 /
                                    1024 /
                                    1024
                                  ).toFixed(2)} GB`
                                : undefined}
                            </td>
                            <td className="text-left !border-r-white">
                              {DATA.Diferential.lastBackup.backup_start_date ? (
                                <>
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="mr-2 text-blue"
                                  />{' '}
                                  <span>
                                    {format(
                                      parseISO(
                                        DATA.Diferential.lastBackup
                                          .backup_start_date
                                      ),
                                      dateFormat
                                    )}
                                  </span>
                                </>
                              ) : undefined}
                            </td>
                            <td className="text-center !border-r-white">
                              {DATA.Diferential.lastBackup.intervalTime}
                            </td>
                            <td className="text-right">
                              {DATA.Diferential.lastBackup.backup_size
                                ? `${(
                                    DATA.Diferential.lastBackup.backup_size /
                                    1024 /
                                    1024 /
                                    1024
                                  ).toFixed(2)} GB`
                                : ''}
                            </td>
                            <td className="text-left !border-r-white">
                              {DATA.Log.lastBackup.backup_start_date ? (
                                <>
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="mr-2 text-blue"
                                  />{' '}
                                  <span>
                                    {format(
                                      parseISO(
                                        DATA.Log.lastBackup.backup_start_date
                                      ),
                                      dateFormat
                                    )}
                                  </span>
                                </>
                              ) : undefined}
                            </td>
                            <td className="text-center !border-r-white">
                              {DATA.Log.lastBackup.intervalTime}
                            </td>
                            <td className="text-right">
                              {DATA.Log.lastBackup.backup_size
                                ? `${(
                                    DATA.Log.lastBackup.backup_size /
                                    1024 /
                                    1024 /
                                    1024
                                  ).toFixed(2)} GB`
                                : ''}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          </div>
        )
      })}
    </div>
  )
}

export default EnvironmentServersBackups
