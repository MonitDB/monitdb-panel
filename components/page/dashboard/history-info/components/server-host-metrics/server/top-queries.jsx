import { notification } from 'antd'
import classNames from 'classnames'
import { useCallback, useEffect, useState } from 'react'

import Reveal from '~/helpers/reveal'
import { useSingleDashboard } from '~/hooks/index'
import useLogContext from '~/services/state-manager/logs'

export const TopQueries = () => {
  const { currentServer } = useSingleDashboard()
  const { getTopQueries } = useLogContext()

  const [data, setData] = useState([])
  const [, setLoading] = useState(false)

  const [activeTableRowIndex] = useState(-1)
  // const toggleActiveTableRowIndex = useCallback((index) => {
  //   setActiveTableRowIndex((oldIndex) => (oldIndex === index ? -1 : index))
  // }, [])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTopQueries(currentServer.id)
      setData(data)
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }, [currentServer.id, getTopQueries])

  useEffect(fetchData, [fetchData])

  return (
    <>
      <div className="prose max-w-full prose-p:m-0 prose-td:align-top prose-td:py-4 prose-th:border-b-4 prose-headings:m-0">
        <div className="py-4 px-8 bg-white overflow-x-auto">
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
            {data?.map((item, itemIndex) => (
              <tbody
                key={`item-${itemIndex}`}
                className={classNames(
                  'transition-all duration-150 ease-in-out',
                  {
                    'bg-white': activeTableRowIndex === itemIndex,
                  }
                )}
              >
                <tr className="border-b-0">
                  {/* <td>
                    <button
                      type="button"
                      onClick={() => toggleActiveTableRowIndex(itemIndex)}
                      className="whitespace-nowrap truncate"
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className={classNames(
                          'mr-1 transition-all duration-150 ease-in-out',
                          {
                            'rotate-90': activeTableRowIndex === itemIndex,
                          }
                        )}
                      />

                      <span className="truncate">{item?.query}</span>
                    </button>
                  </td>
                  <td>{item?.count}</td>
                  <td>
                    {new Date(item?.log?.lastRequestStartTime).getTime() -
                      new Date(item?.log?.createDate).getTime()}
                  </td>
                  <td>{item?.log.cpu}</td>
                  <td>{item?.log.reads}</td>
                  <td>{item?.log.logicalReads}</td>
                  <td>{item?.log.writes}</td>
                  <td>{}</td>
                  <td>{item?.log.dbName}</td> */}
                </tr>
                <tr
                //   className={classNames({
                //     'border-b border-b-gray border-opacity-50':
                //       itemIndex < labelsTopQueries.length - 1,
                //   })}
                >
                  <td colSpan={9} className="!p-0">
                    <Reveal active={activeTableRowIndex === itemIndex}>
                      <div className="p-4 border-t-2 border-t-gray bg-gray-light bg-opacity-25">
                        <div className="w-full mb-4">
                          <h4 className="!mb-2 font-bold text-base">
                            Query details
                          </h4>
                          <p className="text-xs">
                            {/* <strong>Database:</strong> {faker.random.word()} */}
                            <br />
                            <strong>Program duration:</strong>{' '}
                            {new Date(
                              item?.log?.lastRequestStartTime
                            ).getTime() -
                              new Date(item?.log?.createDate).getTime()}
                            <br />
                            <strong>Plan handle:</strong>
                            {/* {faker.datatype.uuid()} */}
                            <br />
                            SQL Monitor has identified 1 issues with this query.
                            Addressing them could improve performance. Top query
                            is a fragment of a larger query. Show full query.
                          </p>
                        </div>
                        <div className="w-full">
                          <h2 className="!mb-4 text-base font-bold text-gray-dark font-oxygen">
                            Histórico de execução
                          </h2>
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
  )
}
