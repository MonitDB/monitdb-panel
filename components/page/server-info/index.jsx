import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import DatabaseIcons from '~/helpers/database-icons'
import { getServerMetrics } from '~/services/servers'

export const ServerInfo = ({ currentServer }) => {
  const [serverMetrics, setServerMetrics] = useState()
  const router = useRouter()
  useEffect(() => {
    if (router?.query?.id) {
      const fetch = async () => {
        const { data } = await getServerMetrics({ id: router?.query?.id })
        setServerMetrics(data)
      }
      fetch()
    }
  }, [router?.query?.id])

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
        <p className="text-sm">
          {serverMetrics
            ? `${Math.round(
                serverMetrics?.osProperties['Memory MB'] / 1024
              )}GB Memory / ${
                serverMetrics?.osProperties['Logic Processors']
              } Intel CPUs /
                        ${serverMetrics?.osProperties['OS_Plataform']}`
            : 'Loading...'}
        </p>
      </div>
    </div>
  )
}
