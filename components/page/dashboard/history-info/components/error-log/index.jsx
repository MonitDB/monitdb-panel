import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import ExportButton from '~/components/export-button'
import Image from '~/components/image'
import { GenericTable } from '~/components/table/genericTable'

import useComponentContext from '../../../../../../services/state-manager/components'

const COMPONENT_CODE = 'LTELG1'

function ErrorLog(properties) {
  const { currentServer } = properties
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const { executeQueryComponent } = useComponentContext()
  const router = useRouter()
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
    <div id="error-log" className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAABK0lEQVR42qzUUUobURQG4IlgphtRdBFFuoQWLIYUX/qQ4OdiWlBwDWpdigQXoE21XYKJefn7kJaZTKYjYjlPc+G7/Peec6dI8bIqXgm8cejKDwsL310a6ncAA7+kUff2W4ENZyKujWzp69s2NhFxYmMdnIlHnxsRe0Zm4qQBDMSjt23HtGcmf4Mtl0o/pb67SO1rLO6Xx18uHIrrlV1XQc9EDCtwJUb/BikciYsKTMVWJ9gRdxVYyGqD1kApnl4BpmK7a4LsitsKfBPjTnAszivwSUz0Oq71RgzqjXtYvdgGIKa1xqXwUczstcZ5Zy4+NIfvVMyM6sFS6GEuvraN96mIiSM7SqVdx25EfGkZ7z/BHtYe0NT7ridaGrp058ncrXMHNv/vT+D5+j0AXi5ORJDEpLEAAAAASUVORK5CYII="
          width="26"
          height="18"
        />

        <h3 className="text-sm text-gray-dark font-bold">Error log</h3>
        <div style={{ width: '200px', marginLeft: 'auto' }}>
          <ExportButton data={data} />
        </div>
      </div>

      <GenericTable data={data} loading={loading} maxLength={150} />
    </div>
  )
}

export default ErrorLog
