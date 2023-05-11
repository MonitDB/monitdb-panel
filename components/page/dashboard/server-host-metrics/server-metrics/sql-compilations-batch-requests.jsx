import { format } from 'date-fns'
import React, { memo, useMemo } from 'react'

import Chart from '~/components/chart'
import {
  useBatchRequests,
  useSingleDashboard,
  useSQLCompilations,
} from '~/hooks/index'

function SqlCompilationsBatchRequests() {
  const { currentServer } = useSingleDashboard()

  const SQLCompilations = useSQLCompilations(currentServer.id)
  const batchRequests = useBatchRequests(currentServer.id)

  const seriesData = useMemo(() => {
    const data = []

    if (!SQLCompilations.data?.length || !batchRequests.data?.length)
      return data

    for (let SQLCompilation of SQLCompilations.data) {
      if (!SQLCompilation.value) continue

      const batchRequest = batchRequests.data.find(
        (batch) => batch.createdata === SQLCompilation.createdata
      )
      if (batchRequest) {
        data.push([
          new Date(SQLCompilation.createdata).getTime(),
          Number(
            Number.parseFloat(
              SQLCompilation.value / batchRequest.value
            ).toFixed(2)
          ),
        ])
      }
    }

    return data
  }, [SQLCompilations, batchRequests])

  const loading = batchRequests.isLoading || SQLCompilations.isLoading

  if (loading || seriesData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        {loading ? 'Loading...' : 'Error'}
      </div>
    )
  }

  return (
    <div className="bg-white pt-5 pr-2">
      <Chart
        height="140"
        title={{
          text: 'SQL compilations / Batch requests',
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
        seriesName="SQL compilations / Batch requests"
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

export default memo(SqlCompilationsBatchRequests)
