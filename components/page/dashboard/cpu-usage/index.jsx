import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import { Line } from '~/components/chart'
import Loading from '~/components/loading/loading'
import useComponentLogContext from '~/services/state-manager/logs'

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
      LastMinutes: route.query.lastMinutes,
    })
    setData(data)
    setLoading(false)
  }, [getCpuUsage, currentServer?.id, route.query.lastMinutes])

  return loading ? (
    <div className="col-span-2 bg-white lg:col-span-6">
      <Loading />
    </div>
  ) : (
    <div className="col-span-2 bg-white lg:col-span-6">
      <Line data={data} yAxis="otherProcessPerc" xAxis="createData" />
      {/* <Chart
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
                dateStringToTime(usage.createData),
                usage.otherProcessPerc,
              ]) || [],
          },
          {
            name: '% SQL process',
            data:
              data?.map((usage) => [
                dateStringToTime(usage.createData),
                usage.sqlProcessPerc,
              ]) || [],
          },
        ]}
      /> */}
    </div>
  )
}

export default CpuUsage
