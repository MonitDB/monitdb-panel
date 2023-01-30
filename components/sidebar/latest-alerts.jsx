import {
  faBell,
  // faCircleInfo,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'

import Select from '~/components/form/select'
import Link from '~/components/link'
import Loading from '~/components/loading'
import { PageSidebarTitle } from '~/components/page'
import useAlerts from '~/hooks/use-alerts'
import useGlobal from '~/hooks/use-global'
import { getAlerts } from '~/services/alerts'

const combineAlertsAndParameters = ({ alerts, parameters }) => {
  const result = {}

  for (const alert of alerts) {
    const parameter = parameters.find(
      (parameter) => parameter.id === alert.idAlertParameter
    )

    if (!parameter) continue

    if (!result[parameter.id]) {
      result[parameter.id] = {
        ...parameter,
        totalAlerts: 0,
      }
    }

    result[parameter.id].totalAlerts += 1
  }

  return result
}

const LatestAlerts = () => {
  const {
    globalState: { serverEnvironments },
  } = useGlobal()

  const {
    stateAlerts: { parameters },
  } = useAlerts()

  const [alerts, setAlerts] = useState([])
  const [alertGroups, setAlertGroups] = useState([])

  const getAlertsData = useCallback(async () => {
    const responseAlerts = await getAlerts({ PageLength: 100, PageNumber: 1 })

    setAlerts(responseAlerts?.data)
  }, [])

  useEffect(() => {
    if (alerts.length === 0 || parameters.length === 0) return

    setAlertGroups(
      combineAlertsAndParameters({
        alerts,
        parameters,
      })
    )
  }, [alerts, parameters])

  useEffect(() => {
    getAlertsData()
  }, [getAlertsData])

  return (
    <div>
      <header className="mb-4">
        <PageSidebarTitle>
          <FontAwesomeIcon icon={faBell} />
          <span>Últimos alertas</span>
        </PageSidebarTitle>
        <p className="text-sm">Alertas gerados ou atualizados recentemente:</p>
      </header>

      {Object.keys(alertGroups)?.length > 0 ? (
        <>
          <form className="mb-4 flex items-center space-x-2">
            <Select
              name="hour"
              options={[
                { value: '3', label: '3 dias' },
                { value: '1440', label: '24 horas' },
                { value: '720', label: '12 horas' },
                { value: '360', label: '6 horas' },
                { value: '180', label: '3 horas' },
                { value: '60', label: '1 hora' },
                { value: '15', label: '15 minutos' },
              ]}
            />
            <Select
              name="group"
              options={[
                { value: '', label: 'Todos os grupos' },
                ...serverEnvironments.map(
                  ({ idTypeServerEnvironment, typeServerEnvironmentName }) => ({
                    value: idTypeServerEnvironment,
                    label: typeServerEnvironmentName,
                  })
                ),
              ]}
            />
          </form>
          <ul>
            {Object.keys(alertGroups).map((parameterId) => {
              const { nmAlert, totalAlerts } = alertGroups[parameterId]

              return (
                <li
                  key={`dashboard-group-${parameterId}`}
                  className="py-2 border-b border-gray-light border-opacity-25"
                >
                  <Link
                    href="/alerts/"
                    className={classNames(
                      `flex items-center space-x-2 border-l-2 pl-2 text-sm transition-all
                    duration-150 ease-in-out border-orange lg:hover:border-l-8`,
                      {
                        // 'border-orange': alertItem.type === 'warning',
                        // 'border-blue': alertItem.type === 'info',
                      }
                    )}
                  >
                    <span className="w-6 min-w-6 text-lg">
                      {/* {alertItem?.type === 'info' && (
                        <FontAwesomeIcon icon={faCircleInfo} />
                      )} */}
                      {/* {alertItem.type === 'warning' && (
                        <FontAwesomeIcon icon={faWarning} />
                      )} */}
                      <FontAwesomeIcon icon={faWarning} />
                    </span>
                    <div className="w-full">
                      <p>{nmAlert}</p>
                      <p className="text-xs text-opacity-50 text-white">
                        {totalAlerts} alertas ativo
                      </p>
                    </div>
                    <span
                      className={classNames(
                        'flex items-center justify-center rounded-full w-6 min-w-6 h-6 ml-auto text-xs bg-orange',
                        {
                          // 'bg-blue': alertItem?.type === 'info',
                          // 'bg-orange': alertItem?.type === 'warning',
                        }
                      )}
                    >
                      {totalAlerts}
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
