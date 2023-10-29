/* eslint-disable no-console */
import { format } from 'date-fns'
import React, { memo } from 'react'

import Chart from '~/components/chart'
import Loading from '~/components/loading/loading'

function LockTimeoutsSec({ isLoading, seriesData }) {
  if (isLoading) {
    return (
      <div className="col-span-2 bg-white lg:col-span-6 h-200 flex items-center justify-center h-[140px]">
        <Loading />
      </div>
    )
  }

  return (
    <div className="bg-white pt-5 pr-2">
      <Chart
        height="140"
        title={{
          text: 'Lock Timeout',
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
        seriesName="Lock Timeout"
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

export default memo(LockTimeoutsSec)
