import {
  faArrowRotateRight,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'

import BlockMessage from '~/components/block-message'
import Loading from '~/components/loading/loading'
import useComponentContext from '~/services/state-manager/components'
const COMPONENT_CODE = 'LTWISACT'

function CurrentActivity(properties) {
  const { currentServer } = properties

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [activeTableRowIndex, setActiveTableRowIndex] = useState(-1)
  const { executeQueryComponent } = useComponentContext()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setData([])
    const data = await executeQueryComponent(
      COMPONENT_CODE,
      currentServer?.id || undefined
    )
    setData(data)
    setLoading(false)
  }, [currentServer?.id, executeQueryComponent])

  const refreshButton = (
    <button
      onClick={fetchData}
      className="mt-6 bg-blue text-white px-3 h-11 rounded-[5px] font-medium flex items-center gap-1 mb-6 ml-auto"
    >
      <FontAwesomeIcon
        className={`font-medium ${loading ? 'fa-spin' : ''}`}
        icon={faArrowRotateRight}
      />
      Refresh
    </button>
  )

  if (loading)
    return (
      <div>
        {refreshButton}
        <div
          style={{ height: '50vh', display: 'flex', justifyContent: 'center' }}
        >
          <Loading />
        </div>
      </div>
    )

  if (data?.length === 0)
    return (
      <div>
        {refreshButton}
        <BlockMessage
          className="mt-6"
          type="information"
          message={
            <p className="text-xs">
              <span>No current activity.</span>
            </p>
          }
        />
      </div>
    )

  if (data === undefined) return <div>No data available</div>

  return (
    <div>
      <div className="w-full min-h-96">
        {refreshButton}
        <div className="prose baleiaprose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
          <table>
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Host Name</th>
                <th>Login Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <>
                  <tr
                    key={index}
                    className={classNames(
                      'hover:bg-gray-lightest',
                      activeTableRowIndex === index && 'bg-gray-lightest'
                    )}
                    onClick={() => {
                      if (activeTableRowIndex === index)
                        setActiveTableRowIndex(-1)
                      else setActiveTableRowIndex(index)
                    }}
                  >
                    <td>
                      <button
                        type="button"
                        className="whitespace-nowrap truncate"
                      >
                        <FontAwesomeIcon
                          width={7}
                          height={7}
                          icon={faChevronRight}
                          className={classNames(
                            'mr-1 transition-all duration-150 ease-in-out',
                            {
                              'rotate-90': activeTableRowIndex === index,
                            }
                          )}
                        />
                        <span className="truncate ml-2">{item.session_id}</span>
                      </button>
                    </td>
                    <td>{item.host_name}</td>
                    <td>{item.login_name}</td>
                    <td>{item.status}</td>
                  </tr>

                  {activeTableRowIndex === index && (
                    <tr>
                      <td colSpan={4} className="p-4">
                        <div className="prose baleiaprose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
                          <table className="table-auto">
                            <tbody>
                              <tr>
                                <td>
                                  <b>CPU</b>
                                </td>
                                <td>{item.CPU}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>CPU Delta</b>
                                </td>
                                <td>{item.CPU_delta}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Blocking Session Id</b>
                                </td>
                                <td>{item.blocking_session_id || '-'}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Collection Time</b>
                                </td>
                                <td>{item.collection_time}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Database Name</b>
                                </td>
                                <td>{item.database_name}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Time</b>
                                </td>
                                <td>{item['00 00:38:26.080']}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Host Name</b>
                                </td>
                                <td>{item.host_name}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Login Name</b>
                                </td>
                                <td>{item.login_name}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Open Transaction Count</b>
                                </td>
                                <td>{item.open_tran_count}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Percent Compete</b>
                                </td>
                                <td>{item.percent_compete}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Program Name</b>
                                </td>
                                <td>{item.program_name}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Query Plan</b>
                                </td>
                                <td>{item.query_plan}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Reads</b>
                                </td>
                                <td>{item.reads}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Reads Delta</b>
                                </td>
                                <td>{item.reads_delta}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>SQL Command</b>
                                </td>
                                <td>{item.sql_command}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>SQL Text</b>
                                </td>
                                <td>{item.sql_text}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Status</b>
                                </td>
                                <td>{item.status}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Wait Information</b>
                                </td>
                                <td>{item.wait_info}</td>
                              </tr>
                              <tr>
                                <td>
                                  <b>Writes</b>
                                </td>
                                <td>{item.writes}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CurrentActivity
