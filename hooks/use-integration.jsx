import { useEffect, useState } from 'react'

import { execIntegration, getIntegration } from '~/services/integration'

const useIntegrations = ({ id }) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchIntegration = async () => {
      try {
        setLoading(true)
        setError()
        const result = await execIntegration(id)
        setData(result)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchIntegration()
    } else {
      setLoading(false)
    }
  }, [id])

  return { data, loading, error }
}

export default useIntegrations
