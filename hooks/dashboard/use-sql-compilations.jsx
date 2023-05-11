import useSWR from 'swr'

import { getLogSQLCompilationsCount } from '~/services/dashboard'

const useSQLCompilations = (serverId, lastMinutes = 60) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `log-sql-compilations-count/${serverId}/${lastMinutes}`,
    async () => {
      if (!serverId) return
      const { data } = await getLogSQLCompilationsCount(serverId, lastMinutes)
      return data
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  return {
    data,
    mutate,
    error,
    isLoading,
    isValidating,
  }
}

export default useSQLCompilations
