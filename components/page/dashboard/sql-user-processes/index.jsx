import React, { useCallback, useEffect, useState } from 'react'

import Image from '~/components/image'
import { GenericTable } from '~/components/table/genericTable'

import useComponentContext from '../../../../services/state-manager/components'

const COMPONENT_CODE = 'LTTPPR'

function SqlUserProcesses(properties) {
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

  return (
    <div id="sqlprocesses" className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATAQMAAAC0i49FAAAABlBMVEUAAAB3d3daxsy0AAAAAXRSTlMAQObYZgAAACdJREFUCNdj/M/AcJDh//8DDkwMQAAmGMFicADhfmBgIKTk/wcMJQBnHBDweU6BeQAAAABJRU5ErkJggg=="
          width="26"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">
          SQL user processes (top 10 by CPU)
        </h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <GenericTable data={data} loading={loading} />
      {/* <div
        style={{ overflowX: 'auto' }}
        className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]"
      >
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px',
            }}
          >
            <Loading />
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Session</th>
                <th>Login time</th>
                <th>Login</th>
                <th>Host</th>
                <th>Program</th>
                <th>Command</th>
                <th>Status</th>
                <th>Database</th>
                <th>Interval CPU %</th>
                <th>Reads/s</th>
                <th>Writes/s</th>
                <th>Logical Reads/s</th>
              </tr>
            </thead>
            <tbody>
              {data === undefined ? (
                <tr>
                  <td colSpan="12">
                    <div>Error to load the data.</div>
                  </td>
                </tr>
              ) : // eslint-disable-next-line unicorn/no-nested-ternary
              data.length === 0 ? (
                <tr>
                  <td colSpan="12">
                    <div>No SQL processes to display.</div>
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-lightest">
                    <td>{row.session_id}</td>
                    <td>
                      {new Date(row.last_request_start_time).toUTCString()}
                    </td>
                    <td>{row.loginname}</td>
                    <td>{row.hostname}</td>
                    <td>{row.program_name}</td>
                    <td>{row.query}</td>
                    <td>{row.status}</td>
                    <td>{row.dbname}</td>
                    <td>{row.cpu}</td>
                    <td>{row.reads}</td>
                    <td>{row.writes}</td>
                    <td>{row.logical_reads}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div> */}
    </div>
  )
}

export default SqlUserProcesses
