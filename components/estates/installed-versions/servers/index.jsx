import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import React, { useCallback, useState } from 'react'

import Reveal from '~/helpers/reveal'

function Servers({ environmentServers, serversVerions }) {
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
    <>
      <div className="p-4 pb-0 space-y-2">
        {environmentServers.map(({ id, serverName }) => {
          const serverVersions = serversVerions.filter(
            ({ ServerId }) => ServerId === id
          )
          if (serverVersions.length === 0) return
          return (
            <>
              <button
                key={`server-${id}`}
                type="button"
                className={classNames(
                  `w-full py-2 px-4 bg-white border space-x-4
                        rounded-sm font-bold text-left text-sm lg:hover:border-gray`,
                  {
                    'border-gray': serverExpandedIndices.has(id),
                    'border-gray-light': !serverExpandedIndices.has(id),
                  }
                )}
                onClick={() => handleServerExpandedIndices(id)}
              >
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={classNames(
                    'transition-all duration-300 ease-in-out transform',
                    {
                      'rotate-180': serverExpandedIndices.has(id),
                    }
                  )}
                />
                <span>{serverName}</span>
              </button>
              <Reveal active={serverExpandedIndices.has(id)}>
                <div className="w-full prose max-w-full prose-p:m-0 prose-th:text-center prose-td:text-center prose-td:align-top prose-th:border-b-4 prose-headings:m-0 prose-td:whitespace-nowrap prose-td:text-ellipsis prose-td:overflow-hidden prose-table:table-fixed bg-white p-4 space-y-2">
                  <table key={id} className="m-0">
                    <thead>
                      <tr>
                        <th>Edition</th>
                        <th>Version</th>
                        {/* <th>Status | Nº da versão</th> */}
                        <th>Latest update available</th>
                        <th>End of main support</th>
                      </tr>
                    </thead>
                    <tbody key={`server-${id}`}>
                      {serverVersions.map(
                        (
                          {
                            Version,
                            Edition,
                            SuportEndDate,
                            LastUpdate,
                            ProductLevel,
                            LinkUpdate,
                          },
                          index
                        ) => (
                          <tr key={`server-production-${index}`}>
                            <td>{Edition}</td>
                            <td>{Version}</td>
                            {/* <td>
                                        <div className="w-full flex items-center space-x-4">
                                          <FontAwesomeIcon
                                            icon={faUpload}
                                            className="text-lg text-gray-dark"
                                          />
                                          <p>
                                            RTM CU29, June 14, 2022
                                            <br />
                                            <span className="text-xs">
                                              14.0.3445.2
                                            </span>
                                          </p>
                                        </div>
                                      </td> */}
                            <td>
                              <a
                                href={LinkUpdate}
                                className="inline-flex items-center space-x-2 text-blue no-underline"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <FontAwesomeIcon icon={faDownload} />
                                <span>
                                  {ProductLevel} {LastUpdate}
                                </span>
                              </a>
                              {/* <p>
                                          <span className="text-xs">
                                            Released 13 days ago on 20 Sep 2022
                                          </span>
                                        </p> */}
                            </td>
                            <td>
                              {format(parseISO(SuportEndDate), 'dd MMM yyyy')}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </>
          )
        })}
      </div>
    </>
  )
}

export default Servers
