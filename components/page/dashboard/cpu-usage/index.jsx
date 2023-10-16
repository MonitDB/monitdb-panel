import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import Chart from '~/components/chart'
import Loading from '~/components/loading/loading'
import useComponentLogContext from '~/services/state-manager/logs'
import { dateStringToTime } from '~/utils/formats'

function CpuUsage(properties) {
  const { currentServer } = properties
  const { getCpuUsage } = useComponentLogContext()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const route = useRouter()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchData = useCallback(async () => {
    setLoading(true)

    const data = await getCpuUsage(currentServer?.id, {
      lastMinutes: route.query.lastMinutes ?? 60,
    })
    setData(data)
    setLoading(false)
  }, [getCpuUsage, currentServer?.id, route.query.lastMinutes])

  return loading ? (
    <div className="col-span-2 bg-white lg:col-span-6 h-200 flex items-center justify-center">
      <Loading />
    </div>
  ) : (
    <div className="col-span-2 bg-white lg:col-span-6">
      <Chart
        title={{
          text: !data ? 'Error to load the data' : 'CPU',
          offsetY: 10,
          offsetX: 5,
        }}
        multipleSeries={[
          {
            name: '% Other process',
            data:
              data?.map((usage) => [
                dateStringToTime(usage.createDate),
                usage.otherProcess,
              ]) || [],
          },
          {
            name: '% SQL process',
            data:
              data?.map((usage) => [
                dateStringToTime(usage.createDate),
                usage.sqlProcess,
              ]) || [],
          },
        ]}
      />
    </div>
  )
}

export default CpuUsage
