import moment from 'moment'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { ApexChart, defaultChartOptions } from '~/components/chart'
import Loading from '~/components/loading/loading'
import { groupBy } from '~/helpers/chart-data'
import { useSingleDashboard } from '~/hooks/index'
import useLogContext from '~/services/state-manager/logs'

export const TemporaryDBDatabase = () => {
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
            <ApexChart
              height={'100%'}
              options={{
                ...defaultChartOptions,
                stroke: { width: 1, curve: 'straight' },
                xaxis: {
                  type: 'datetime',
                  labels: {
                    formatter: (value) => {
                      return moment(value).format('DD/MM/YY HH:mm')
                    },
                  },
                },
                yaxis: {
                  labels: {
                    formatter: (value) => {
                      return `${value} MB`
                    },
                  },
                },
              }}
              series={groupBy(data ?? [], 'dbName').map((item) => {
                return {
                  name: item.label,
                  data: item.data.map((index) => [
                    index.createDate,
                    index.tempdbTotalNet,
                  ]),
                }
              })}
            />
          </>
        )}
      </div>
    </>
  )
}
