/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable sonarjs/cognitive-complexity */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'

import Link from '~/components/link'
import Reveal from '~/helpers/reveal'
import { megaBytesToGigaBytes } from '~/utils/formats'
// import { getPercentage } from '~/utils/global'

const Servers = ({ environmentServers, diskUsage, expand }) => {
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
      const allEnvironmentIndices = environmentServers.map((_, index) => index)
      setServerExpandedIndices(new Set(allEnvironmentIndices))
    }
  }, [expand])

  return (
    <div className="p-3 pb-0 space-y-3">
      {environmentServers.map(({ id, serverName }, index) => {
        const filteredDiskUsage = []

        for (let disk of diskUsage) {
          if (id === disk.ServerId) {
            filteredDiskUsage.push({
              ...disk,
              serverName,
            })
          }
        }

        if (filteredDiskUsage.length === 0) {
          return ''
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
              <div className="w-full mt-3 prose max-w-full prose-p:m-0 prose-th:text-center prose-td:text-center prose-td:align-top prose-th:whitespace-nowrap prose-th:border-b-4 prose-headings:m-0 prose-td:whitespace-nowrap prose-td:text-ellipsis prose-td:overflow-hidden bg-white p-4 space-y-2">
                <table className="m-0">
                  <thead>
                    <tr>
                      <th>Disk</th>
                      <th>Used space</th>
                      <th>Capacity</th>
                      <th>Used Percentage</th>
                      <th>Free Space</th>
                      <th>Free Space (%)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDiskUsage.map((disk, index) => {
                      const usage = disk['Usage(MB)']
                      const total = disk['Total(MB)']

                      const free = disk['Free(MB)']
                      const usedPercentage = 100 - disk['Free(%)']
                      const freePercentage = disk['Free(%)']
                      return (
                        <tr key={`server-production-${index}`}>
                          <td>
                            <p>
                              <Link
                                href="/states/?tab=disk-usage"
                                className="text-blue no-underline"
                              >
                                {disk.Drive}
                              </Link>
                            </p>
                          </td>
                          <td>{megaBytesToGigaBytes(usage)} GB</td>
                          <td>
                            {megaBytesToGigaBytes(total)}
                            GB
                          </td>
                          <td>{megaBytesToGigaBytes(usedPercentage)}%</td>
                          <td>{megaBytesToGigaBytes(free)} GB</td>
                          <td>{freePercentage}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        )
      })}
    </div>
  )
}

export default Servers
