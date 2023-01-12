/* eslint-disable sonarjs/no-duplicate-string */
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import faker from 'faker'
import { useCallback, useState } from 'react'
import { Line } from 'react-chartjs-2'

import Reveal from '~/helpers/reveal'
import { diskData, options, waitsData } from '~/pages/dashboard/[id]'

const labelsTopQueries = Array.from({ length: 5 }, (_, index) => `8:${index}`)

const tableTopQueriesItems = labelsTopQueries.map(() => ({
  title: `SELECT user_id FROM ${faker.random.word()} WHERE meta_key = '${faker.random.word()}'`,
}))

const tableTopProceduresItems = [
  {
    title:
      'Cluster_SqlServer_Database_ConfigurationOptions_Sightings_DeleteChunk',
    duration: '46',
  },
  {
    title: 'Cluster_SqlServer_ServerWaits_UnstableSamples_DeleteChunk',
    duration: '21',
  },
  {
    title: 'Cluster_SqlServer_QueryPlans_Keys_DeleteChunk',
    duration: '20',
  },
  {
    title: 'sqbdata',
    duration: '16',
  },
  {
    title: 'Cluster_SqlServer_ServerWaits_Sightings_DeleteChunk',
    duration: '14',
  },
  {
    title:
      'SqlServerInstance_Database_ConfigurationOptions_Sightings_DeleteChunk',
    duration: '12',
  },
  {
    title: 'Cluster_Machine_Process_UnstableSamples_DeleteChunk',
    duration: '8',
  },
  {
    title: 'Cluster_SqlServer_TopQueries_Sightings_DeleteChunk',
    duration: '8',
  },
  {
    title: 'Cluster_SqlServer_TopQueries_Keys_DeleteChunk',
    duration: '8',
  },
  {
    title: 'Cluster_SqlServer_TopQueries_UnstableSamples_DeleteChunk',
    duration: '6',
  },
]

const tableTopWaitsItems = [
  {
    type: 'BACKUPIO',
    description: 'Backup task waiting for data or an available buffer',
    time: '23.264',
  },
  {
    type: 'SOS_SCHEDULER_YIELD',
    description: 'Backup task waiting for data or an available buffer',
    time: '15.724',
  },
  {
    type: 'MSQL_XP',
    time: '13.703',
    description: 'Waiting for an extended stored procedure to finish',
  },
  {
    type: 'MEMORY_ALLOCATION_EXT',
    time: '6.399',
    description: 'See MSDN for this wait description',
  },
  {
    type: 'PREEMPTIVE_OS_AUTHENTICATIONOPS',
    time: '4.140',
    description: 'SQL Server has switched to preemptive mode',
  },
  {
    type: 'BACKUPTHREAD',
    time: '4.090',
    description: 'See MSDN for this wait description',
  },
  {
    type: 'RESERVED_MEMORY_ALLOCATION_EXT',
    time: '3.321',
    description: 'See MSDN for this wait description',
  },
  {
    type: 'ASYNC_NETWORK_IO',
    time: '2.788',
    description: 'Network waiting for client to consume output buffer',
  },
  {
    type: 'PREEMPTIVE_XE_GETTARGETSTATE',
    time: '1.561',
    description: 'Network waiting for client to consume output buffer',
  },
  {
    type: 'WRITELOG',
    time: '1.472',
    description: 'SQL Server has switched to preemptive mode',
  },
]

const tabItems = [
  { title: 'Top queries', id: 'top-queries' },
  { title: 'Tracked queries (0/25)', id: 'tracked-queries' },
  { title: 'Top waits', id: 'top-waits' },
  { title: 'Top procedures', id: 'top-procedures' },
]

const Server = () => {
  const [activeTabId, setActiveTabId] = useState('top-queries')
  const [activeTableRowIndex, setActiveTableRowIndex] = useState(-1)

  const toggleActiveTableRowIndex = useCallback((index) => {
    setActiveTableRowIndex((oldIndex) => (oldIndex === index ? -1 : index))
  }, [])

  return (
    <div>
      <div className="border-b-gray-light border-b-4 mb-4 mt-4">
        {tabItems.map((tab) => (
          <button
            className={classNames('px-2 h-11 relative', {
              'after:content-[""] after:block after:bg-blue after:h-1 after:w-full after:absolute after:-bottom-1 after:left-0':
                tab.id === activeTabId,
            })}
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="w-full min-h-96">
        {activeTabId === 'top-queries' && (
          <div className="prose max-w-full prose-p:m-0 prose-td:align-top prose-td:py-4 prose-th:border-b-4 prose-headings:m-0">
            <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
              <table className="m-0 w-full overflow-x-auto">
                <thead>
                  <tr>
                    <th>Query text</th>
                    <th>Execuções</th>
                    <th>Duração (ms)</th>
                    <th>CPU (ms)</th>
                    <th>Physical reads</th>
                    <th>Logical reads</th>
                    <th>Logical writes</th>
                    <th>Memory grant (KB)</th>
                    <th>Database</th>
                  </tr>
                </thead>
                {tableTopQueriesItems.map((item, itemIndex) => (
                  <tbody
                    key={`item-${itemIndex}`}
                    className={[
                      'transition-all duration-150 ease-in-out',
                      activeTableRowIndex === itemIndex && 'bg-white',
                    ].join(' ')}
                  >
                    <tr className="border-b-0">
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleActiveTableRowIndex(itemIndex)}
                          className="whitespace-nowrap truncate"
                        >
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className={[
                              'mr-1 transition-all duration-150 ease-in-out',
                              activeTableRowIndex === itemIndex && 'rotate-90',
                            ].join(' ')}
                          />
                          <span className="truncate">{item.title}</span>
                        </button>
                      </td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                    </tr>
                    <tr
                      className={
                        itemIndex < labelsTopQueries.length - 1 &&
                        'border-b border-b-gray border-opacity-50'
                      }
                    >
                      <td colSpan={9} className="!p-0">
                        <Reveal active={activeTableRowIndex === itemIndex}>
                          <div className="p-4 border-t-2 border-t-gray bg-gray-light bg-opacity-25">
                            <div className="w-full mb-4">
                              <h4 className="!mb-2 font-bold text-base">
                                Query details
                              </h4>
                              <p className="text-xs">
                                <strong>Database:</strong> {faker.random.word()}
                                <br />
                                <strong>Program duration:</strong> 18,582 ms
                                <br />
                                <strong>Plan handle:</strong>
                                {faker.datatype.uuid()}
                                <br />
                                SQL Monitor has identified 1 issues with this
                                query. Addressing them could improve
                                performance. Top query is a fragment of a larger
                                query. Show full query.
                              </p>
                            </div>
                            <div className="w-full">
                              <h2 className="!mb-4 text-base font-bold text-gray-dark font-oxygen">
                                Histórico de execução
                              </h2>
                              <Line
                                options={options}
                                data={diskData}
                                height={50}
                              />
                            </div>
                          </div>
                        </Reveal>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        )}
        {activeTabId === 'tracked-queries' && (
          <div className="border-l-[10px] border-l-blue shadow bg-gray-default py-4 px-3 rounded-[4px]">
            <div className="flex items-start">
              <span className="font-bold rounded-full text-[10px] min-h-[18px] min-w-[18px] h-[18px] w-[18px] bg-blue text-white flex items-center justify-center mr-2">
                i
              </span>
              <p className="text-xs">
                <strong className="mr-[2px]">
                  Você não tem nenhuma consulta rastreada.
                </strong>{' '}
                Se você for um administrador, poderá acompanhar as consultas na
                guia principais consultas.{' '}
                <a
                  href="https://www.red-gate.com/SM12/tracked-queries"
                  className="text-blue ml-[2px]"
                >
                  Saber mais.
                </a>
              </p>
            </div>
          </div>
        )}
        {activeTabId === 'top-waits' && (
          <>
            <Line options={options} data={waitsData} />
            <div className="prose mt-10 max-w-full prose-p:m-0 prose-td:align-top prose-td:py-4 prose-th:border-b-4 prose-headings:m-0">
              <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                <table className="m-0 w-full overflow-x-auto">
                  <thead>
                    <tr>
                      <th>Wait type</th>
                      <th>Wait description</th>
                      <th>Waiting task</th>
                      <th>Avg. wait time (ms)</th>
                      <th>Signal wait time (ms)</th>
                    </tr>
                  </thead>
                  {tableTopWaitsItems.map((item, itemIndex) => (
                    <tbody
                      key={`item-${itemIndex}`}
                      className={[
                        'transition-all duration-150 ease-in-out',
                      ].join(' ')}
                    >
                      <tr className="border-b-0">
                        <td>
                          <button
                            type="button"
                            onClick={() => toggleActiveTableRowIndex(itemIndex)}
                            className="whitespace-nowrap truncate"
                          >
                            <FontAwesomeIcon
                              icon={faChevronRight}
                              className={[
                                'mr-1 transition-all duration-150 ease-in-out',
                                activeTableRowIndex === itemIndex &&
                                  'rotate-90',
                              ].join(' ')}
                            />
                            <span className="truncate">{item.type}</span>
                          </button>
                        </td>
                        <td>{item.description}</td>
                        <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                        <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                        <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                        <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      </tr>
                      <tr
                        className={
                          itemIndex < 8 - 1 &&
                          'border-b border-b-gray border-opacity-50'
                        }
                      >
                        <td colSpan={9} className="!p-0">
                          <Reveal active={activeTableRowIndex === itemIndex}>
                            <div className="p-4 border-t-2 border-t-gray bg-gray-light bg-opacity-25">
                              <div className="w-full mb-4">
                                <h4 className="!mb-2 font-bold text-base">
                                  Query details
                                </h4>
                                <p className="text-xs">
                                  <strong>Database:</strong>{' '}
                                  {faker.random.word()}
                                  <br />
                                  <strong>Program duration:</strong> 18,582 ms
                                  <br />
                                  <strong>Plan handle:</strong>
                                  {faker.datatype.uuid()}
                                  <br />
                                  SQL Monitor has identified 1 issues with this
                                  query. Addressing them could improve
                                  performance. Top query is a fragment of a
                                  larger query. Show full query.
                                </p>
                              </div>
                              <div className="w-full">
                                <h2 className="!mb-4 text-base font-bold text-gray-dark font-oxygen">
                                  Histórico de execução
                                </h2>
                                <Line
                                  options={options}
                                  data={diskData}
                                  height={50}
                                />
                              </div>
                            </div>
                          </Reveal>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          </>
        )}
        {activeTabId === 'top-procedures' && (
          <div className="prose max-w-full prose-p:m-0 prose-td:align-top prose-td:py-4 prose-th:border-b-4 prose-headings:m-0">
            <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
              <table className="m-0 w-full overflow-x-auto">
                <thead>
                  <tr>
                    <th>Stored procedure name</th>
                    <th>Execuções</th>
                    <th>Duração (ms)</th>
                    <th>CPU (ms)</th>
                    <th>Physical reads</th>
                    <th>Logical reads</th>
                    <th>Logical writes</th>
                    <th>Memory grant (KB)</th>
                    <th>Database</th>
                  </tr>
                </thead>
                {tableTopProceduresItems.map((item, itemIndex) => (
                  <tbody
                    key={`item-${itemIndex}`}
                    className={['transition-all duration-150 ease-in-out'].join(
                      ' '
                    )}
                  >
                    <tr className="border-b-0">
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleActiveTableRowIndex(itemIndex)}
                          className="whitespace-nowrap truncate"
                        >
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className={[
                              'mr-1 transition-all duration-150 ease-in-out',
                              activeTableRowIndex === itemIndex && 'rotate-90',
                            ].join(' ')}
                          />
                          <span className="truncate">{item.title}</span>
                        </button>
                      </td>
                      <td>
                        {faker.datatype.number({ min: 1000, max: 99_000 })}
                      </td>
                      <td>{item.duration}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                      <td>{faker.datatype.number({ min: 0, max: 100 })}</td>
                    </tr>
                    <tr
                      className={
                        itemIndex < 8 - 1 &&
                        'border-b border-b-gray border-opacity-50'
                      }
                    >
                      <td colSpan={9} className="!p-0">
                        <Reveal active={activeTableRowIndex === itemIndex}>
                          <div className="p-4 border-t-2 border-t-gray bg-gray-light bg-opacity-25">
                            <div className="w-full mb-4">
                              <h4 className="!mb-2 font-bold text-base">
                                Query details
                              </h4>
                              <p className="text-xs">
                                <strong>Database:</strong> {faker.random.word()}
                                <br />
                                <strong>Program duration:</strong> 18,582 ms
                                <br />
                                <strong>Plan handle:</strong>
                                {faker.datatype.uuid()}
                                <br />
                                SQL Monitor has identified 1 issues with this
                                query. Addressing them could improve
                                performance. Top query is a fragment of a larger
                                query. Show full query.
                              </p>
                            </div>
                            <div className="w-full">
                              <h2 className="!mb-4 text-base font-bold text-gray-dark font-oxygen">
                                Histórico de execução
                              </h2>
                              <Line
                                options={options}
                                data={diskData}
                                height={50}
                              />
                            </div>
                          </div>
                        </Reveal>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Server
