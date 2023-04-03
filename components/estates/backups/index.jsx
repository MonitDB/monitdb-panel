/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useCallback, useState } from 'react'
import { Portal } from 'react-portal'

import EnvironmentServers from '~/components/estates/backups/environment-servers-backups'
import BackupsModal from '~/components/estates/backups/modal'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
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
                              environmentExpandedIndices.has(environmentIndex),
                            'border-gray-light':
                              !environmentExpandedIndices.has(environmentIndex),
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
                              environmentExpandedIndices.has(environmentIndex),
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
