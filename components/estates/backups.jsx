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
            prose-p:m-0 prose-td:align-top prose-th:border prose-th:border-gray-light prose-td:border prose-td:border-gray-light prose-headings:m-0
             prose-ul:m-0 prose-ul:pl-0 prose-li:m-0 prose-li:pl-0 prose-th:pr-2 prose-td:pr-2"
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
                      className="px-4 align-middle border-r border-r-gray-light"
                    >
                      Banco de dados
                    </th>
                    <th className="!border-r-white"></th>
                    <th className="text-center !border-r-white">Full</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th className="lowercase first-letter:uppercase text-left !border-r-white">
                      Data de início
                    </th>
                    <th className="lowercase first-letter:uppercase text-center !border-r-white">
                      Duração
                    </th>
                    <th className="lowercase first-letter:uppercase text-right">
                      Tamanho
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
                        <tr>
                          <td
                            colSpan="12"
                            className="px-4 !border-l-0 !border-r-0"
                          >
                            <h3 className="heading-xs pt-5">
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
                            },
                            index
                          ) => {
                            const intervalTimeBetweenDates =
                              getIntervalTimeBetweenDates(
                                new Date(backup_start_date),
                                new Date(backup_finish_date)
                              )

                            const intervalTime = `${
                              intervalTimeBetweenDates.hours
                                ? `${intervalTimeBetweenDates.hours}h`
                                : ''
                            } ${
                              intervalTimeBetweenDates.minutes
                                ? `${intervalTimeBetweenDates.minutes}m`
                                : ''
                            } ${
                              intervalTimeBetweenDates.seconds
                                ? `${intervalTimeBetweenDates.seconds}s`
                                : ''
                            }`

                            const backupSize = megaBytesToGigaBytes(backup_size)

                            return (
                              <tr key={`server-production-${index}`}>
                                <td className="border-l-4 border-gray">
                                  <FontAwesomeIcon
                                    icon={faDatabase}
                                    className="mr-2"
                                  />
                                  {database_name}
                                </td>
                                <td className="text-left !border-r-white">
                                  <FontAwesomeIcon
                                    icon={faClock}
                                    className="mr-2 text-blue"
                                  />{' '}
                                  <span>
                                    {format(
                                      parseISO(backup_start_date),
                                      'dd MMM yyyy'
                                    )}
                                  </span>
                                </td>
                                <td className="text-center !border-r-white">
                                  {intervalTime}
                                </td>
                                <td className="text-right">{backupSize} GB</td>
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
