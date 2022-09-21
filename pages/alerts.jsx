import {
  faDatabase,
  faMagnifyingGlass,
  faTag,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useContext, useEffect, useState } from 'react'

import Checkbox from '~/components/form/checkbox'
import Selector from '~/components/form/selector'
import Loading from '~/components/loading'
import { PageContent, PageWrapper } from '~/components/page'
import MonitoredServersSidebar from '~/components/sidebar/monitored-servers'
import GlobalContext from '~/contexts/global'
import Layout from '~/layouts/default'
import { getAlerts, getAlertsParameter } from '~/services/alerts'
import { formatAlert } from '~/utils/alert'
import { getFormattedDate } from '~/utils/formats'

const AlertsPage = ({ data }) => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useContext(GlobalContext)
  const [alertsParameters, setAlertsParameters] = useState([])
  const [alerts, setAlerts] = useState([])
  const formik = useFormik({
    initialValues: {
      name: '',
      status: [],
      group: [],
      monitor: [],
    },
    onSubmit: (values) => {
      console.log('submit', values) // eslint-disable-line no-console
    },
  })

  useEffect(() => {
    const getAlertsParameterData = async () => {
      try {
        const responseAlertsParameter = await getAlertsParameter()
        setAlertsParameters(responseAlertsParameter?.data?.result || [])
      } catch (error) {
        console.log('error', error) // eslint-disable-line no-console
      }
    }

    getAlertsParameterData()
  }, [])

  useEffect(() => {
    if (alertsParameters.length === 0) return

    setAlerts(
      [...data].map((alert) =>
        formatAlert(alert, {
          servers,
          serverTypes,
          serverEnvironments,
          alertsParameters,
        })
      )
    )
  }, [data, servers, serverTypes, serverEnvironments, alertsParameters])

  return (
    <>
      <NextSeo title="Alerts - MonitDB" />
      <Layout>
        <PageWrapper>
          <MonitoredServersSidebar />

          <PageContent className="border-b border-gray-light">
            <form
              className="w-full flex flex-col space-y-4 xl:space-x-4 xl:space-y-0 xl:flex-row"
              onSubmit={formik.handleSubmit}
            >
              <div className="relative min-w-56">
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                  placeholder="Filtrar por nomes"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                />
                <button
                  type="submit"
                  className="group absolute top-1/2 transform -translate-y-1/2 right-4"
                >
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className="text-sm text-gray lg:group-hover:text-gray-dark"
                  />
                </button>
              </div>
              <Selector
                name="status"
                options={[
                  { value: '', label: 'Todos os status' },
                  { value: 'critical', label: 'Critical' },
                  { value: 'warning', label: 'Warning' },
                  { value: 'info', label: 'Info' },
                  { value: 'healthy', label: 'Healthy' },
                ]}
                onChange={(value) => {
                  formik.setFieldValue('status', value)
                }}
              />
              <Selector
                name="group"
                options={[
                  { value: '', label: 'Todos os grupos' },
                  ...serverEnvironments.map(
                    ({
                      idTypeServerEnvironment,
                      typeServerEnvironmentName,
                    }) => ({
                      value: idTypeServerEnvironment,
                      label: typeServerEnvironmentName,
                    })
                  ),
                ]}
                onChange={(value) => {
                  formik.setFieldValue('group', value)
                }}
              />
              <Selector
                name="monitor"
                options={[
                  { value: '', label: 'All base monitors' },
                  { value: 'primary', label: 'Primary' },
                  { value: 'secondary', label: 'Secondary' },
                  { value: 'azure', label: 'Azure' },
                  { value: 'simulation', label: 'Simulation' },
                ]}
                onChange={(value) => {
                  formik.setFieldValue('monitor', value)
                }}
              />
              <button
                type="reset"
                className="btn"
                onClick={() => formik.resetForm()}
              >
                Limpar
              </button>
            </form>
          </PageContent>

          <PageContent>
            {alerts.length > 0 ? (
              <>
                <table className="prose max-w-full w-full">
                  <thead>
                    <tr className="text-sm font-bold text-gray-dark text-left">
                      <th className="w-5 border-b-2 border-gray-light">
                        <Checkbox name="all" value="1" />
                      </th>
                      <th className="border-b-2 border-gray-light">
                        Alert type
                      </th>
                      <th className="border-b-2 border-gray-light w-60">
                        Source object
                      </th>
                      <th className="border-b-2 border-gray-light w-20">
                        Status
                      </th>
                      <th className="border-b-2 border-gray-light w-40">
                        Last updated
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert, index) => (
                      <tr
                        key={`alert-${index}`}
                        className="text-sm border-b border-gray-light transition-colors duration-200 ease-in-out lg:hover:bg-gray-light lg:hover:bg-opacity-50"
                      >
                        <td>
                          <Checkbox
                            className="transform translate-y-1"
                            name="alerts"
                            value={alert.idAlert}
                          />
                        </td>
                        <td>{alert.dsMessage}</td>
                        <td>
                          <div className="flex items-center space-x-4 w-full">
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faDatabase} />
                              <strong>{alert.server?.serverName}</strong>
                            </div>
                            {alert.serverEnvironment && (
                              <span className="flex items-center space-x-1">
                                <FontAwesomeIcon icon={faTag} />{' '}
                                <span className="rounded py-px px-1 text-xs bg-blue text-white">
                                  {
                                    alert.serverEnvironment
                                      .typeServerEnvironmentName
                                  }
                                </span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td>Enabled</td>
                        <td>{getFormattedDate(alert.dtAlert)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="flex justify-center items-center w-full min-h-28">
                <Loading light />
              </div>
            )}
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export const getServerSideProps = async () => {
  const response = await getAlerts({ pagesize: 20 })

  return {
    props: {
      data: response?.data?.result || [],
    },
  }
}

export default AlertsPage
