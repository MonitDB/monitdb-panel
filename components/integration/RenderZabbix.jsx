import { Result } from 'antd'

import { useIntegration } from '~/hooks/index'

import { default as Loading } from '../loading'

const RenderZabbix = ({ id }) => {
  const { data, error, loading } = useIntegration({ id })

  if (loading) return <Loading />

  if (error)
    return <Result status="error" title="Error to load the integration" />
  return <h1>abbix information {data}</h1>
}

export default RenderZabbix
