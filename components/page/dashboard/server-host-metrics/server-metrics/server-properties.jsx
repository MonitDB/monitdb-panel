import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useSingleDashboard } from '~/hooks/index'
import useComponentContext from '~/services/state-manager/components'

const componentCode = 'LTINSPRP'
const loadingText = 'Loading...'

export const ServerProperties = () => {
  const { currentServer } = useSingleDashboard()
  const { executeQueryComponent } = useComponentContext()

  const [data, setDate] = useState()
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [result] = await executeQueryComponent(
        componentCode,
        currentServer?.id || undefined
      )
      setDate(result)
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
      <h4 className="mb-4 text-sm text-gray-dark">Server properties</h4>
      <div className="w-full mb-4 prose max-w-full prose-p:m-0 prose-td:align-top prose-tr:border-gray-light prose-headings:m-0">
        <table className="m-0 py-4 prose-tr:last:!border-b">
          <tbody>
            <tr>
              <td>Collation:</td>
              <td>{loading ? loadingText : data?.Collation}</td>
            </tr>
            <tr>
              <td>Creation date:</td>
              <td>
                {loading
                  ? loadingText
                  : moment(data ? data['Installation Date'] : '').format(
                      'DD/MM/YYYY'
                    )}
              </td>
            </tr>
            {}
            <tr>
              <td>Compatibility level:</td>
              <td>{loading ? loadingText : data?.Compatibility_level}</td>
            </tr>
            <tr>
              <td>State:</td>
              <td>{loading ? loadingText : data?.State}</td>
            </tr>
            <tr>
              <td>Page verify:</td>
              <td>{}</td>
            </tr>
            <tr>
              <td>Read only:</td>
              <td>Disabled</td>
            </tr>
            <tr>
              <td>Query store:</td>
              <td>Enabled</td>
            </tr>
            <tr>
              <td>Auto shrink:</td>
              <td>Enabled</td>
            </tr>
            <tr>
              <td>Auto create stats:</td>
              <td>Enabled</td>
            </tr>
            <tr>
              <td>Auto update stats:</td>
              <td>Enabled</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
