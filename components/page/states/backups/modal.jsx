/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, DatePicker, Modal, Row } from 'antd'
import dayjs from 'dayjs'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { ApexChart } from '~/components/chart'
import Loading from '~/components/loading/loading'
import { getBackupsFromDatabase } from '~/services/states'
import { formatDuration } from '~/utils/time'

// Helper function to get the total minutes of a day from a date object
function getMinutesOfDay(input) {
  const date = new Date(input)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return hours * 60 + minutes
}

// Helper function to convert total minutes into HH:mm format
function convertMinutesToHHmm(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  return `${formattedHours}:${formattedMinutes}`
}

const dayInMinutes = 60 * 24

function combineDataByCoordinates(data) {
  // eslint-disable-next-line unicorn/no-array-reduce
  const groupedData = data.reduce((accumulator, item) => {
    const key = `${item.backup_start_date}_${getMinutesOfDay(
      item.backup_start_date
    )}`

    // If the key doesn't exist, create a new entry
    if (!accumulator[key]) {
      accumulator[key] = {
        ...item,
        backup_size: item.backup_size,
        backup_types: [item.backup_type],
      }
    } else {
      // Combine sizes and backup types for the same coordinate
      accumulator[key].backup_size += item.backup_size
      accumulator[key].backup_types.push(item.backup_type)
    }

    return accumulator
  }, {})

  // Return the combined data in the chart's expected format
  return Object.values(groupedData).map((item) => [
    item.backup_start_date,
    getMinutesOfDay(item.backup_start_date),
    undefined,
    item,
  ])
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function DatabaseBackupsModal({ modal, onSetModalData }) {
  const { isOpen } = modal

  const [data, setData] = useState([])

  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(
    moment(new Date()).subtract(1, 'M').startOf('day').format('YYYY-MM-DD')
  )

  const [endDate, setEndDate] = useState(
    moment(new Date()).endOf('day').format('YYYY-MM-DD')
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

  useEffect(fetch, [modal?.databaseName, startDate, endDate])

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
    <Modal
      open={isOpen}
      title={`${serverName} - ${databaseName}`}
      width={'90%'}
      cancelButtonProps={{ style: { display: 'none' } }}
      onOk={() => onSetModalData({ ...data, isOpen: false })}
      closable={false}
    >
      <div className="relative  bg-white" style={{ height: '70vh' }}>
        <div className="ml-4 z-[1]">
          <p>
            <strong>Backup History</strong>
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: '15px',
          }}
        >
          <Row gutter={12}>
            <Col>
              <DatePicker.RangePicker
                defaultValue={[dayjs(startDate), dayjs(endDate)]}
                onChange={(value) => {
                  setStartDate(dayjs(value[0]).format('YYYY-MM-DD'))
                  setEndDate(dayjs(value[1]).format('YYYY-MM-DD'))
                }}
              />
            </Col>
            <Col>
              <Button onClick={() => fetch()} type="primary">
                Filter
              </Button>
            </Col>
          </Row>
        </div>

        {loading && (
          <div
            style={{
              height: '100%',
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
          <div style={{ height: '70vh' }}>
            {full.length === 0 &&
              log.length === 0 &&
              differential.length === 0 && (
                <div>
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
                    color: 'rgba(80, 70, 229, 0.85)',
                    data: combineDataByCoordinates(full),
                  },

                  {
                    color: 'rgba(254, 176, 25, 0.85)',
                    name: 'LOG',

                    data: combineDataByCoordinates(log),
                  },
                  {
                    name: 'DIFFERENTIAL',
                    color: 'rgba(0, 227, 150, 0.85)',

                    data: combineDataByCoordinates(differential),
                  },
                ]}
                height={'90%'}
                options={{
                  chart: {
                    type: 'scatter',
                  },

                  title: {
                    // text: `y`,
                    style: {
                      fontFamily: 'Arial, sans-serif',
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
                    min: 0,
                    max: dayInMinutes,
                    tickAmount: 24,
                    labels: {
                      formatter: convertMinutesToHHmm,
                    },
                  },
                  xaxis: {
                    type: 'datetime',

                    max: new Date(
                      new Date(endDate).setHours(23, 59, 59, 999)
                    ).getTime(),
                    min: new Date(
                      new Date(startDate).setHours(0, 0, 0, 0)
                    ).getTime(),
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
                        backup_types,
                        backup_size,
                        physical_device_name,
                        backup_start_date,
                        backup_finish_date,
                      } = data
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
            <strong>Backup Types:</strong> ${backup_types.join(', ')}
          </div>
          <div style="margin-bottom: 5px;">
            <strong>Total Size:</strong> ${backupSizeMB} GB
          </div>
          <div style="margin-bottom: 5px;">
            <strong>Date:</strong> ${moment(backup_start_date).format(
              'DD/MM/YYYY HH:mm'
            )}
          </div>
          <div style="margin-bottom: 5px;">
            <strong>Duration:</strong> ${formatDuration(duration)}
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
    </Modal>
  )
}

export default DatabaseBackupsModal
