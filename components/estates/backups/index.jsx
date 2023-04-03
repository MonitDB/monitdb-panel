/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'
import { Portal } from 'react-portal'

import EnvironmentServers from '~/components/estates/backups/environment-servers-backups'
import BackupsModal from '~/components/estates/backups/modal'
import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { getBackups } from '~/services/estates'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const Backups = ({ tabName }) => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const [environmentExpandedIndices, setEnvironmentExpandedIndices] = useState(
    new Set()
  )
  const [backupsModal, setBackupsModal] = useState({
    isOpen: false,
    data: undefined,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [backups, setBackups] = useState([])

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

  const getData = useCallback(async () => {
    const { data } = await getBackups()

    if (!data) return

    // eslint-disable-next-line no-console

    setBackups(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                              environmentExpandedIndices.has(environmentIndex),
                            hidden:
                              !environmentExpandedIndices.has(environmentIndex),
                          })}
                        >
                          <EnvironmentServers
                            backups={backups}
                            servers={environmentServers}
                            onSetBackupsModal={setBackupsModal}
                          />
                        </div>
                      </div>
                    )
                  }
                )
              : undefined}
          </div>
        )}
      </PageContent>
      <Portal>
        <BackupsModal
          modal={backupsModal}
          onSetBackupsModal={setBackupsModal}
        />
      </Portal>
    </>
  )
}

export default Backups
