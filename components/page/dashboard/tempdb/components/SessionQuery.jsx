import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useSingleDashboard } from '~/hooks/index'
import useLogContext from '~/services/state-manager/logs'

export const SessionQuery = ({ id }) => {
  const { currentServer } = useSingleDashboard()
  const { getTempDbSessionQuery } = useLogContext()

  const [data, setData] = useState('')

  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTempDbSessionQuery(currentServer.id, id)

      setData(data)
    } catch {
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }, [currentServer.id, getTempDbSessionQuery, id])

  useEffect(fetchData, [fetchData])

  if (loading) return 'Loading...'

  return <>{data}</>
}
