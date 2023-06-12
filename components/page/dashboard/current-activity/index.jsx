import { faArrowRotateBack } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useState } from 'react'

import BlockMessage from '~/components/block-message'
import Loading from '~/components/loading/loading'
import useComponentContext from '~/services/state-manager/components'
const COMPONENT_CODE = 'LTBLPR'

function CurrentActivity(properties) {
  const { currentServer } = properties

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const { executeQueryComponent } = useComponentContext()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const data = await executeQueryComponent(
      COMPONENT_CODE,
      currentServer?.id || undefined
    )
    setData(data)
    setLoading(false)
  }, [currentServer?.id, executeQueryComponent])

  if (loading)
    return (
      <div
        style={{ height: '50vh', display: 'flex', justifyContent: 'center' }}
      >
        <Loading />
      </div>
    )

  if (data.length === 0)
    return (
      <div>
        <BlockMessage
          className="mt-6"
          type="information"
          message={
            <p className="text-xs">
              <span>No current activity.</span>
            </p>
          }
        />
      </div>
    )

  if (data === undefined) return <div>No data available</div>

  return (
    <div className="w-full min-h-96">
      <button className="mt-6 bg-blue text-white px-3 h-11 rounded-[5px] font-medium flex items-center gap-1">
        <FontAwesomeIcon
          className="font-medium"
          icon={faArrowRotateBack}
          onClick={fetchData}
        />
        Refresh
      </button>

      <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
        <table>
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Host Name</th>
              <th>Login Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.sessionId}</td>
                <td>{item.host_name}</td>
                <td>{item.login_name}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CurrentActivity
