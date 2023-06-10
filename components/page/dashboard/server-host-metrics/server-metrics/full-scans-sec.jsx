import { format } from 'date-fns'
import { useRouter } from 'next/router'
import React, { memo, useMemo } from 'react'

import Chart from '~/components/chart'
import { useFullScans, useSingleDashboard } from '~/hooks/index'

function FullScansSec() {
  const { currentServer } = useSingleDashboard()
  const { query } = useRouter()
  const { data, isLoading } = useFullScans(currentServer.id, query.lastMinutes)

  const seriesData = useMemo(
    () =>
      data?.length > 0
        ? data
            .map((item) =>
              item.value !== null && item.value !== undefined
                ? [
                    new Date(item.createdata).getTime(),
                    Number(item.value / 60).toFixed(0),
                  ]
                : undefined
            )
            .filter(Boolean)
        : [],
    [data]
  )

  if (isLoading || seriesData.length === 0) {
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
          text: 'Full scans / sec',
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
        seriesName="Full scans / sec"
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

export default memo(FullScansSec)
