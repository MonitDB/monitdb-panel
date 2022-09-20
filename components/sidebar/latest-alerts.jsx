import {
  faBell,
  faCircleInfo,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useContext, useEffect, useState } from 'react'

import Select from '~/components/form/select'
import Link from '~/components/link'
import { PageSidebar, PageSidebarTitle } from '~/components/page'
import GlobalContext from '~/contexts/global'
import { getAlerts, getAlertsParameter } from '~/services/alerts'

const formatAlerts = (alerts, alertsParameter) => {
  return alertsParameter
    .map((alertParameter) => ({
      ...alertParameter,
      totalAlerts: alerts.filter(
        (alert) => alert.idAlertParameter === alertParameter.idAlertParameter
      ).length,
    }))
    .filter((alert) => alert.totalAlerts > 0)
}

const LatestAlerts = () => {
  const {
    globalState: { serverEnvironments },
  } = useContext(GlobalContext)
  const [alerts, setAlerts] = useState([])

  const getAlertsData = async () => {
    const responseAlerts = await getAlerts({ pagesize: 20 })
    const responseAlertsParemeter = await getAlertsParameter()

    const alertsFormatted = formatAlerts(
      responseAlerts?.data?.result || [],
      responseAlertsParemeter?.data?.result || []
    )

    setAlerts(alertsFormatted)
  }

  useEffect(() => {
    getAlertsData()
  }, [])

  return (
    <PageSidebar>
      <header className="mb-4">
        <PageSidebarTitle>
          <FontAwesomeIcon icon={faBell} />
          <span>Últimos alertas</span>
        </PageSidebarTitle>
        <p className="text-sm">Alertas gerados ou atualizados recentemente:</p>
      </header>
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
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((alertItem, alertIndex) => (
            <li
              key={`dashboard-${alertIndex}`}
              className="py-2 border-b border-gray-light border-opacity-25"
            >
              <Link
                href="/alerts/"
                className={classNames(
                  'flex items-center space-x-2 border-l-2 pl-2 text-sm transition-all duration-150 ease-in-out border-orange lg:hover:border-l-8',
                  {
                    // 'border-orange': alertItem.type === 'warning',
                    // 'border-blue': alertItem.type === 'info',
                  }
                )}
              >
                <span className="w-6 min-w-6 text-lg">
                  {alertItem?.type === 'info' && (
                    <FontAwesomeIcon icon={faCircleInfo} />
                  )}
                  {/* {alertItem.type === 'warning' && (
                        <FontAwesomeIcon icon={faWarning} />
                      )} */}
                  <FontAwesomeIcon icon={faWarning} />
                </span>
                <div className="w-full">
                  <p>{alertItem.nmAlert}</p>
                  <p className="text-xs text-opacity-50 text-white">
                    1 alertas ativo
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
                  {alertItem.totalAlerts}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        ''
      )}
      <div className="py-4">
        <Link
          href="/alerts/"
          className="py-2 px-4 bg-blue text-white rounded text-xs lg:hover:bg-blue-light"
        >
          Ver todos
        </Link>
      </div>
    </PageSidebar>
  )
}

export default LatestAlerts
