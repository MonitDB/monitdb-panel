import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useState } from 'react'
import { Line } from 'react-chartjs-2'

import Image from '~/components/image'
import {
  GB_DATA,
  GB_OPTIONS,
  KB_DATA,
  KB_OPTIONS,
  MS_DATA,
  MS_OPTIONS,
} from '~/utils/chart'

const tabDataItems = [
  {
    title: 'Usage summary',
    id: 'usage-summary',
  },
  {
    title: 'Session',
    id: 'session',
  },
  {
    title: 'Version store',
    id: 'version-store',
  },
  {
    title: 'Login',
    id: 'login',
  },
  {
    title: 'Program',
    id: 'program',
  },
  {
    title: 'Database',
    id: 'database',
  },
  {
    title: 'Files',
    id: 'files',
  },
]

const Temppdb = () => {
  const [activeTabId, setActiveTabId] = useState('usage-summary')
  return (
    <div>
      <div className="grid grid-cols-[18px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAdCAMAAACZrWzKAAAAM1BMVEUAAAChoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGz8IU4AAAAEHRSTlMAECAwQFBgcICPn6+/z9/vIxqCigAAAI9JREFUKM/FkUsOhDAMQ93Gbd0Pbe5/WhYgJGC2aLzLs6LEMgBYaWO5u7uvUXMEAOTpD20ZkP+Q/oE533QzAKndnNmIU4FFkqTCcBA1w0PWBLmvLp6LpPr6Oo6NNx0GIJabMxQBHBVFJklKPEdo1kceq/M4uUZVJsmkOtbn7QS96pkKAGDq24W67v8aebWFHeQVHSKfjqHNAAAAAElFTkSuQmCC"
          width="18"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">tempdb</h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <div className="flex items-center border-b-4 border-gray-light">
        {tabDataItems.map((tab) => (
          <button
            key={tab.id}
            className={classNames(
              "relative py-1.5 px-4 text-center after:left-0 after:content-[''] after:block after:w-full after:h-1  after:absolute after:-bottom-1",
              {
                'after:bg-blue': tab.id === activeTabId,
              }
            )}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="w-full min-h-96">
        {activeTabId === 'usage-summary' && (
          <>
            <h6 className="my-4 text-xs">
              Summary of tempdb usage by class of object
            </h6>
            <Line options={GB_OPTIONS} data={GB_DATA} />
          </>
        )}

        {activeTabId === 'session' && (
          <>
            <p className="my-4 text-xs flex items-center gap-1">
              Top 10 sessions using tempdb by total allocated space
              <span className="w-[15px] h-[15px] bg-blue text-white flex items-center justify-center rounded-full cursor-pointer">
                ?
              </span>
            </p>
            <div>
              <Line options={KB_OPTIONS} data={KB_DATA} />
            </div>
            <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px] prose-th:whitespace-nowrap prose-td:whitespace-nowrap prose-th:px-2 prose-th:h-[35px] prose-th:text-xs prose-tr:cursor-pointer overflow-x-auto">
              <table className="m-0 py-4 prose-tr:last:!border-b overflow-x-auto">
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>Login time</th>
                    <th>Login</th>
                    <th>Host</th>
                    <th>Database</th>
                    <th>Program name</th>
                    <th>User allocations</th>
                    <th>User deallocations</th>
                    <th>Internal allocations</th>
                    <th>Internal deallocations</th>
                    <th>User deferred</th>
                    <th>Total net</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="flex items-center">
                        <span
                          className="inline-block w-[13px] h-[13px] rounded-full mr-1"
                          style={{
                            backgroundColor: 'rgb(124, 181, 236)',
                          }}
                        ></span>
                        <FontAwesomeIcon
                          width={6}
                          height={6}
                          icon={faChevronRight}
                        />
                        <span className="ml-2">55</span>
                      </div>
                    </td>
                    <td>12 Jan 2023 16:27:52</td>
                    <td>SMDEMO\sqlmonitor_readonly</td>
                    <td>SSC-WEB-STAGING</td>
                    <td>RedGateMonitor</td>
                    <td>SQL Monitor - Repository - Read Only</td>
                    <td>0 B</td>
                    <td>0 B</td>
                    <td>1.4 MB</td>
                    <td>1.4 MB</td>
                    <td>0 B</td>
                    <td>0 B</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex items-center">
                        <span
                          className="inline-block w-[13px] h-[13px] rounded-full mr-1"
                          style={{
                            backgroundColor: 'rgb(67, 67, 72)',
                          }}
                        ></span>
                        <FontAwesomeIcon
                          width={6}
                          height={6}
                          icon={faChevronRight}
                        />
                        <span className="ml-2">70</span>
                      </div>
                    </td>
                    <td>12 Jan 2023 17:43:12</td>
                    <td>SMDEMO\sqlmonitor</td>
                    <td>SQM-SQLMONITOR</td>
                    <td>RedGateMonitor</td>
                    <td>SQL Monitor - Repository - Read Write</td>
                    <td>0 B</td>
                    <td>0 B</td>
                    <td>192 KB</td>
                    <td>0 B</td>
                    <td>0 B</td>
                    <td>192 KB</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTabId === 'version-store' && (
          <>
            <h6 className="my-4 text-xs">
              Summary of tempdb usage by class of object
            </h6>
            <Line options={KB_OPTIONS} data={KB_DATA} />

            <div className="mt-4">
              <h4 className="mb-4 text-sm">Performance</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <h6 className="mb-4 text-xs">Generation rate</h6>
                  <Line options={KB_OPTIONS} data={KB_DATA} />
                </div>
                <div>
                  <h6 className="mb-4 text-xs">Cleanup rate</h6>
                  <Line options={KB_OPTIONS} data={KB_DATA} />
                </div>
                <div>
                  <h6 className="mb-4 text-xs">
                    Longest running transaction time
                  </h6>
                  <Line options={MS_OPTIONS} data={MS_DATA} />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTabId === 'login' && (
          <>
            <p className="my-4 text-xs flex items-center gap-1">
              Tempdb allocation by SQL login
              <span className="w-[15px] h-[15px] bg-blue text-white flex items-center justify-center rounded-full cursor-pointer">
                ?
              </span>
            </p>
            <Line options={KB_OPTIONS} data={KB_DATA} />
          </>
        )}

        {activeTabId === 'program' && (
          <>
            <p className="my-4 text-xs flex items-center gap-1">
              Tempdb allocation by program
              <span className="w-[15px] h-[15px] bg-blue text-white flex items-center justify-center rounded-full cursor-pointer">
                ?
              </span>
            </p>
            <Line options={KB_OPTIONS} data={KB_DATA} />
          </>
        )}
        {activeTabId === 'database' && (
          <>
            <p className="my-4 text-xs flex items-center gap-1">
              Tempdb allocation by databse
              <span className="w-[15px] h-[15px] bg-blue text-white flex items-center justify-center rounded-full cursor-pointer">
                ?
              </span>
            </p>
            <Line options={KB_OPTIONS} data={KB_DATA} />
          </>
        )}
      </div>
    </div>
  )
}

export default Temppdb
