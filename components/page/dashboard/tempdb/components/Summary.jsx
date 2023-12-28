import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Chart from '~/components/chart'
import Loading from '~/components/loading/loading'
import { useSingleDashboard } from '~/hooks/index'
import useLogContext from '~/services/state-manager/logs'
import { dateStringToTime } from '~/utils/formats'

export const TemporaryDBSummary = () => {
  const { currentServer } = useSingleDashboard()
  const { getTempDb } = useLogContext()
  const route = useRouter()
  const { query } = route

  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [showUsage, setShowUsage] = useState(true)
  const [showAllocatedSpace, setShowAllocatedSpace] = useState(true)
  const [showAvailableSpace, setShowAvailableSpace] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTempDb(currentServer.id, {
        lastMinutes: query.lastMinutes || 60,
      })

      setData(data)
    } catch {
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [currentServer.id, getTempDb, query.lastMinutes])

  useEffect(fetchData, [fetchData])

  const seriesData =
    data?.map(
      ({ createDate, allocatedSpaceMB, availableSpaceMB, spaceUsedMB }) => ({
        time: dateStringToTime(createDate),
        usage: spaceUsedMB,
        allocatedSpace: allocatedSpaceMB,
        availableSpace: availableSpaceMB,
      })
    ) || []

  const [usage, allocatedSpace, availableSpace] = [
    {
      name: 'Usage (MB)',
      data: [],
    },
    {
      name: 'Allocated Space (MB)',
      data: [],
    },
    {
      name: 'Available Space (MB)',
      data: [],
    },
  ]

  for (const item of seriesData) {
    usage.data.push([item.time, item.usage])
    allocatedSpace.data.push([item.time, item.allocatedSpace])
    availableSpace.data.push([item.time, item.availableSpace])
  }

  return (
    <>
      <h6 className="my-4 text-xs">
        Summary of tempdb usage by class of object
      </h6>
      <div className="bg-white min-h-96">
        {loading ? (
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
        ) : (
          <>
            <Chart
              height="100%"
              unit={'MB'}
              multipleSeries={[usage, allocatedSpace, availableSpace].filter(
                (element, index) => {
                  if (index === 0 && !showUsage) return false
                  if (index === 1 && !showAllocatedSpace) return false
                  if (index === 2 && !showAvailableSpace) return false
                  return element.data.length > 0
                }
              )}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                padding: '10px',
              }}
            >
              <label>
                <input
                  style={{ margin: '0 0 0 5px' }}
                  type="checkbox"
                  checked={showUsage}
                  onChange={() => setShowUsage(!showUsage)}
                />
                <span style={{ margin: '0 0 0 5px' }}>Show Usage</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={showAllocatedSpace}
                  onChange={() => setShowAllocatedSpace(!showAllocatedSpace)}
                />
                <span style={{ margin: '0 0 0 5px' }}>
                  Show Allocated Space
                </span>
              </label>
              <label>
                <input
                  style={{ margin: '0 0 0 5px' }}
                  type="checkbox"
                  checked={showAvailableSpace}
                  onChange={() => setShowAvailableSpace(!showAvailableSpace)}
                />
                <span style={{ margin: '0 0 0 5px' }}>
                  Show Available Space
                </span>
              </label>
            </div>
          </>
        )}
      </div>
    </>
  )
}
