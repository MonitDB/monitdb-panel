import React, { useCallback, useEffect, useState } from 'react'

import Chart from '~/components/chart'
import useComponentLogContext from '~/services/state-manager/logs'
import { dateStringToTime } from '~/utils/formats'

function CpuUsage(properties) {
  const { currentServer } = properties

  const { getCpuUsage } = useComponentLogContext()

  const [/*loading,*/ setLoading] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const data = await getCpuUsage(currentServer.id)
    setData(data)
    setLoading(false)
  }, [currentServer.id, getCpuUsage])

  return (
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
      />
    </div>
  )
}

export default CpuUsage
