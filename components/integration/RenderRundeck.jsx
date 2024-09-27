import { Result } from 'antd'

import { useIntegration } from '~/hooks/index'

import { default as Loading } from '../loading'

const RenderRundeck = ({ id }) => {
  const { data, loading, error } = useIntegration({ id })
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
