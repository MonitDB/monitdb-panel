/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Chart from '~/components/chart'
import Loading from '~/components/loading/loading'
import Reveal from '~/helpers/reveal'
import { useSingleDashboard } from '~/hooks/index'
import useLogContext from '~/services/state-manager/logs'
import { colors } from '~/utils/color'
import { dateStringToTime } from '~/utils/formats'

import { SessionQuery } from './SessionQuery'

export const TemporaryDBSession = () => {
  const { currentServer } = useSingleDashboard()
  const { getTempDbSession } = useLogContext()

  const [data, setData] = useState()
  const [activeRowIndex, setActiveRowIndex] = useState(-1)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTempDbSession(currentServer.id, {
        lastMinutes: 60,
      })

      setData(data)
    } catch {
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [currentServer.id, getTempDbSession])

  useEffect(fetchData, [fetchData])

  const dataTransformed = data?.map((item, index) => ({
    data: [new Date(item.dataHora).getTime(), item.tempdbTotalNet],
    label: item.sessionId,
    item,
    color: colors[index],
  }))

  if (!data?.length || loading)
    return (
      <div
        className="bg-white min-h-96"
        style={{
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loading />
      </div>
    )

  return (
    <>
      <p className="my-4 text-xs flex items-center gap-1">
        Top 10 sessions using tempdb by total allocated space
        <span className="w-[15px] h-[15px] bg-blue text-white flex items-center justify-center rounded-full cursor-pointer">
          ?
        </span>
      </p>
      <div className="bg-white min-h-96">
        <Chart
          height="100%"
          unit={'B'}
          type={'scatter'}
          multipleSeries={data?.map((item) => ({
            data: [[dateStringToTime(item.dataHora), item.tempdbTotalNet]],
            name: `${item.sessionId}`,
          }))}
          strokeWidth={10}
        />
      </div>
      <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px] prose-th:whitespace-nowrap prose-td:whitespace-nowrap prose-th:px-2 prose-th:h-[35px] prose-th:text-xs prose-tr:cursor-pointer overflow-x-hidden">
        <table className="m-0 py-4 prose-tr:last:!border-b overflow-x-hidden">
          <thead>
            <tr>
              <th>Session</th>
              <th>Login time</th>
              <th>Login</th>
              {/* <th>Host</th> */}
              <th>Database</th>
              <th>Program name</th>
              <th>User allocations</th>
              <th>User deallocations</th>
              <th>Internal allocations</th>
              <th>Internal deallocations</th>
              {/* <th>User deferred</th> */}
              <th>Total net</th>
            </tr>
          </thead>
          <tbody>
            {dataTransformed?.map(({ item, color }, index) => (
              <>
                <tr key={index}>
                  <td>
                    <div
                      className="flex items-center"
                      onClick={() => {
                        if (activeRowIndex === index) setActiveRowIndex(-1)
                        else setActiveRowIndex(index)
                      }}
                    >
                      <span className="status-dot">
                        <span
                          className="inline-block w-[13px] h-[13px] rounded-full mr-1"
                          style={{
                            backgroundColor: color,
                          }}
                        ></span>
                      </span>
                      <FontAwesomeIcon
                        width={6}
                        height={6}
                        icon={faChevronRight}
                      />
                      <span className="ml-2">{item.sessionId}</span>
                    </div>
                  </td>
                  <td
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px',
                    }}
                  >
                    {moment(item.dataHora).format('DD/MM/YYYY HH:mm')}
                  </td>
                  <td
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px',
                    }}
                  >
                    {item.loginName}
                  </td>
                  <td
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px',
                    }}
                  >
                    {item.dbName}
                  </td>
                  <td
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px',
                    }}
                  >
                    {item.programName}
                  </td>

                  <td
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px',
                    }}
                  >
                    {item.tempdbTranUserObjectMbSpace} MB
                  </td>
                  <td
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px',
                    }}
                  >
                    {item.tempdbTranUserObjectDeallocMbSpace} MB
                  </td>
                  <td
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px',
                    }}
                  >
                    {item.tempdbTranInternaObjectMbSpace} MB
                  </td>
                  <td
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px',
                    }}
                  >
                    {item.tempdbTranInternalObjectDeallocMbSpace} MB
                  </td>
                  <td
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100px',
                    }}
                  >
                    {item.tempdbTotalNet} B
                  </td>
                </tr>
                <td colSpan={9} className="!p-0">
                  <Reveal active={activeRowIndex === index}>
                    <div className="p-4 border-t-2 border-t-gray bg-gray-light bg-opacity-25">
                      <div className="w-full mb-4">
                        <h4 className="!mb-2 font-bold text-base">Query</h4>

                        <div
                          style={{
                            width: '100%',
                            overflowX: 'auto',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {activeRowIndex === index && (
                            <SessionQuery id={index} />
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </td>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
