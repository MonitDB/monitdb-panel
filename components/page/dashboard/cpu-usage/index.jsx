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
  const lastMinutes = route.query.lastMinutes

  const fetchData = useCallback(async () => {
    setLoading(true)

    const data = await getCpuUsage(currentServer?.id, {
      lastMinutes: lastMinutes ?? 60,
    })
    setData(data)
    setLoading(false)
  }, [getCpuUsage, currentServer?.id, lastMinutes])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return loading ? (
    <div className="col-span-2 bg-white lg:col-span-6 h-200 flex items-center justify-center h-[215px]">
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
