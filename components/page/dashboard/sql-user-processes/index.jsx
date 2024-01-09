import React, { useCallback, useEffect, useState } from 'react'

import Image from '~/components/image'
import { GenericTable } from '~/components/table/genericTable'

import useComponentContext from '../../../../services/state-manager/components'

const COMPONENT_CODE = 'LTTPPR'

function SqlUserProcesses(properties) {
  const { currentServer } = properties
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const { executeQueryComponent } = useComponentContext()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const data = await executeQueryComponent(
      COMPONENT_CODE,
      currentServer?.id || undefined
    )
    setData(data)
    setLoading(false)
  }, [currentServer?.id, executeQueryComponent])

  return (
    <div id="sqlprocesses" className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATAQMAAAC0i49FAAAABlBMVEUAAAB3d3daxsy0AAAAAXRSTlMAQObYZgAAACdJREFUCNdj/M/AcJDh//8DDkwMQAAmGMFicADhfmBgIKTk/wcMJQBnHBDweU6BeQAAAABJRU5ErkJggg=="
          width="26"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">
          SQL user processes (top 10 by CPU)
        </h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <div style={{ overflowY: 'auto' }}>
        <GenericTable
          data={data}
          loading={loading}
          columnAlias={[
            'Session ID',
            'Last Request Time',
            'Login Name',
            'Host Name',
            'Program Name',
            'Query',
            'Status',
            'Database Name',
            'CPU',
            'Reads',
            'Writes',
            'Logical Reads',
          ]}
        />
      </div>
    </div>
  )
}

export default SqlUserProcesses
