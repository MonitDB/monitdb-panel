import React, { memo } from 'react'

import Chart from '~/components/chart'
import Loading from '~/components/loading/loading'
import { formatter } from '~/utils/date'

function SqlCompilationsBatchRequests({ isLoading, seriesData }) {
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
          text: 'SQL Compilations',
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
        seriesName="SQL Compilations"
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

export default memo(SqlCompilationsBatchRequests)
