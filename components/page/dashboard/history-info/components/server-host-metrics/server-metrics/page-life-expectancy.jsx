/* eslint-disable no-console */
import React, { memo, useMemo } from 'react'

import Chart from '~/components/chart'
import { useLockWaits, useSingleDashboard } from '~/hooks/index'
import { formatter } from '~/utils/date'

function LockWaitsSec() {
  const { currentServer } = useSingleDashboard()
  const { data, isLoading } = useLockWaits(currentServer.id)

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
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
          text: 'Page life expectancy',
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
        seriesName="Page life expectancy"
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

export default memo(LockWaitsSec)
