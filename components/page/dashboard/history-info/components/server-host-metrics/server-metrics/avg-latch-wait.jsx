import React, { memo } from 'react'

import Chart from '~/components/chart'
import { formatter } from '~/utils/date'

function AvgLatchWait({ isLoading, seriesData }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        {isLoading ? 'Loading...' : 'Error'}
      </div>
    )
  }

  return (
    <div className="bg-white pt-5 pr-2">
      <Chart
        height="140"
        title={{
          text: 'Avg Latch Wait',
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
        seriesName="Avg Latch Wait"
        xaxis={{
          type: 'datetime',
          tooltip: {
            enabled: false,
          },
          labels: {
            show: false,
            formatter,
          },
        }}
        seriesData={seriesData}
      />
    </div>
  )
}

export default memo(AvgLatchWait)
