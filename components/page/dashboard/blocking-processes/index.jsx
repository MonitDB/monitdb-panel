import React, { useCallback, useEffect, useState } from 'react'

import Image from '~/components/image'
import Loading from '~/components/loading/loading'

import useComponentContext from '../../../../services/state-manager/components'

const COMPONENT_CODE = 'LTBLPR'

function BlockingProcesses(properties) {
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

  if (loading) {
    return (
      <div style={{ width: '100%' }}>
        <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
          <Image
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATAQMAAAC0i49FAAAABlBMVEUAAAB3d3daxsy0AAAAAXRSTlMAQObYZgAAACdJREFUCNdj/M/AcJDh//8DDkwMQAAmGMFicADhfmBgIKTk/wcMJQBnHBDweU6BeQAAAABJRU5ErkJggg=="
            width="26"
            height="18"
          />
          <h3 className="text-sm text-gray-dark font-bold">
            Blocking processes (top 10 by time)
          </h3>
          <span className="w-full h-[1px] block bg-gray-light" />
        </div>
        <Loading />
      </div>
    )
  }

  return (
    <div id="blocking-processes" className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATAQMAAAC0i49FAAAABlBMVEUAAAB3d3daxsy0AAAAAXRSTlMAQObYZgAAACdJREFUCNdj/M/AcJDh//8DDkwMQAAmGMFicADhfmBgIKTk/wcMJQBnHBDweU6BeQAAAABJRU5ErkJggg=="
          width="26"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">
          Blocking processes (top 10 by time)
        </h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
        <table>
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Login time</th>
              <th>Occurrence time</th>
              <th>Host</th>
              <th>Program name</th>
              <th>Status</th>
              <th>Database</th>
              <th>Total blocking time</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="bg-black" style={{ width: '100%' }}>
                <Loading />
              </div>
            ) : // eslint-disable-next-line unicorn/no-nested-ternary
            data === undefined ? (
              <tr>
                <td colSpan="12">
                  <div>Error to load the data.</div>
                </td>
              </tr>
            ) : // eslint-disable-next-line unicorn/no-nested-ternary
            data.length === 0 ? (
              <tr>
                <td colSpan="12">
                  <div>No Blocking processes to display.</div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-lightest">
                  <td>{row.session_id}</td>
                  <td>{row.login_time}</td>
                  <td>{row.occurrence_time}</td>
                  <td>{row.host}</td>
                  <td>{row.program_name}</td>
                  <td>{row.status}</td>
                  <td>{row.database}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BlockingProcesses
