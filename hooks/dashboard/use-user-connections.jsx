import useSWR from 'swr'

import { getLogUserConnectionsCount } from '~/services/dashboard'

const useUserConnections = (serverId, lastMinutes = 60) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `log-user-connections-count/${serverId}/${lastMinutes}`,
    async () => {
      if (!serverId) return
      const { data } = await getLogUserConnectionsCount(serverId, lastMinutes)
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

export default useUserConnections
