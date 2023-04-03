/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable sonarjs/cognitive-complexity */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useCallback, useState } from 'react'

import Link from '~/components/link'
import Reveal from '~/helpers/reveal'
import { getPercentage } from '~/utils/global'

const Servers = ({ environmentServers, diskUsage }) => {
  console.log('environmentServers', environmentServers, 'diskUsage', diskUsage)
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

  return (
    <div className="p-3 pb-0 space-y-3">
      {environmentServers.map(
        ({ id, serverName, typeServerEnvironmentName }, index) => {
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
                        <th>Disco</th>
                        <th>Espaço usado</th>
                        <th>Capacidade</th>
                        <th>Porcentagem usada</th>
                        <th>Espaço livre</th>
                        <th>Espaço livre porcentagem</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredDiskUsage.map((disk, index) => (
                        <tr key={`server-production-${index}`}>
                          <td>
                            <p>
                              <Link
                                href="/estates/?tab=disk-usage"
                                className="text-blue no-underline"
                              >
                                {disk.Drive ? `${disk.Drive}:` : disk.Volume}
                              </Link>
                            </p>
                          </td>
                          <td>{disk['Usage(MB)']} MB</td>
                          <td>{disk['Total(MB)']} MB</td>
                          <td>
                            {getPercentage(
                              disk['Usage(MB)'],
                              disk['Total(MB)']
                            ).toFixed(2)}
                            %
                          </td>
                          <td>{disk['Livre(MB)']} MB</td>
                          <td>{disk['Livre(%)']}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </div>
          )
        }
      )}
    </div>
  )
}

export default Servers
