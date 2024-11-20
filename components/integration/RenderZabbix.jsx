import { Result, Typography } from 'antd'

import { useIntegration } from '~/hooks/index'

import { default as Loading } from '../loading'
import { GenericTable } from '../table/genericTable'
import ProblemsGetTable from './components/zabbix/ProblemsGet'

const renderTable = (data) => {
  switch (data?.method) {
    case 'problem.get':
      return <ProblemsGetTable data={data} />
    default:
      return <GenericTable data={data.result} />
  }
}

const RenderZabbix = ({ id }) => {
  const { data, error, loading } = useIntegration({ id })

  if (loading) return <Loading />

  if (data?.error || error)
    return (
      <Result
        status="error"
        title="Error to load the integration"
        subTitle={data?.error?.data || error?.message}
      />
    )
  return (
    <>
      <Typography.Title level={4}>Zabbix - Problems</Typography.Title>
      {renderTable(data)}
    </>
  )
}

export default RenderZabbix
