/* eslint-disable sonarjs/no-duplicate-string */
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useState } from 'react'

import Chart from '~/components/chart'
import Image from '~/components/image'

import { TemporaryDBSession } from './components/Session'
import { TemporaryDBSummary } from './components/Summary'

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
    <div id="tempdb">
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
        {activeTabId === 'usage-summary' && <TemporaryDBSummary />}
        {activeTabId === 'session' && <TemporaryDBSession />}
        {activeTabId === 'version-store' && (
          <>
            <h6 className="my-4 text-xs">
              Summary of tempdb usage by class of object
            </h6>
            <div className="bg-white min-h-96">
              <Chart
                height="100%"
                legend={{
                  show: false,
                }}
                xaxis={{
                  labels: {
                    show: false,
                  },
                }}
              />
            </div>

            <div className="mt-4">
              <h4 className="mb-4 text-sm">Performance</h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <h6 className="mb-4 text-xs">Generation rate</h6>
                  <div className="bg-white">
                    <Chart
                      legend={{
                        show: false,
                      }}
                      xaxis={{
                        labels: {
                          show: false,
                        },
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h6 className="mb-4 text-xs">Cleanup rate</h6>
                  <div className="bg-white">
                    <Chart
                      legend={{
                        show: false,
                      }}
                      xaxis={{
                        labels: {
                          show: false,
                        },
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h6 className="mb-4 text-xs">
                    Longest running transaction time
                  </h6>
                  <div className="bg-white">
                    <Chart
                      legend={{
                        show: false,
                      }}
                      xaxis={{
                        labels: {
                          show: false,
                        },
                      }}
                    />
                  </div>
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
            <div className="bg-white min-h-96">
              <Chart
                height="100%"
                legend={{
                  show: false,
                }}
                xaxis={{
                  labels: {
                    show: false,
                  },
                }}
              />
            </div>
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
            <div className="bg-white min-h-96">
              <Chart
                height="100%"
                legend={{
                  show: false,
                }}
                xaxis={{
                  labels: {
                    show: false,
                  },
                }}
              />
            </div>
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
            <div className="bg-white min-h-96">
              <Chart
                height="100%"
                legend={{
                  show: false,
                }}
                xaxis={{
                  labels: {
                    show: false,
                  },
                }}
              />
            </div>
          </>
        )}
        {activeTabId === 'files' && (
          <p className="min-h-96 flex items-center justify-center text-xs">
            <strong>No data to display</strong>
          </p>
        )}
      </div>
    </div>
  )
}

export default Temppdb
