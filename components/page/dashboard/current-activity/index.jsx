// import 'ace-builds/src-min-noconflict/ext-language_tools'
// import 'ace-builds/src-min-noconflict/mode-mysql'
// import 'ace-builds/src-noconflict/ace'
// import 'ace-builds/src-noconflict/theme-github'
import '@uiw/react-textarea-code-editor/dist.css'

import {
  faArrowRotateRight,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useState } from 'react'

const AceEditor = dynamic(
  () => import('react-ace').then((module_) => module_.default),
  { ssr: false }
)

import BlockMessage from '~/components/block-message'
import { Select } from '~/components/form'
import Loading from '~/components/loading/loading'
import Pagination from '~/components/pagination/pagination'
import { GenericTable } from '~/components/table/genericTable'
import useComponentContext from '~/services/state-manager/components'
import { useExecQueryContext } from '~/services/state-manager/execQuery'
import { paginateArray } from '~/utils/array'
const componentsOption = [
  { value: 'LTWISACT', label: 'WHO IS ACTIVE' },
  { value: 'LTWHO2', label: 'WHO2' },
]

const [WHO_IS_ACT, WHO_IS_ACT2] = componentsOption

function CurrentActivity(properties) {
  const { currentServer } = properties

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [page, setPage] = useState(1)
  const [componentCode, setComponentCode] = useState(WHO_IS_ACT.value)
  const [activeTableRowIndex, setActiveTableRowIndex] = useState(-1)
  const { executeQueryComponent } = useComponentContext()

  const [sqlCode, setSqlCode] = useState(
    `SELECT * FROM Historic.Historic_Parameter;`
  )

  useEffect(() => {
    fetchData()
  }, [fetchData, componentCode])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setData([])
    setPage(1)
    const result = await executeQueryComponent(
      componentCode,
      currentServer?.id || undefined
    )
    data[componentCode] = result
    setData(data)
    setLoading(false)
  }, [componentCode, currentServer?.id, data, executeQueryComponent])

  const { execQuery, loadingExecuteQuery, queryResult } = useExecQueryContext()

  const headerSection = (
    <>
      <br />
      <h3 className="font-bold mb-6">Execute Query</h3>
      <div className="col-span-2 bg-white border border-gray-light p-4 lg:col-span-12">
        <AceEditor
          id="editor"
          aria-label="editor"
          mode="mysql"
          theme="github"
          name="editor"
          fontSize={16}
          minLines={15}
          maxLines={10}
          width="100%"
          showPrintMargin={false}
          showGutter
          placeholder="Write your Query here..."
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
          }}
          value={sqlCode}
          onChange={setSqlCode}
          showLineNumbers
        />

        {/* {sqlCode && <Code code={sqlCode} language="javascript" />} */}
        <div className="w-full flex">
          <button
            type="button"
            className="btn mt-4 ml-auto"
            onClick={() => {
              execQuery(sqlCode, currentServer.id)
            }}
          >
            Run
          </button>
          <br />
          <br />
        </div>
        <GenericTable data={queryResult} loading={loadingExecuteQuery} />
      </div>
      <br />
      <br />
      <h3 className="font-bold mb-6">Current Activity</h3>
      <div className="flex flex-row justify-between items-center items-center gap-2 w-60 ml-auto">
        <Select
          className="w-40"
          name={'component'}
          options={componentsOption}
          onChange={setComponentCode}
          value={componentCode}
        />

        <button
          onClick={() => {
            setComponentCode(componentCode)
            fetchData()
          }}
          className="mt-6 bg-blue text-white px-3 h-11 rounded-[5px] font-medium flex items-center gap-1 mb-6"
        >
          <FontAwesomeIcon
            className={`font-medium ${loading ? 'fa-spin' : ''}`}
            icon={faArrowRotateRight}
          />
          Refresh
        </button>
      </div>
    </>
  )

  if (loading)
    return (
      <div>
        {headerSection}
        <div
          style={{ height: '50vh', display: 'flex', justifyContent: 'center' }}
        >
          <Loading />
        </div>
      </div>
    )

  if (data[componentCode]?.length === 0 || !data[componentCode])
    return (
      <div>
        {headerSection}
        <BlockMessage
          className="mt-6"
          type="information"
          message={
            <p className="text-xs">
              <span>No current activity. Refresh to see updates!</span>
            </p>
          }
        />
      </div>
    )

  if (componentCode === WHO_IS_ACT.value)
    return (
      <div>
        <div className="w-full min-h-96">
          {headerSection}
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
                {paginateArray(data[componentCode], 1, 10).map(
                  (item, index) => (
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
                            <span className="truncate ml-2">
                              {item.session_id}
                            </span>
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
                  )
                )}
              </tbody>
            </table>
            {data[componentCode].length > 10 && (
              <Pagination
                currentPage={page}
                totalResults={data[componentCode].length}
                onChangePage={setPage}
              />
            )}
          </div>
        </div>
      </div>
    )

  if (componentCode === WHO_IS_ACT2.value)
    return (
      <div>
        <div className="w-full min-h-96">
          {headerSection}
          <div className="prose baleiaprose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
            <table>
              <thead>
                <tr>
                  <th>SPID</th>
                  <th>Host Name</th>
                  <th>Login Name</th>
                  <th>DB Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginateArray(data[componentCode], page, 10).map(
                  (item, index) => (
                    <>
                      <tr
                        key={index}
                        className={classNames(
                          'hover:bg-gray-lightest',
                          activeTableRowIndex === index && 'bg-gray-lightest'
                        )}
                        // eslint-disable-next-line sonarjs/no-identical-functions
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
                            <span className="truncate ml-2">
                              {item.SPID[0]}
                            </span>
                          </button>
                        </td>
                        <td>{item.HostName}</td>
                        <td>{item.Login}</td>
                        <td>{item.DBName}</td>
                        <td>{item.Status}</td>
                      </tr>

                      {activeTableRowIndex === index && (
                        <tr>
                          <td colSpan={4} className="p-4">
                            <div className="prose baleiaprose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
                              <table className="table-auto">
                                <tbody>
                                  <tr>
                                    <td>
                                      <b>Command</b>
                                    </td>
                                    <td>{item.Command}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>CPU Time</b>
                                    </td>
                                    <td>{item.CPUTime}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>DiskIO</b>
                                    </td>
                                    <td>{item.DiskIO || '-'}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>Last Batch</b>
                                    </td>
                                    <td>{item.LastBatch}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>Program Name</b>
                                    </td>
                                    <td>{item.ProgramName}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>Request Id</b>
                                    </td>
                                    <td>{item.REQUESTID}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                )}
              </tbody>
            </table>
            {data[componentCode].length > 10 && (
              <Pagination
                currentPage={page}
                totalResults={data[componentCode].length}
                onChangePage={setPage}
              />
            )}
          </div>
        </div>
      </div>
    )
}

export default CurrentActivity
