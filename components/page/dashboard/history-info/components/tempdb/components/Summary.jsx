/* eslint-disable jsx-a11y/label-has-associated-control */

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Loading from '~/components/loading/loading'
import { useSingleDashboard } from '~/hooks/index'
import useLogContext from '~/services/state-manager/logs'
import { dateStringToTime } from '~/utils/formats'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export const TemporaryDBSummary = () => {
  const { currentServer } = useSingleDashboard()
  const { getTempDb } = useLogContext()
  const route = useRouter()
  const { query } = route

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTempDb(currentServer.id, {
        lastMinutes: query.lastMinutes || 60,
      })

      setData(data)
    } catch {
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [currentServer.id, getTempDb, query.lastMinutes])

  useEffect(fetchData, [fetchData])

  const seriesData =
    data?.map(
      ({ createDate, allocatedSpaceMB, availableSpaceMB, spaceUsedMB }) => ({
        time: dateStringToTime(createDate),
        usage: spaceUsedMB,
        allocatedSpace: allocatedSpaceMB,
        availableSpace: availableSpaceMB,
      })
    ) || []

  const [usage, allocatedSpace, availableSpace] = [
    {
      name: 'Usage (MB)',
      data: [],
    },
    {
      name: 'Allocated Space (MB)',
      data: [],
    },
    {
      name: 'Available Space (MB)',
      data: [],
    },
  ]

  for (const item of seriesData) {
    usage.data.push([item.time, item.usage])
    allocatedSpace.data.push([item.time, item.allocatedSpace])
    availableSpace.data.push([item.time, item.availableSpace])
  }

  const series = [usage, allocatedSpace]

  return (
    <>
      <h6 className="my-4 text-xs">
        Summary of tempdb usage by class of object
      </h6>
      <div className="bg-white min-h-96">
        {loading ? (
          <div
            className="bg-white min-h-96"
            style={{
              display: 'flex',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loading />
          </div>
        ) : (
          <>
            <ApexChart
              options={{
                chart: {
                  type: 'area',
                  height: '100%',
                  toolbar: false,
                },
                xaxis: {
                  type: 'datetime',
                },
                yaxis: {
                  title: {
                    text: 'MB',
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: 'smooth',
                },
                tooltip: {
                  custom: function ({ dataPointIndex }) {
                    const [, availableSpaceValue] =
                      availableSpace.data[dataPointIndex]
                    const [, allocatedSpaceValue] =
                      allocatedSpace.data[dataPointIndex]
                    const [, usageValue] = usage.data[dataPointIndex]

                    return `
                      <div style="background-color: rgba(255, 255, 255, 0.9); border: 1px solid #ccc; border-radius: 5px; padding: 10px;">
                        <div><strong>Usage:</strong> ${usageValue} MB</div>
                        <div><strong>Allocated Space:</strong> ${allocatedSpaceValue} MB</div>
                        <div><strong>Available Space:</strong> ${availableSpaceValue} MB</div>
                      </div>
                     `
                  },
                },
              }}
              series={series}
              type="area"
              height="400"
            />
          </>
        )}
      </div>
    </>
  )
}
