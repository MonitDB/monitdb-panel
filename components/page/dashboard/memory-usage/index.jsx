import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import Chart from '~/components/chart'
import Loading from '~/components/loading/loading'
import useLogContext from '~/services/state-manager/logs'
import { dateStringToTime } from '~/utils/formats'

function MemoryUsage(properties) {
  const { currentServer } = properties
  const { getMemoryUsage } = useLogContext()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const route = useRouter()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const data = await getMemoryUsage(currentServer?.id, {
      lastMinutes: route.query.lastMinutes,
    })
    setData(data)

    setLoading(false)
  }, [getMemoryUsage, currentServer?.id, route.query.lastMinutes])
  console.log({
    name: '% Percent Usage',
    data:
      data?.map((usage) => [
        dateStringToTime(usage.createDate),
        usage.percentUsage,
      ]) || [],
  })
  return loading ? (
    <div className="col-span-2 bg-white lg:col-span-6">
      <Loading />
    </div>
  ) : (
    <div className="col-span-2 bg-white lg:col-span-6">
      <Chart
        title={{
          text: !data ? 'Error to load the data' : 'Memory Usage',
          offsetY: 10,
          offsetX: 5,
        }}
        multipleSeries={[
          {
            name: '% Percent Usage',
            data:
              data?.map((usage) => [
                dateStringToTime(usage.createDate),
                usage.percentUsage,
              ]) || [],
          },
        ]}
      />
    </div>
  )
}

export default MemoryUsage
