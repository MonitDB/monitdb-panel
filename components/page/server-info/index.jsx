import { useEffect, useState } from 'react'

import DatabaseIcons from '~/helpers/database-icons'
import { getServerMetrics } from '~/services/servers'

export const ServerInfo = ({ currentServer }) => {
  const [serverMetrics, setServerMetrics] = useState()

  useEffect(() => {
    if (currentServer.id) {
      const fetch = async () => {
        try {
          const { data } = await getServerMetrics({ id: currentServer.id })
          setServerMetrics(data)
        } catch {
          setServerMetrics()
        }
      }

      fetch()
    }
  }, [currentServer.id])

  const memoryMB = serverMetrics?.osProperties?.['Memory MB']
  const logicProcessors = serverMetrics?.osProperties?.['Logic Processors']

  const memoryInfo = memoryMB
    ? `${Math.round(memoryMB / 1024)}GB Memory / ${logicProcessors} CPUs`
    : 'Memory information not available'

  return (
    <div className="w-full flex items-center gap-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full border border-gray-light">
        <DatabaseIcons
          name={currentServer.type.typeServerName}
          className="w-9 h-9"
        />
      </div>
      <div>
        <h4 className="heading-md">{currentServer.serverName}</h4>
        <p className="text-sm">{serverMetrics ? memoryInfo : 'Loading...'}</p>
      </div>
    </div>
  )
}
