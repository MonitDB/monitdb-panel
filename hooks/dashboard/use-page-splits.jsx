import useSWR from 'swr'

import { getLogPageSplitsCount } from '~/services/dashboard'

const usePageSplits = (serverId, lastMinutes = 60) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `log-page-splits-count/${serverId}/${lastMinutes}`,
    async () => {
      if (!serverId) return
      const { data } = await getLogPageSplitsCount(serverId, lastMinutes)
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

export default usePageSplits
