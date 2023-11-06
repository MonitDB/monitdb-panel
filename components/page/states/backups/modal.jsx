import moment from 'moment'
import React from 'react'

import { ApexChart, defaultChartOptions } from '~/components/chart'

function DatabaseBackupsModal({ modal: { isOpen, data }, onSetModalData }) {
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

  if (!isOpen) return <></>

  const arraySize = Array.from({ length: getMostAmountOfArrayBackups() })
  const full = []
  const differential = []
  const log = []
  if (arraySize)
    for (const [index] of arraySize.entries()) {
      const FULL = data.Full.allBackups[index]
      const DIFERENTIAL = data.Diferential.allBackups[index]
      const LOG = data.Log.allBackups[index]
      if (FULL) full.push(FULL)
      if (DIFERENTIAL) differential.push(DIFERENTIAL)
      if (LOG) log.push(LOG)
    }

  const model = differential[0] ?? log[0] ?? full[0]
  const serverName = model['Server Name']
  const databaseName = model['database_name']
  return (
    <div className="fixed flex items-center justify-center top-0 left-0 w-full min-h-full h-full z-[100]">
      <button
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50"
        onClick={() => {
          onSetModalData({ ...data, isOpen: false })
        }}
      />
      <div className="relative py-10 w-[90%] bg-white">
        <button
          className="w-4 h-4 absolute top-5 right-5 z-[1]"
          onClick={() => {
            onSetModalData({ ...data, isOpen: false })
          }}
        >
          <i className="absolute block w-full h-[2px] rotate-45 bg-black bg-opacity-75" />
          <i className="absolute block  w-full h-[2px] -rotate-45 bg-black bg-opacity-75" />
        </button>

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
              text: `${serverName} - ${databaseName} Backup History`,
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
                formatter: (value) => `${Math.round(value / 1024 / 1024)} MB`,
              },
            },

            xaxis: {
              type: 'datetime',
              labels: {
                formatter: (value) => moment(value).format('DD/MM/YYYY HH:mm'),
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
                const backupSizeMB = (backup_size / 1024 / 1024).toFixed(2)
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
            <strong>Size:</strong> ${backupSizeMB} MB
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
      </div>
    </div>
  )
}

export default DatabaseBackupsModal
