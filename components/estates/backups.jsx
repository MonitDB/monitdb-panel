/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
import {
  faClock,
  faDatabase,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format, parseISO } from 'date-fns'
import React, { useEffect, useState } from 'react'

import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { getBackups } from '~/services/estates'
import { megaBytesToGigaBytes } from '~/utils/formats'
import { getIntervalTimeBetweenDates } from '~/utils/global'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

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

const Backups = ({ tabName }) => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const [isLoading, setIsLoading] = useState(true)
  const [backups, setBackups] = useState([])

  const getData = async () => {
    const { data } = await getBackups()

    if (!data) return

    // eslint-disable-next-line no-console
    console.log('backups', data)

    setBackups(data)
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    getData()
  }, [])

  if (servers?.length === 0) {
    return ''
  }

  return (
    <>
      <PageContent
        removeSidebarMargin={true}
        hideBreadcrumbs={true}
        className="flex flex-wrap items-start justify-between"
      >
        <header className="pt-8 w-full">
          <h1 className="heading-lg">{tabName}</h1>
        </header>
      </PageContent>

      <PageContent removeSidebarMargin={true}>
        <div
          className="w-full prose max-w-full
            prose-p:m-0 prose-th:align-middle prose-td:align-middle prose-tr:border prose-th:border prose-tr:border-gray-light prose-th:border-gray-light prose-td:border prose-td:border-gray-light prose-headings:m-0
             prose-ul:m-0 prose-ul:pl-0 prose-li:m-0 prose-li:pl-0 prose-th:px-2.5 prose-td:px-2.5 prose-table:table-fixed"
        >
          <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <button type="button" className="btn btn--small md:ml-auto">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Exportar
            </button>
          </header>

          <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
            {isLoading ? (
              <Loading />
            ) : (
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

                {serverEnvironments.map(
                  ({ id, typeServerEnvironmentName }, environmentIndex) => {
                    const filteredServers = filterServersByEnvironmentId(
                      id,
                      servers
                    ).map((server) => formatServer(server, { serverTypes }))

                    // eslint-disable-next-line no-console
                    const filteredBackups = backups.filter(
                      ({ ServerId }) =>
                        filteredServers.findIndex(
                          ({ id }) => id === ServerId
                        ) !== -1
                    )

                    if (filteredBackups.length === 0) {
                      return ''
                    }

                    return (
                      <tbody key={`server-${id}-${environmentIndex}`}>
                        <tr className="border-none">
                          <td
                            colSpan="12"
                            className="px-4 !border-l-0 !border-r-0"
                          >
                            <h3 className="heading-xs pt-5 pb-2">
                              {environmentIndex + 1} -{' '}
                              {typeServerEnvironmentName}
                            </h3>
                          </td>
                        </tr>
                        {filteredBackups.map(
                          (
                            {
                              database_name,
                              backup_start_date,
                              backup_finish_date,
                              backup_size,
                              backup_type,
                            },
                            index
                          ) => {
                            const intervalTime = getIntervalTime(
                              backup_start_date,
                              backup_finish_date
                            )
                            const backupSize = megaBytesToGigaBytes(backup_size)

                            return (
                              <tr key={`server-production-${index}`}>
                                <td className="border-l-4 border-gray h-[58px]">
                                  <FontAwesomeIcon
                                    icon={faDatabase}
                                    className="mr-2"
                                  />
                                  {database_name}
                                </td>
                                <td className="text-left !border-r-white">
                                  {backup_type == 'Full' && (
                                    <>
                                      <FontAwesomeIcon
                                        icon={faClock}
                                        className="mr-2 text-blue"
                                      />{' '}
                                      <span>
                                        {format(
                                          parseISO(backup_start_date),
                                          "dd MMM yyyy kk':'mm"
                                        )}
                                      </span>
                                    </>
                                  )}
                                </td>
                                <td className="text-center !border-r-white">
                                  {backup_type == 'Full' &&
                                    (intervalTime.trim() ? intervalTime : '0s')}
                                </td>
                                <td className="text-right">
                                  {backup_type == 'Full' && `${backupSize} GB`}
                                </td>
                                <td className="text-left !border-r-white">
                                  {backup_type == 'Diferencial' && (
                                    <>
                                      <FontAwesomeIcon
                                        icon={faClock}
                                        className="mr-2 text-blue"
                                      />{' '}
                                      <span>
                                        {format(
                                          parseISO(backup_start_date),
                                          "dd MMM yyyy kk':'mm"
                                        )}
                                      </span>
                                    </>
                                  )}
                                </td>
                                <td className="text-center !border-r-white">
                                  {backup_type == 'Diferencial' &&
                                    (intervalTime.trim() ? intervalTime : '0s')}
                                </td>
                                <td className="text-right">
                                  {backup_type == 'Diferencial' &&
                                    `${backupSize} GB`}
                                </td>
                                <td className="text-left !border-r-white">
                                  {backup_type == 'Log' && (
                                    <>
                                      <FontAwesomeIcon
                                        icon={faClock}
                                        className="mr-2 text-blue"
                                      />{' '}
                                      <span>
                                        {format(
                                          parseISO(backup_start_date),
                                          "dd MMM yyyy kk':'mm"
                                        )}
                                      </span>
                                    </>
                                  )}
                                </td>
                                <td className="text-center !border-r-white">
                                  {backup_type == 'Log' &&
                                    (intervalTime.trim() ? intervalTime : '0s')}
                                </td>
                                <td className="text-right">
                                  {backup_type == 'Log' && `${backupSize} GB`}
                                </td>
                              </tr>
                            )
                          }
                        )}
                      </tbody>
                    )
                  }
                )}
              </table>
            )}
          </div>
        </div>
      </PageContent>
    </>
  )
}

export default Backups
