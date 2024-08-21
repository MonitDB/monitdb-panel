import { Button, Col, Result, Row, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { GenericTable } from '~/components/table/genericTable'
import { useUser } from '~/hooks/index'
import useComponentContext from '~/services/state-manager/components'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

export const TuningAdvisor = ({ currentServer }) => {
  const id = currentServer.id
  const { executeQueryComponent } = useComponentContext()

  const { userState: user } = useUser()

  const DefaultOptions = [
    { value: 'TADSPBLTZ', label: 'SP Blitz' },
    { value: 'TADSPBANL', label: 'SP Blitz Analysis' },
    { value: 'TADSPBBCK', label: ' Backups' },
    { value: 'TADSPBCAC', label: 'SP Blitz Cache' },
    { value: 'TADSPBFRT', label: 'SP Blitz First' },
    { value: 'TADSPBIDX', label: 'SP Blitz Index' },
    { value: 'TADSPBLCK', label: 'SP Blitz Lock' },
    { value: 'TADSPBQST', label: 'SP Blitz Query Store' },
    { value: 'TADSPBWHO', label: 'SP Blitz Who' },
  ]

  const Options = DefaultOptions.filter((option) => {
    if (option.value === 'TADSPBLTZ') {
      return hasPermission(user, FeatureFunction.SP_BLITZ, TypeGrant.EXECUTE)
    }
    if (option.value === 'TADSPBANL') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_ANALYSIS,
        TypeGrant.EXECUTE
      )
    }

    if (option.value === 'TADSPBBCK') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_BACKUP,
        TypeGrant.EXECUTE
      )
    }

    if (option.value === 'TADSPBFRT') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_FIRST,
        TypeGrant.EXECUTE
      )
    }
    if (option.value === 'TADSPBIDX') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_INDEX,
        TypeGrant.EXECUTE
      )
    }
    if (option.value === 'TADSPBLCK') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_LOCK,
        TypeGrant.EXECUTE
      )
    }
    if (option.value === 'TADSPBQST') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_QUERY_STORE,
        TypeGrant.EXECUTE
      )
    }
    if (option.value === 'TADSPBWHO') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_WHO,
        TypeGrant.EXECUTE
      )
    }

    if (option.value === 'TADSPBCAC') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_CACHE,
        TypeGrant.EXECUTE
      )
    }

    return true
  })

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [componentCode, setComponentCode] = useState('')
  const [error, setError] = useState()

  const fetchData = useCallback(async () => {
    try {
      setError(false)
      setLoading(true)
      const data = await executeQueryComponent(componentCode, id)
      if (data.code === 'EREQUEST') {
        setData()
        setError(data)

        return
      }
      setData(data)
    } catch {
      toast.error('Error fetching SP_Blitz data')
    } finally {
      setLoading(false)
    }
  }, [executeQueryComponent, componentCode, id])
  useEffect(() => {
    const [firstOption] = Options
    setComponentCode(firstOption.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setData()
    fetchData()
  }, [fetchData])

  return (
    <>
      <br />
      <h3 className="font-bold mb-6">SP Blitz</h3>
      <Row gutter={16} justify={'end'} style={{ marginBottom: '15px' }}>
        <Col>
          <Select
            style={{ width: '300px' }}
            options={Options}
            value={componentCode}
            onChange={setComponentCode}
          />
        </Col>
        <Col>
          <Button type="primary" loading={loading} onClick={() => fetchData()}>
            Refresh
          </Button>
        </Col>
      </Row>
      {error && (
        <Result
          status={'error'}
          title={'Error to get the data'}
          subTitle={
            error?.originalError.info.message ?? 'Error to execute the SP'
          }
        ></Result>
      )}
      {!error && (
        <GenericTable
          data={data ?? []}
          loading={loading}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      )}
    </>
  )
}
