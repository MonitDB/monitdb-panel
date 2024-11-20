import { Result } from 'antd'
import { useEffect, useState } from 'react'

import { execIntegration } from '~/services/integration'

import { default as Loading } from '../loading'

const RenderRundeck = ({ id }) => {
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

  if (loading) return <Loading />
  if (data?.error || !!error)
    return (
      <Result
        status="error"
        title="Error to load the integration"
        subTitle={error.message}
      />
    )
  return <h1>Rundeck information {data}</h1>
}

export default RenderRundeck
