import { Button, Col, Row, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { GenericTable } from '~/components/table/genericTable'
import { useExecQueryContext } from '~/services/state-manager/execQuery'

const Options = [{ value: 'SP_Blitz', label: 'SP Blitz' }]

export const SPBlitz = ({ currentServer }) => {
  const id = currentServer.id

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const { execQuery } = useExecQueryContext()
  const [componentCode, setComponentCode] = useState('SP_Blitz')

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
      <Row gutter={16} justify={'end'}>
        <Col>
          <Select
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
      <Row>
        <GenericTable data={data ?? []} loading={loading} />
      </Row>
    </>
  )
}
