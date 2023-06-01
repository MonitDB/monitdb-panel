import React, { useCallback, useEffect, useState } from 'react'

import Image from '~/components/image'
import Loading from '~/components/loading/loading'

import useComponentContext from '../../../../services/state-manager/components'

const COMPONENT_CODE = 'LTELG'

function ErrorLog(properties) {
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
  }, [executeQueryComponent])

  return (
    <div id="error-log" className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAABK0lEQVR42qzUUUobURQG4IlgphtRdBFFuoQWLIYUX/qQ4OdiWlBwDWpdigQXoE21XYKJefn7kJaZTKYjYjlPc+G7/Peec6dI8bIqXgm8cejKDwsL310a6ncAA7+kUff2W4ENZyKujWzp69s2NhFxYmMdnIlHnxsRe0Zm4qQBDMSjt23HtGcmf4Mtl0o/pb67SO1rLO6Xx18uHIrrlV1XQc9EDCtwJUb/BikciYsKTMVWJ9gRdxVYyGqD1kApnl4BpmK7a4LsitsKfBPjTnAszivwSUz0Oq71RgzqjXtYvdgGIKa1xqXwUczstcZ5Zy4+NIfvVMyM6sFS6GEuvraN96mIiSM7SqVdx25EfGkZ7z/BHtYe0NT7ridaGrp058ncrXMHNv/vT+D5+j0AXi5ORJDEpLEAAAAASUVORK5CYII="
          width="26"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">Error log</h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
        <table className="m-0 py-4 prose-tr:last:!border-b">
          <thead>
            <tr>
              <th>Time</th>
              <th>Server</th>
              <th>Process</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div
                style={{
                  height: '200px',
                  width: '600px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Loading style={{ margin: 'auto' }} />
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
                  <div>No Error Log to display.</div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-lightest">
                  <td>{new Date(row.LogDate).toLocaleString()}</td>
                  <td>{row.ServerId}</td>
                  <td>{row.ProcessInfo}</td>
                  <td>{row.Error}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ErrorLog
