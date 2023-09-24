/* eslint-disable no-console */
import { format } from 'date-fns'
import React, { memo, useMemo } from 'react'

import Chart from '~/components/chart'
import { useLockTimeouts, useSingleDashboard } from '~/hooks/index'

function LockTimeoutsSec() {
  const { currentServer } = useSingleDashboard()
  const { data, isLoading } = useLockTimeouts(currentServer.id)

  const seriesData = useMemo(
    () =>
      data?.length > 0
        ? data
            .map((item) =>
              item.value !== null && item.value !== undefined
                ? [
                    new Date(item.createdata).getTime(),
                    Number(Number.parseFloat(item.value / 60).toFixed(2)),
                  ]
                : undefined
            )
            .filter(Boolean)
        : [],
    [data]
  )

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center  h-140"
        style={{ height: '140px' }}
      >
        {isLoading ? 'Loading...' : 'Error'}
      </div>
    )
  }

  if (!seriesData || seriesData.length === 0) {
    return <></>
  }

  return (
    <div className="bg-white pt-5 pr-2">
      <Chart
        height="140"
        title={{
          text: 'Lock timeouts / sec',
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
        seriesName="Lock timeouts / sec"
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
