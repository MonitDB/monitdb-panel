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

  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTempDb(currentServer.id)

      setData(data)
    } catch {
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [currentServer.id, getTempDb])

  useEffect(fetchData, [fetchData])

  return (
    <>
      <h6 className="my-4 text-xs">
        Summary of tempdb usage by class of object
      </h6>
      <div className="bg-white min-h-96">
        {loading ? (
          <Loading />
        ) : (
          <Chart
            height="100%"
            unit={'MB'}
            multipleSeries={[
              {
                name: 'Usage (MB)',
                data:
                  data?.map((usage) => [
                    dateStringToTime(usage.dataHora),
                    usage.allocatedSpaceMB,
                  ]) || [],
              },
            ]}
          />
        )}
      </div>
    </>
  )
}
