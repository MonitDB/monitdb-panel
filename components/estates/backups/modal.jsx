import { faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format, parseISO } from 'date-fns'
import React from 'react'

import { dateFormat } from '~/components/estates/backups/environment-servers-backups'
import { megaBytesToGigaBytes } from '~/utils/formats'

function DatabaseBackupsModal({ modal: { isOpen, data }, onSetModalData }) {
  function getMostAmountOfArrayBackups() {
    let arrayBackupsAmount = 0
    for (let key in data) {
      if (
        data[key].allBackups &&
        data[key].allBackups.length > 0 &&
        data[key].allBackups.length > arrayBackupsAmount
      ) {
        arrayBackupsAmount = data[key].allBackups.length
      }
    }

    return arrayBackupsAmount
  }

  if (!isOpen) return <></>

  const arraySize = Array.from({ length: getMostAmountOfArrayBackups() })

  return (
    <div className="fixed flex items-center justify-center top-0 left-0 w-full min-h-full h-full z-[100]">
      <button
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
        onClick={() => {
          onSetModalData({ ...data, isOpen: false })
        }}
      />
      <div className="relative py-10 w-[90%] bg-white">
        <button
          className="w-4 h-4 absolute top-5 right-5 z-[1]"
          onClick={() => {
            onSetModalData({ ...data, isOpen: false })
          }}
        >
          <i className="absolute block w-full h-[2px] rotate-45 bg-black bg-opacity-75" />
          <i className="absolute block  w-full h-[2px] -rotate-45 bg-black bg-opacity-75" />
        </button>
        <div className="relative flex items-center justify-center prose max-w-full prose-p:m-0 prose-th:align-middle prose-td:align-middle prose-th:border prose-th:border-l-0 prose-td:border prose-td:border-t-0 prose-td:border-l-0 prose-th:border-gray-light prose-td:border-gray-light prose-thead:mt-0 prose-headings:m-0 prose-ul:m-0 prose-ul:pl-0 prose-li:m-0 prose-li:pl-0 prose-th:px-2.5 prose-td:px-2.5 prose-table:border-l prose-table:border-gray-light prose-table:table-fixed prose-table:border-separate prose-table:border-spacing-0">
          <div className="p-8 bg-white max-h-[80vh] overflow-auto">
            <table className="m-0">
              <thead className="bg-white sticky -top-[32px]">
                <tr>
                  <th
                    colSpan={3}
                    className="text-center w-[26.666%] !border-b-0"
                  >
                    <span className="w-2.5 h-2.5 bg-gray-dark mr-1 inline-block relative top-[0.5px]" />
                    Full
                  </th>
                  <th
                    colSpan={3}
                    className="text-center w-[26.666%] !border-b-0"
                  >
                    <span className="w-2.5 h-2.5 bg-blue mr-1 inline-block relative top-[0.5px]" />
                    Differential
                  </th>
                  <th
                    colSpan={3}
                    className="text-center w-[26.666%] !border-b-0"
                  >
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
                {arraySize.map((_, index) => {
                  const FULL = data.Full.allBackups[index] || {}
                  const DIFERENTIAL = data.Diferential.allBackups[index] || {}
                  const LOG = data.Log.allBackups[index] || {}
                  return (
                    <tr key={`backups-modal-${index}`}>
                      <td className="text-left !border-r-white">
                        {FULL.backup_start_date ? (
                          <>
                            <FontAwesomeIcon
                              icon={faClock}
                              className="mr-2 text-blue"
                            />{' '}
                            <span>
                              {format(
                                parseISO(FULL.backup_start_date),
                                dateFormat
                              )}
                            </span>
                          </>
                        ) : undefined}
                      </td>
                      <td className="text-center !border-r-white">
                        {FULL.intervalTime}
                      </td>
                      <td className="text-right">
                        {FULL.backup_size
                          ? `${megaBytesToGigaBytes(FULL.backup_size)} GB`
                          : undefined}
                      </td>
                      <td className="text-left !border-r-white">
                        {DIFERENTIAL.backup_start_date ? (
                          <>
                            <FontAwesomeIcon
                              icon={faClock}
                              className="mr-2 text-blue"
                            />{' '}
                            <span>
                              {format(
                                parseISO(DIFERENTIAL.backup_start_date),
                                dateFormat
                              )}
                            </span>
                          </>
                        ) : undefined}
                      </td>
                      <td className="text-center !border-r-white">
                        {DIFERENTIAL.intervalTime}
                      </td>
                      <td className="text-right">
                        {DIFERENTIAL.backup_size
                          ? `${DIFERENTIAL.backup_size} GB`
                          : ''}
                      </td>
                      <td className="text-left !border-r-white">
                        {LOG.backup_start_date ? (
                          <>
                            <FontAwesomeIcon
                              icon={faClock}
                              className="mr-2 text-blue"
                            />{' '}
                            <span>
                              {format(
                                parseISO(LOG.backup_start_date),
                                dateFormat
                              )}
                            </span>
                          </>
                        ) : undefined}
                      </td>
                      <td className="text-center !border-r-white">
                        {LOG.intervalTime}
                      </td>
                      <td className="text-right">
                        {LOG.backup_size ? `${LOG.backup_size} GB` : ''}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatabaseBackupsModal
