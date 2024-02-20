import { Table, Tag } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'

import Chart from '~/components/chart'
import Image from '~/components/image'
import useLogContext from '~/services/state-manager/logs'

import { GraphContainer } from './styles/chart-styles'

function Databases(properties) {
  const { currentServer } = properties
  const { getLogDatabase } = useLogContext()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => fetchData(), [fetchData])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getLogDatabase(currentServer?.id)
      setData(data)
    } catch {
      setData([])
    }
    setLoading(false)
  }, [currentServer?.id, getLogDatabase])

  return (
    <div id="databases" className="mt-4">
      <div className="grid grid-cols-[28px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAaFJREFUeNq8VtFRhDAQTRj+pQOxguMqgA6OErQCxy8+gU++vKvAsQK1A6jAXAdYwWEFuus8ZlYkHgmjO7MDd7B5ydv3QnRRFJFSKqfcUcaUibKHoewpO8rnpml65RiaAE90jZRf1ARauRQEK8A4UteC0BNoYEpBrTOlH45AB8o9+p1RbnCvcI3R5170/UjZcs8Z8PWMUL71DCt7EiAu0QaEuqUbzjsMZs4U5Z5gHFnItiBQA6D9uQp6v1ohsi/RnGiQFgLga+/jr78STQ3h3PsCBq4FtHqm/Qrg7cKysV1bLx+C8kr0NbIo/Ud7mFL20i08FS2gVMF7HbxlFggtwfg7PfPAtoH3oPCaspx5Nie0eGohtgWb+EXM1sCPttmqJQP/ZoscyYMNwvg84zfcX2DVj2ttMRVNBK5t0WH1l6DWecMPPRTKDNxwQnCZYGDODu9oVzuq9MFhtjUGifDFH5ZOdDxZaPEjwyxTQW8CKsa+HvBfOTlyHCdqTYTFNlL52pVSbN7lv21ta8MH0IBmr6OJ9qkSR8tUHDWsX3l5tPwUYADxOZD86Rab3gAAAABJRU5ErkJggg=="
          width="28"
          height="24"
        />
        <h3 className="text-sm text-gray-dark font-bold">Databases</h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
        <Table
          pagination={false}
          loading={loading}
          dataSource={
            data?.map((d) => ({ ...d, key: JSON.stringify(d) })) ?? []
          }
          columns={[
            { dataIndex: 'name', title: 'Name' },
            {
              dataIndex: 'status',
              title: 'Status',
              render: (value) => (
                <Tag color={value === 'ONLINE' ? 'green' : 'red'}>{value}</Tag>
              ),
            },
            {
              dataIndex: 'transactions',
              title: 'Transactions/sec',
              render: (value, record, index) => (
                <GraphContainer>
                  <Chart
                    className={'graph'}
                    disableLabels
                    height={75}
                    yaxisAbs
                    seriesData={data[index].logs?.map((log) => [
                      log.createDate,
                      log.currentTransaction,
                    ])}
                  />
                </GraphContainer>
              ),
            },
            {
              dataIndex: 'size',
              title: 'Database size',
              render: (value, record, index) => (
                <GraphContainer>
                  <Chart
                    className={'graph'}
                    disableLabels
                    height={75}
                    yaxisAbs
                    seriesData={data[index].logs?.map((log) => [
                      log.createDate,
                      log.databaseSize,
                    ])}
                  />
                </GraphContainer>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}

export default Databases
