import { Card, Descriptions, Spin } from 'antd'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useSingleDashboard } from '~/hooks/index'
import useComponentContext from '~/services/state-manager/components'

import ServerDetails from './server-details'

const componentCode = 'LTINSPRP'
const loadingText = 'Loading...'

export const InstanceProperties = () => {
  const { currentServer } = useSingleDashboard()
  const { executeQueryComponent } = useComponentContext()
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [result] = await executeQueryComponent(
        componentCode,
        currentServer?.id || undefined
      )

      setData(result)
    } catch {
      toast.error('Error to get ServerProperties')
    } finally {
      setLoading(false)
    }
  }, [currentServer?.id, executeQueryComponent])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="col-span-2 md:col-span-6">
      {/* <h4 className="mb-4 text-sm text-gray-dark">Server properties</h4> */}

      <Card>
        {loading ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <Spin tip={loadingText} />
          </div>
        ) : (
          <>
            <Descriptions size="small" column={2} bordered>
              {Object.keys(data ?? {}).map(
                (key, index) =>
                  data[key] && (
                    <Descriptions.Item label={key} key={index}>
                      {moment(data[key]).isValid()
                        ? moment(data[key]).format('DD/MM/YYYY HH:mm:ss')
                        : String(data[key])}
                    </Descriptions.Item>
                  )
              )}
            </Descriptions>
            <br />
            <ServerDetails currentServer={currentServer} />
          </>
        )}
      </Card>
    </div>
  )
}
