import { format } from 'date-fns'
import React, { memo, useMemo } from 'react'

import Chart from '~/components/chart'
import { useLatchWaits, useSingleDashboard } from '~/hooks/index'

function AvgLatchWait() {
  const { currentServer } = useSingleDashboard()
  const { data, isLoading } = useLatchWaits(currentServer.id)

  const seriesData = useMemo(
    () =>
      data?.length > 0
        ? data
            .map((item) =>
              item.value !== null && item.value !== undefined
                ? [new Date(item.createdata).getTime(), item.value]
                : undefined
            )
            .filter(Boolean)
        : [],
    [data]
  )

  if (isLoading || seriesData.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-140"
        style={{ height: '140px' }}
      >
        {isLoading ? 'Loading...' : 'Error'}
      </div>
    )
  }

  return (
    <div className="bg-white pt-5 pr-2">
      <Chart
        height="140"
        title={{
          text: 'Avg. latch wait',
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
            formatter: (value) => value,
          },
        }}
        seriesName="Avg. latch wait"
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

export default memo(AvgLatchWait)
