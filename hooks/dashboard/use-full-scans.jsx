import useSWR from 'swr'

import { getLogFullScansCount } from '~/services/dashboard'

const useFullScans = (serverId, lastMinutes = 60) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `log-full-scans-count/${serverId}/${lastMinutes}`,
    async () => {
      if (!serverId) return
      const { data } = await getLogFullScansCount(serverId, lastMinutes)
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

export default useFullScans
