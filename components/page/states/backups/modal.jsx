/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react-hooks/exhaustive-deps */

import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { ApexChart, defaultChartOptions } from '~/components/chart'
import Loading from '~/components/loading/loading'
import { getBackupsFromDatabase } from '~/services/states'
import { calculateMinutesFromDate, minutesToHours } from '~/utils/time'

const chartData = (data) =>
  data.map((item) => [
    item.backup_start_date,
    calculateMinutesFromDate(item.backup_start_date),
    undefined,
    item,
  ])

// eslint-disable-next-line sonarjs/cognitive-complexity
function DatabaseBackupsModal({ modal, onSetModalData }) {
  const { isOpen } = modal

  const [data, setData] = useState([])

  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD')
  )

  const [endDate, setEndDate] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  )

  const fetch = async () => {
    const { id, databaseName } = modal
    if (id && databaseName) {
      try {
        setLoading(true)

        const { data } = await getBackupsFromDatabase(
          id,
          databaseName,
          startDate,
          endDate
        )
        setData(data.backups)
      } catch {
        setData([])
        onSetModalData({ ...data, isOpen: false })
        toast.error('Error fetching data')
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(fetch, [modal?.databaseName])

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
    <div className="fixed flex items-center justify-center top-0 left-0 w-full min-h-full h-250 z-[100]">
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
        <div
          className="flex items-center space-x-3 "
          style={{ width: '450px', marginLeft: 'auto', marginRight: '15px' }}
        >
          <input
            type="date"
            name="start_date"
            className="w-full px-4 h-10 bg-white leading-10 rounded text-sm"
            onChange={(event) => setStartDate(event.target.value)}
            defaultValue={moment(new Date())
              .subtract(1, 'months')
              .format('YYYY-MM-DD')}
            value={startDate}
          />
          <FontAwesomeIcon icon={faArrowRight} />
          <input
            type="date"
            name="end_date"
            className="w-full px-4 h-10 bg-white leading-10 rounded text-sm"
            defaultValue={moment(new Date()).format('YYYY-MM-DD')}
            onChange={(event) => setEndDate(event.target.value)}
            value={endDate}
          />

          <button onClick={() => fetch()} className="btn">
            Filter
          </button>
        </div>
        {loading && (
          <div
            style={{
              height: '230px',
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
          <div
            style={{
              height: '230px',
            }}
          >
            {full.length === 0 &&
              log.length === 0 &&
              differential.length === 0 && (
                <div
                  style={{
                    height: '220px',
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
                    data: chartData(full),
                  },

                  {
                    color: '#5046E599',
                    name: 'LOG',

                    data: chartData(log),
                  },
                  {
                    name: 'DIFFERENTIAL',
                    color: '#161B22',

                    data: chartData(differential),
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
                      formatter: (value) => minutesToHours(value),
                    },
                  },

                  xaxis: {
                    type: 'datetime',
                    labels: {
                      formatter: (value) => moment(value).format('DD/MM/YYYY'),
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
