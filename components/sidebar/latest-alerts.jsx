/* eslint-disable no-console */
import { faBell, faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import Select from '~/components/form/select'
import Link from '~/components/link'
import Loading from '~/components/loading'
import { PageSidebarTitle } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import useAlertContext from '~/services/state-manager/alerts'

const LatestAlerts = () => {
  const {
    globalState: { serverEnvironments },
  } = useGlobal()

  const { getAlerts, getAlertsById } = useAlertContext()
  const router = useRouter()

  const [alerts, setAlerts] = useState([])

  const getAlertsData = useCallback(async () => {
    const serverId = router?.query?.id

    try {
      const responseAlerts = serverId
        ? await getAlertsById(serverId, { pageLength: 100, pageNumber: 1 })
        : await getAlerts({ pageLength: 100, pageNumber: 1 })

      console.log(responseAlerts)

      setAlerts(responseAlerts)
    } catch (error) {
      console.error(error)
    }
  }, [getAlerts, getAlertsById, router?.query?.id])

  useEffect(() => {
    try {
      getAlertsData()
    } catch (error) {
      console.error(error)
    }
  }, [getAlertsData])

  return (
    <div>
      <header className="mb-4">
        <PageSidebarTitle>
          <FontAwesomeIcon icon={faBell} />
          <span>Latest alerts</span>
        </PageSidebarTitle>
        <p className="text-sm">Alertas gerados ou atualizados recentemente:</p>
      </header>

      {alerts.length > 0 ? (
        <>
          <form className="mb-4 flex items-center space-x-2">
            <Select
              name="hour"
              containerClass="bg-white text-gray-dark"
              options={[
                { value: '1440', label: '24 hours' },
                { value: '720', label: '12 hours' },
                { value: '360', label: '6 hours' },
                { value: '180', label: '3 hour' },
                { value: '60', label: '1 hour' },
                { value: '15', label: '15 minutes' },
              ]}
              onChange={() => {}}
            />
            <Select
              name="group"
              containerClass="bg-white text-gray-dark"
              options={[
                { value: '', label: 'Todos os grupos' },
                ...serverEnvironments.map(
                  ({ idTypeServerEnvironment, typeServerEnvironmentName }) => ({
                    value: idTypeServerEnvironment,
                    label: typeServerEnvironmentName,
                  })
                ),
              ]}
              onChange={() => {}}
            />
          </form>
          <ul>
            {alerts.map((alert) => {
              const { id, alertName } = alert

              return (
                <li
                  key={`dashboard-group-${id}`}
                  className="py-2 border-b border-gray-light border-opacity-25"
                >
                  <Link
                    href={`/alerts/results/?types=${id}`}
                    className={classNames(
                      `flex items-center space-x-2 border-l-2 pl-2 text-sm transition-all
                        duration-150 ease-in-out border-orange lg:hover:border-l-8`
                    )}
                  >
                    <span className="w-6 min-w-6 text-lg">
                      <FontAwesomeIcon icon={faWarning} />
                    </span>
                    <div className="w-full">
                      <p>{alertName}</p>
                      <p className="text-xs text-opacity-50 text-white">
                        {alert.alerts.length} alertas ativo
                      </p>
                    </div>
                    <span
                      className={classNames(
                        'flex items-center justify-center rounded-full w-6 min-w-6 h-6 ml-auto text-xs bg-orange'
                      )}
                    >
                      {alert.alerts.length}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="py-4">
            <Link href="/alerts/" className="btn btn--small">
              Ver todos
            </Link>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full min-h-28">
          <Loading />
        </div>
      )}
    </div>
  )
}

export default LatestAlerts
