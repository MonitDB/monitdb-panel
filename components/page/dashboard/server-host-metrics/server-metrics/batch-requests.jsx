import { format } from 'date-fns'
import { useRouter } from 'next/router'
import React, { memo, useEffect, useMemo } from 'react'

import Chart from '~/components/chart'
import { useBatchRequests, useSingleDashboard } from '~/hooks/index'

function BatchRequests() {
  const { currentServer } = useSingleDashboard()
  const route = useRouter()
  const { data, isLoading, mutate } = useBatchRequests(
    currentServer.id,
    route.query.lastMinutes
  )
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

  useEffect(mutate, [mutate, route.query.lastMinutes])

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
          text: 'Batch requests',
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
        seriesName="Batch requests"
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

export default memo(BatchRequests)
