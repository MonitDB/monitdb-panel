import { format } from 'date-fns'
import React, { memo, useMemo } from 'react'

import Chart from '~/components/chart'
import { useSingleDashboard, useUserConnections } from '~/hooks/index'

function userConnections() {
  const { currentServer } = useSingleDashboard()
  const { data, isLoading } = useUserConnections(currentServer.id)

  const seriesData = useMemo(
    () =>
      data?.length > 0
        ? data
            .map((item, index) =>
              index > 0
                ? [new Date(item.createdata).getTime(), Number(item.value)]
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
          text: 'User connections',
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
        seriesName="User connections"
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

export default memo(userConnections)
