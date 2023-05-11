import { format } from 'date-fns'
import React, { memo, useMemo } from 'react'

import Chart from '~/components/chart'
import { useBatchRequests, useSingleDashboard } from '~/hooks/index'
import { usePageSplits } from '~/hooks/index'

function PageSplitsBatchRequests() {
  const { currentServer } = useSingleDashboard()
  const pageSplits = usePageSplits(currentServer.id)
  const batchRequests = useBatchRequests(currentServer.id)

  const seriesData = useMemo(() => {
    const data = []

    if (!pageSplits.data?.length || !batchRequests.data?.length) return data

    for (let pageSplit of pageSplits.data) {
      if (!pageSplit.value) continue

      const batchRequest = batchRequests.data.find(
        (batch) => batch.createdata === pageSplit.createdata
      )
      if (batchRequest) {
        data.push([
          new Date(pageSplit.createdata).getTime(),
          Number(
            Number.parseFloat(pageSplit.value / batchRequest.value).toFixed(2)
          ),
        ])
      }
    }

    return data
  }, [pageSplits, batchRequests])

  const loading = pageSplits.isLoading || batchRequests.isLoading

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
          text: 'Page splits / Batch requests',
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
        seriesName="Page splits / Batch requests"
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

export default memo(PageSplitsBatchRequests)
