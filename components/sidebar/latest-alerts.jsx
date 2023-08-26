/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable no-console */
import { faBell, faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

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
  const [lastMinutes, setLastMinutes] = useState(60 * 24)
  const [serverEnvironmentId, setEnvironment] = useState()

  const [loading, setLoading] = useState(false)

  const getAlertsData = useCallback(async () => {
    const serverId = router?.query?.id
    try {
      setLoading(true)

      const responseAlerts = serverId
        ? await getAlertsById(serverId, {
            lastMinutes,
          })
        : await getAlerts({ lastMinutes, serverEnvironmentId })

      setAlerts(responseAlerts)
    } catch (error) {
      toast.error('Error to get the Alerts')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [
    getAlerts,
    getAlertsById,
    lastMinutes,
    router?.query?.id,
    serverEnvironmentId,
  ])

  useEffect(getAlertsData, [getAlertsData])

  return (
    <div>
      <header className="mb-4">
        <PageSidebarTitle>
          <FontAwesomeIcon icon={faBell} />
          <span>Latest alerts</span>
        </PageSidebarTitle>
        <p className="text-sm">Alerts generated or updated recently</p>
      </header>

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
            value={lastMinutes}
            onChange={setLastMinutes}
          />
          {!router?.query?.id && (
            <Select
              name="group"
              containerClass="bg-white text-gray-dark"
              options={[
                { value: -1, label: 'Todos os grupos' },
                ...serverEnvironments.map(
                  ({ id, typeServerEnvironmentName }) => ({
                    value: id,
                    label: typeServerEnvironmentName,
                  })
                ),
              ]}
              value={serverEnvironmentId}
              onChange={setEnvironment}
            />
          )}
        </form>
        <ul>
          {loading ? (
            <div className="flex justify-center items-center w-full min-h-28">
              <Loading />
            </div>
          ) : alerts.length > 0 ? (
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
                          {alert.alerts.length} alertas ativos
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
          ) : (
            <h1> No data!</h1>
          )}
        </ul>
        <div className="py-4">
          <Link href="/alerts/" className="btn btn--small">
            Ver todos
          </Link>
        </div>
      </>
    </div>
  )
}

export default LatestAlerts
