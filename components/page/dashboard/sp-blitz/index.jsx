import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import { GenericTable } from '~/components/table/genericTable'
import { useExecQueryContext } from '~/services/state-manager/execQuery'

const COMPONENT_CODE = 'sp_blitz;'

export const SPBlitz = ({ currentServer }) => {
  const id = currentServer.id

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const { execQuery } = useExecQueryContext()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await execQuery(COMPONENT_CODE, id)
      setData(data)
      setLoading(false)
    } catch {
      toast.error('Error to get SP_Blitz')
    } finally {
      setLoading(false)
    }
  }, [execQuery, id])

  useEffect(fetchData, [fetchData])

  return (
    <>
      <br />
      <h3 className="font-bold mb-6">SP Blitz</h3>
      <Button
        type="primary"
        loading={loading}
        onClick={fetchData}
        className="mt-6 ml-auto bg-blue text-white px-3 h-11 rounded-[5px] font-medium flex items-center gap-1 mb-6"
      >
        Refresh
      </Button>
      <GenericTable data={data ?? []} loading={loading} />
    </>
  )
}
