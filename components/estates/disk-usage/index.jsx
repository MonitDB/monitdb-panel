import { faFileExport } from '@fortawesome/free-solid-svg-icons'
/* eslint-disable sonarjs/no-duplicate-string */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'

import Servers from '~/components/estates/disk-usage/servers'
import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { getDiskUsage } from '~/services/estates'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const DiskUsage = ({ tabName }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [diskUsage, setDiskUsage] = useState([])
  const [environmentExpandedIndices, setEnvironmentExpandedIndices] = useState(
    new Set()
  )

  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const handleEnvironmentExpandedIndices = useCallback(
    (index) => {
      const indices = new Set(environmentExpandedIndices)

      if (indices.has(index)) {
        indices.delete(index)
      } else {
        indices.add(index)
      }

      setEnvironmentExpandedIndices(indices)
    },
    [environmentExpandedIndices]
  )

  const getData = async () => {
    const { data } = await getDiskUsage()

    if (!data) return

    // eslint-disable-next-line no-console
    console.log('disk usage', data)

    setDiskUsage(data)
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
        <header className="pt-8 w-full flex flex-col md:flex-row md:justify-between md:items-end">
          <h1 className="heading-lg">{tabName}</h1>
          <button
            type="button"
            className="btn btn--small md:ml-auto"
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faFileExport} className="mr-2" />
            Exportar
          </button>
        </header>
      </PageContent>

      <PageContent removeSidebarMargin={true}>
        <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="space-y-3">
              {servers?.length
                ? serverEnvironments.map(
                    ({ id, typeServerEnvironmentName }, environmentIndex) => {
                      const environmentServers = filterServersByEnvironmentId(
                        id,
                        servers
                      ).map((server) => formatServer(server, { serverTypes }))

                      if (environmentServers.length === 0) return

                      return (
                        <div
                          key={`environment-${id}-${environmentIndex}-`}
                          className="w-full"
                        >
                          <button
                            type="button"
                            className={classNames(
                              `w-full py-2 px-4 bg-white border space-x-4
                    rounded-sm font-bold text-left text-sm lg:hover:border-gray`,
                              {
                                'border-gray':
                                  environmentExpandedIndices.has(
                                    environmentIndex
                                  ),
                                'border-gray-light':
                                  !environmentExpandedIndices.has(
                                    environmentIndex
                                  ),
                              }
                            )}
                            onClick={() =>
                              handleEnvironmentExpandedIndices(environmentIndex)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className={classNames('transform', {
                                'rotate-180':
                                  environmentExpandedIndices.has(
                                    environmentIndex
                                  ),
                              })}
                            />
                            <span>{typeServerEnvironmentName}</span>
                          </button>
                          <div
                            className={classNames({
                              block:
                                environmentExpandedIndices.has(
                                  environmentIndex
                                ),
                              hidden:
                                !environmentExpandedIndices.has(
                                  environmentIndex
                                ),
                            })}
                          >
                            <Servers
                              environmentServers={environmentServers}
                              diskUsage={diskUsage}
                            />
                          </div>
                        </div>
                      )
                    }
                  )
                : undefined}
            </div>
          )}
        </div>
      </PageContent>
    </>
  )
}

export default DiskUsage
