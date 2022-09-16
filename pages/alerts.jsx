import {
  faChevronRight,
  faDatabase,
  faFolder,
  faMagnifyingGlass,
  faTag,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import Checkbox from '~/components/form/checkbox'
import Selector from '~/components/form/selector'
import Link from '~/components/link'
import {
  PageContent,
  PageSidebar,
  PageSidebarLinksList,
  PageSidebarTitle,
  PageWrapper,
} from '~/components/page'
import Reveal from '~/helpers/reveal'
import Layout from '~/layouts/default'
import { getAlerts } from '~/services/alerts'
import { getFormattedDate } from '~/utils/formats'

const environments = ['DESENVOLVIMENTO', 'INTEGRAÇÃO', 'STAGING', 'PRODUÇÃO']

const filterData = (data) => {
  const alerts = []

  for (const item of data) {
    alerts.push(
      ...item.alerts.map((alert) => ({ ...alert, server: item.server }))
    )
  }

  return alerts
}

const AlertsPage = () => {
  const [data, setData] = useState([])
  const [sidebarEnvironmentActiveIndex, setSidebarEnvironmentActiveIndex] =
    useState(-1)
  const [sidebarShowAllServers, setSidebarShowAllServers] = useState(true)
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

  const getData = async () => {
    try {
      const response = await getAlerts()
      const dataResult = response?.data?.result || []

      setData(filterData(dataResult))
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <NextSeo title="Alerts" />
      <Layout>
        <PageWrapper>
          <PageSidebar>
            <header className="mb-4">
              <PageSidebarTitle>
                <span>Monitored servers</span>
              </PageSidebarTitle>
            </header>
            <div className="mb-10 text-sm">
              <button
                type="button"
                className="flex items-center space-x-2 mb-4"
                onClick={() => setSidebarShowAllServers(!sidebarShowAllServers)}
              >
                <FontAwesomeIcon icon={faFolder} />{' '}
                <strong>Todos os servidores</strong>
              </button>
              <div className="w-full space-y-4">
                {environments.map((environment, environmentIndex) => (
                  <div
                    key={`environment-${environmentIndex}`}
                    className="w-full pl-5"
                  >
                    <button
                      type="button"
                      className="flex items-center space-x-2"
                      onClick={() =>
                        setSidebarEnvironmentActiveIndex(environmentIndex)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className={classNames(
                          'transition-all duration-300 ease-in-out transform',
                          {
                            'rotate-90':
                              sidebarEnvironmentActiveIndex ===
                              environmentIndex,
                          }
                        )}
                      />{' '}
                      <FontAwesomeIcon icon={faFolder} />{' '}
                      <strong className="lowercase first-letter:uppercase">
                        {environment}
                      </strong>
                    </button>
                    <Reveal
                      active={
                        sidebarEnvironmentActiveIndex === environmentIndex
                      }
                    >
                      <div className="pt-4 pl-5">
                        <button
                          type="button"
                          className="flex items-center space-x-2"
                        >
                          <FontAwesomeIcon icon={faDatabase} />{' '}
                          <span>Servidor 01</span>
                        </button>
                      </div>
                    </Reveal>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-5 heading-xs">Ações</h3>
              <PageSidebarLinksList>
                <li>
                  <Link href="/alerts/">
                    Crie métricas e alertas personalizados
                  </Link>
                </li>
                <li>
                  <Link href="/alerts/">Gerenciar servidores monitorados</Link>
                </li>
                <li>
                  <Link href="/alerts/">Gerenciar grupos de servidores</Link>
                </li>
                <li>
                  <Link href="/alerts/">Configurar alertas</Link>
                </li>
                <li>
                  <Link href="/alerts/">Gerenciar supressões de alerta</Link>
                </li>
                <li>
                  <Link href="/alerts/">Assine o feed de alerta RSS</Link>
                </li>
              </PageSidebarLinksList>
            </div>
          </PageSidebar>

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
                  { value: 'production', label: 'Production' },
                  { value: 'azure-database', label: 'Azure Database' },
                  { value: 'staging', label: 'Staging' },
                  { value: 'test', label: 'Test' },
                  { value: 'simulation', label: 'Simulation' },
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
                className="block px-4 h-10 leading-10 rounded bg-blue text-white
                  text-xs uppercase lg:hover:bg-blue-light disabled:opacity-30
                  disabled:lg:hover:bg-blue"
                onClick={() => formik.resetForm()}
              >
                Limpar
              </button>
            </form>
          </PageContent>

          <PageContent>
            <table className="prose max-w-full w-full">
              <thead>
                <tr className="text-sm font-bold text-gray-dark text-left">
                  <th className="w-5 border-b-2 border-gray-light">
                    <Checkbox name="all" value="1" />
                  </th>
                  <th className="border-b-2 border-gray-light">Alert type</th>
                  <th className="border-b-2 border-gray-light w-60">
                    Source object
                  </th>
                  <th className="border-b-2 border-gray-light w-20">Status</th>
                  <th className="border-b-2 border-gray-light w-40">
                    Last updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((alert, index) => (
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
                    <td>
                      {alert.flType} - {alert.dsMessage}
                    </td>
                    <td>
                      <div className="flex items-center space-x-1 w-full">
                        <FontAwesomeIcon icon={faDatabase} />
                        <strong>{alert.server}</strong>
                      </div>
                      <div className="flex items-center flex-wrap mt-2">
                        <span className="flex items-center space-x-1 mr-2 mb-2">
                          <FontAwesomeIcon icon={faTag} />{' '}
                          <span className="rounded py-px px-1 text-xs bg-blue text-white">
                            Production
                          </span>
                        </span>
                        <span className="flex items-center space-x-1 mr-2 mb-2">
                          <FontAwesomeIcon icon={faTag} />{' '}
                          <span className="rounded py-px px-1 text-xs bg-blue text-white">
                            Release
                          </span>
                        </span>
                        {index % 2 === 0 && (
                          <span className="flex items-center space-x-1 mr-2 mb-2">
                            <FontAwesomeIcon icon={faTag} />{' '}
                            <span className="rounded py-px px-1 text-xs bg-blue text-white">
                              Staging
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
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default AlertsPage
