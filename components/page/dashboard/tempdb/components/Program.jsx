import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Line } from '~/components/chart'
import Loading from '~/components/loading/loading'
import { useSingleDashboard } from '~/hooks/index'
import useLogContext from '~/services/state-manager/logs'

export const TemporaryDBProgram = () => {
  const { currentServer } = useSingleDashboard()
  const { getTempDbSession } = useLogContext()
  const route = useRouter()
  const { query } = route

  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTempDbSession(currentServer.id, {
        lastMinutes: query.lastMinutes ?? 60,
      })

      setData(data)
    } catch {
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [currentServer.id, getTempDbSession, query.lastMinutes])

  useEffect(fetchData, [fetchData])

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
            <Line
              xField={'dataHora'}
              yField="tempdbTotalNet"
              seriesField="programName"
              data={data ?? []}
              xAxis={{
                showLast: true,
                type: 'timeCat',

                alias: 'Time',
                mask: 'DD/MM/YY HH:mm',
              }}
              yAxis={{
                title: { text: 'Usage (MB)' },
              }}
              renderer="svg"
              padding={60}
            />
          </>
        )}
      </div>
    </>
  )
}
