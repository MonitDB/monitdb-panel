import { Button, Col, Row, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { GenericTable } from '~/components/table/genericTable'
import { useUser } from '~/hooks/index'
import { useExecQueryContext } from '~/services/state-manager/execQuery'
import {
  FeatureFunction,
  hasPermission,
  TypeGrant,
} from '~/utils/hasPermission'

export const TuningAdvisor = ({ currentServer }) => {
  const id = currentServer.id

  const { userState: user } = useUser()

  const DefaultOptions = [
    { value: 'SP_Blitz', label: 'SP Blitz' },
    { value: 'SP_BlitzAnalysis', label: 'SP Blitz Analysis' },
    { value: 'SP_BlitzBackups', label: 'SP Blitz Backups' },
    { value: 'SP_Cache', label: 'SP Blitz Cache' },
    { value: 'SP_BlitzFirst', label: 'SP Blitz First' },
    { value: 'SP_BlitzIndex', label: 'SP Blitz Index' },
    { value: 'SP_BlitzLock', label: 'SP Blitz Lock' },
    { value: 'SP_BlitzQueryStore', label: 'SP Blitz Query Store' },
    { value: 'SP_BlitzWho', label: 'SP Blitz Who' },
  ]

  const Options = DefaultOptions.filter((option) => {
    if (option.value === 'SP_Blitz') {
      return hasPermission(user, FeatureFunction.SP_BLITZ, TypeGrant.EXECUTE)
    }
    if (option.value === 'SP_BlitzAnalysis') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_ANALYSIS,
        TypeGrant.EXECUTE
      )
    }

    if (option.value === 'SP_BlitzBackups') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_BACKUP,
        TypeGrant.EXECUTE
      )
    }

    if (option.value === 'SP_BlitzFirst') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_FIRST,
        TypeGrant.EXECUTE
      )
    }
    if (option.value === 'SP_BlitzIndex') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_INDEX,
        TypeGrant.EXECUTE
      )
    }
    if (option.value === 'SP_BlitzLock') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_LOCK,
        TypeGrant.EXECUTE
      )
    }
    if (option.value === 'SP_BlitzQueryStore') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_QUERY_STORE,
        TypeGrant.EXECUTE
      )
    }
    if (option.value === 'SP_BlitzWho') {
      return hasPermission(
        user,
        FeatureFunction.SP_BLITZ_WHO,
        TypeGrant.EXECUTE
      )
    }

    if (option.value === 'SP_BlitzCache') {
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
  const { execQuery } = useExecQueryContext()
  const [componentCode, setComponentCode] = useState('')

  const fetchData = useCallback(
    async (cached = true) => {
      try {
        setLoading(true)
        const data = await execQuery(componentCode, id, cached)
        setData(data)
      } catch {
        toast.error('Error fetching SP_Blitz data')
      } finally {
        setLoading(false)
      }
    },
    [execQuery, id, componentCode]
  )

  // Fetch data on component mount
  useEffect(() => {
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
          <Button
            type="primary"
            loading={loading}
            onClick={() => fetchData(false)}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      <GenericTable
        data={data ?? []}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
      />
    </>
  )
}
