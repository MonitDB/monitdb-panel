import { format } from 'date-fns'
import React, { memo, useEffect, useState } from 'react'

import Chart from '~/components/chart'
import { getLogPageSplitsCount } from '~/services/dashboard'

function PageSplitsSec({ currentServer }) {
  const [seriesData, setSeriesData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchLogPageSplitsCount = async (serverId, lastMinutes = 60) => {
    setLoading(true)
    try {
      const { data } = await getLogPageSplitsCount(serverId, lastMinutes)

      const parsedData = data
        .map((item, index) =>
          index > 0
            ? [
                new Date(item.createdata).getTime(),
                Number(Number.parseFloat(item.value / 60).toFixed(2)),
              ]
            : undefined
        )
        .filter(Boolean)

      setSeriesData(parsedData)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!currentServer) return

    fetchLogPageSplitsCount(currentServer.id)
  }, [currentServer])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    )
  }

  return (
    <div className="bg-white pt-5 pr-2">
      <Chart
        height="140"
        title={{
          text: 'Page splits / sec',
          offsetX: 7,
          offsetY: -5,
          floating: true,
          style: {
            fontSize: '11px',
            fontWeight: 'normal',
          },
        }}
        legend={{
          show: false,
        }}
        yaxis={{
          forceNiceScale: true,
          decimalsInFloat: 2,
          labels: {
            formatter: (value) => Number.parseFloat(value).toFixed(2),
          },
        }}
        seriesName="Page splits / sec"
        xaxis={{
          type: 'datetime',
          tooltip: {
            enabled: false,
          },
          labels: {
            show: false,
            formatter: function (value) {
              return format(value, "dd MMM yyyy kk':'mm")
            },
          },
        }}
        seriesData={seriesData}
      />
    </div>
  )
}

export default memo(PageSplitsSec)
