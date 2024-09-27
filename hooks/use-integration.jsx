import { useEffect, useState } from 'react'

import { execIntegration } from '~/services/integration'

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
      } catch (error) {
        console.log(error, 'aaa')
        setError(error)
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
