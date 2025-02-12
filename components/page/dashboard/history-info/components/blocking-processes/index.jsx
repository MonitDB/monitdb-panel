import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import Image from '~/components/image'
import { GenericTable } from '~/components/table/genericTable'

import useComponentContext from '../../../../../../services/state-manager/components'

const COMPONENT_CODE = 'LTBLPR1'

function BlockingProcesses(properties) {
  const { currentServer } = properties
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const { executeQueryComponent } = useComponentContext()

  useEffect(() => {
    fetchData()
  }, [fetchData, router.query.lastMinutes])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await executeQueryComponent(
        COMPONENT_CODE,
        currentServer?.id || undefined,
        Number(router.query.lastMinutes ?? 60)
      )
      setData(data)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }, [currentServer?.id, executeQueryComponent, router.query.lastMinutes])

  return (
    <div id="blocking-processes" className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATAQMAAAC0i49FAAAABlBMVEUAAAB3d3daxsy0AAAAAXRSTlMAQObYZgAAACdJREFUCNdj/M/AcJDh//8DDkwMQAAmGMFicADhfmBgIKTk/wcMJQBnHBDweU6BeQAAAABJRU5ErkJggg=="
          width="26"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">
          Blocking processes (top 10 by time)
        </h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <GenericTable
        data={data}
        loading={loading}
        columnAlias={[
          'Session ID',
          'Login time',
          'Occurrence time',
          'Host',
          'Program name',
          'Status',
          'Database',
          'Total blocking time',
        ]}
      />
    </div>
  )
}

export default BlockingProcesses
