import useSWR from 'swr'

import { getLogBatchRequestsCount } from '~/services/dashboard'

const useBatchRequests = (serverId, lastMinutes = 60) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `log-batch-requests-count/${serverId}/${lastMinutes}`,
    async () => {
      if (!serverId) return
      const { data } = await getLogBatchRequestsCount(serverId, lastMinutes)
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

export default useBatchRequests
