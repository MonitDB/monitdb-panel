import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { ApexChart, defaultChartOptions } from '~/components/chart'
import { Select } from '~/components/form'
import Loading from '~/components/loading/loading'
import { getBackupsFromDatabase } from '~/services/states'
import { getMonthsArray } from '~/utils/date'

// eslint-disable-next-line sonarjs/cognitive-complexity
function DatabaseBackupsModal({ modal, onSetModalData }) {
  const { isOpen } = modal

  const [data, setData] = useState([])
  const [availableDate, setAvailableDate] = useState([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(new Date())

  const fetch = useCallback(async () => {
    const { id, databaseName } = modal
    if (id && databaseName) {
      try {
        setLoading(true)

        const { data } = await getBackupsFromDatabase(
          id,
          databaseName,
          startDate
        )
        setData(data.backups)
        setAvailableDate(
          getMonthsArray(
            new Date(data?.firstBackup[0]?.backup_start_date ?? '')
          ).reverse()
        )
      } catch {
        toast.error('Error fetching data')
      } finally {
        setLoading(false)
      }
    }
  }, [modal, startDate])

  useEffect(fetch, [fetch, modal?.databaseName])

  function getMostAmountOfArrayBackups() {
    let arrayBackupsAmount = 0
    for (let key in data) {
      if (
        data[key].allBackups &&
        data[key].allBackups.length > 0 &&
        data[key].allBackups.length > arrayBackupsAmount
      ) {
        arrayBackupsAmount = data[key].allBackups.length
      }
    }

    return arrayBackupsAmount
  }

  if (!isOpen && !modal?.id && !modal?.databaseName) return <></>

  const arraySize = Array.from({ length: getMostAmountOfArrayBackups() })
  const full = []
  const differential = []
  const log = []
  if (arraySize)
    for (const element of data) {
      if (element.backup_type === 'Full') full.push(element)
      if (element.backup_type === 'Differential') differential.push(element)
      if (element.backup_type === 'Log') log.push(element)
    }

  const serverName = modal?.serverName
  const databaseName = modal?.databaseName
  return (
    <div className="fixed flex items-center justify-center top-0 left-0 w-full min-h-full h-full z-[100]">
      <button
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
        onClick={() => {
          onSetModalData({ ...data, isOpen: false })
        }}
      />
      <div className="relative py-10 w-[90%] bg-white">
        <div className="ml-4 z-[1]">
          <p>
            {serverName} - {databaseName}
          </p>
          <p>
            <strong>Backup History</strong>
          </p>
        </div>

        <button
          className="w-4 h-4 absolute top-5 right-5 z-[1]"
          onClick={() => {
            onSetModalData({ ...data, isOpen: false })
          }}
        >
          <i className="absolute block w-full h-[2px] rotate-45 bg-black bg-opacity-75" />
          <i className="absolute block  w-full h-[2px] -rotate-45 bg-black bg-opacity-75" />
        </button>
        {loading && (
          <div
            style={{
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {' '}
            <Loading />
          </div>
        )}
        {!loading && (
          <div>
            <Select
              name="time"
              containerClass="w-full md:w-1/3 bg-white border-white md:min-w-1/3 ml-auto mr-5"
              options={availableDate.map((date, index) => ({
                value: date.value,
                label:
                  index == 0 ? 'Current Month' : `${date.month} - ${date.year}`,
              }))}
              value={startDate}
              onChange={(value) => setStartDate(value)}
            />
            {full.length === 0 &&
              log.length === 0 &&
              differential.length === 0 && (
                <div
                  style={{
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <h1>No data to display</h1>
                </div>
              )}

            {!(
              full.length === 0 &&
              log.length === 0 &&
              differential.length === 0
            ) && (
              <ApexChart
                type="scatter"
                series={[
                  {
                    name: 'FULL',
                    color: '#5046E5',
                    data: full.map((item) => {
                      return [
                        item.backup_start_date,
                        item.backup_size,
                        undefined,
                        item,
                      ]
                    }),
                  },

                  {
                    color: '#5046E599',
                    name: 'LOG',
                    // eslint-disable-next-line sonarjs/no-identical-functions
                    data: log.map((item) => {
                      return [
                        item.backup_start_date,
                        item.backup_size,
                        undefined,
                        item,
                      ]
                    }),
                  },
                  {
                    name: 'DIFFERENTIAL',
                    color: '#161B22',
                    // eslint-disable-next-line sonarjs/no-identical-functions
                    data: differential.map((item) => {
                      return [
                        item.backup_start_date,
                        item.backup_size,
                        undefined,
                        item,
                      ]
                    }),
                  },
                ]}
                height={'100%'}
                options={{
                  chart: {
                    ...defaultChartOptions.chart,
                    type: 'scatter',
                  },
                  title: {
                    // text: `y`,
                    style: {
                      fontFamily: 'Arial, sans-serif',
                      color: '#333',
                      fontWeight: 'bold',
                    },
                  },

                  legend: {
                    showForSingleSeries: false,
                    fontSize: '11px',
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: true,
                    offsetY: -20,
                    markers: {
                      width: 16,
                      height: 12,
                      radius: 0,
                      offsetY: 1,
                    },
                    itemMargin: {
                      horizontal: 5,
                      vertical: 0,
                    },
                    onItemHover: {
                      highlightDataSeries: true,
                    },
                    onItemClick: {
                      toggleDataSeries: false,
                    },
                  },

                  yaxis: {
                    labels: {
                      formatter: (value) =>
                        `${Math.round(value / 1024 / 1024)} MB`,
                    },
                  },

                  xaxis: {
                    type: 'datetime',
                    labels: {
                      formatter: (value) =>
                        moment(value).format('DD/MM/YYYY HH:mm'),
                    },
                  },
                  tooltip: {
                    custom: function ({ seriesIndex, dataPointIndex, w }) {
                      const serie = w?.config.series[seriesIndex]
                      const data = serie.data[dataPointIndex][3]
                      const {
                        backup_type,
                        // backupset_name,
                        // database_name,
                        backup_size,
                        physical_device_name,
                        backup_start_date,
                        backup_finish_date,
                      } = data
                      // const serverName = data['Server Name']
                      const backupSizeMB = (
                        backup_size /
                        1024 /
                        1024 /
                        1024
                      ).toFixed(2)
                      const duration =
                        new Date(backup_finish_date).getTime() -
                        new Date(backup_start_date).getTime()
                      return `
      <div style="background-color: rgba(255, 255, 255, 0.9); border: 1px solid #ccc; border-radius: 5px; padding: 10px;">
        <div style="font-family: Helvetica, Arial, sans-serif; font-size: 14px; color: #333; text-align: left;">
          <div style="margin-bottom: 5px;">
            <strong>Backup Type:</strong> ${backup_type}
          </div>
          <div style="margin-bottom: 5px;">
            <strong>Size:</strong> ${backupSizeMB} GB
          </div>
          <div style="margin-bottom: 5px;">
            <strong>Date:</strong> ${moment(backup_start_date).format(
              'DD/MM/YYYY'
            )}
          </div>
          <div style="margin-bottom: 5px;">
            <strong>Duration:</strong> ${duration} ms
          </div>
          <div>
            <strong>Path:</strong> ${physical_device_name}
          </div>
        </div>
      </div>
    `
                    },
                    // custom: () => {
                    //   return <>OPA</>
                    // },
                  },
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DatabaseBackupsModal
