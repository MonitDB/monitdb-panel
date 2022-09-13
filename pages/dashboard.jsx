import {
  faBell,
  faChevronDown,
  faCircleInfo,
  faDatabase,
  faMagnifyingGlass,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import Select from '~/components/form/select'
import Selector from '~/components/form/selector'
import Grid from '~/components/grid'
import Link from '~/components/link'
import {
  PageContent,
  PageSidebar,
  PageSidebarTitle,
  PageWrapper,
} from '~/components/page'
import Reveal from '~/helpers/reveal'
import Layout from '~/layouts/default'
import { getDashboard } from '~/services/dashboard'

const filterAlerts = (servers) => {
  const alerts = []

  for (const server of servers) {
    alerts.push(...server.alerts)
  }

  return alerts
}

const DashboardPage = () => {
  const [data, setData] = useState([])
  const [alerts, setAlerts] = useState([])
  const [indexActive, setIndexActive] = useState(0)

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

  const toggleIndexActive = (index) => {
    setIndexActive(indexActive === index ? -1 : index)
  }

  const getData = async () => {
    try {
      const response = await getDashboard()
      const dataResult = response?.data?.result || []

      setData(dataResult)
      setAlerts(filterAlerts(dataResult))
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <>
      <NextSeo title="Dashboard" />
      <Layout>
        <PageWrapper>
          <PageSidebar>
            <header className="mb-4">
              <PageSidebarTitle>
                <FontAwesomeIcon icon={faBell} />
                <span>Últimos alertas</span>
              </PageSidebarTitle>
              <p className="text-sm">
                Alertas gerados ou atualizados recentemente:
              </p>
            </header>
            <form className="mb-4 flex items-center space-x-2">
              <Select
                name="hour"
                options={[
                  { value: '3', label: '3 days' },
                  { value: '1440', label: '24 hours' },
                  { value: '720', label: '12 hours' },
                  { value: '360', label: '6 hours' },
                  { value: '180', label: '3 hours' },
                  { value: '60', label: '1 hour' },
                  { value: '15', label: '15 minutes' },
                ]}
              />
              <Select
                name="group"
                options={[
                  { value: '', label: 'Todos os grupos' },
                  { value: 'production', label: 'Production' },
                  { value: 'azure-database', label: 'Azure Database' },
                  { value: 'staging', label: 'Staging' },
                  { value: 'test', label: 'Test' },
                  { value: 'simulation', label: 'Simulation' },
                ]}
              />
            </form>
            <ul>
              {alerts.map((alertItem, alertIndex) => (
                <li
                  key={`dashboard-${alertIndex}`}
                  className="py-2 border-b border-gray-light border-opacity-25"
                >
                  <Link
                    href="/dashboard/"
                    className={classNames(
                      'flex items-center space-x-2 border-l-2 pl-2 text-sm transition-all duration-150 ease-in-out lg:hover:border-l-8',
                      {
                        'border-orange': alertItem.type === 'warning',
                        'border-blue': alertItem.type === 'info',
                      }
                    )}
                  >
                    <span className="w-6 min-w-6 text-lg">
                      {alertItem.type === 'info' && (
                        <FontAwesomeIcon icon={faCircleInfo} />
                      )}
                      {alertItem.type === 'warning' && (
                        <FontAwesomeIcon icon={faWarning} />
                      )}
                    </span>
                    <div className="w-full">
                      <p>{alertItem.dsMessage}</p>
                      <p className="text-xs text-opacity-50 text-white">
                        {alertItem.activeAlerts} alertas ativos
                      </p>
                    </div>
                    <span
                      className={classNames(
                        'flex items-center justify-center rounded-full w-6 min-w-6 h-6 ml-auto text-xs',
                        {
                          'bg-blue': alertItem.type === 'info',
                          'bg-orange': alertItem.type === 'warning',
                        }
                      )}
                    >
                      1
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="py-4">
              <Link
                href="/dashboard/alerts"
                className="py-2 px-4 bg-blue text-white rounded text-xs lg:hover:bg-blue-light"
              >
                Ver todos
              </Link>
            </div>
          </PageSidebar>

          {data.length > 0 ? (
            <>
              <PageContent
                hideBreadcrumbs={true}
                className="flex items-start justify-between border-b border-gray-light"
              >
                <p className="mr-10 text-center">
                  <strong className="block text-2xl">{data.length}</strong>{' '}
                  <span className="text-sm">instâncias</span>
                </p>
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

              <PageContent hideBreadcrumbs={true}>
                <div className="w-full">
                  <button
                    type="button"
                    className="w-full py-2 px-4 bg-white border border-gray-light space-x-4
                      rounded-sm font-bold text-left text-sm md:w-2/3"
                    onClick={() => toggleIndexActive(0)}
                  >
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={classNames(
                        'transition-all duration-300 ease-in-out transform',
                        {
                          'rotate-180': indexActive !== 0,
                        }
                      )}
                    />
                    <span>1 - Production ({data.length})</span>
                  </button>
                  <Reveal active={indexActive === 0}>
                    <Grid className="py-2 gap-y-4 md:py-4">
                      {data.map((server, index) => (
                        <div
                          key={`server-production-${index}`}
                          className="col-span-1 border border-gray-light md:col-span-4 lg:col-span-3"
                        >
                          <Link
                            href="/dashboard/"
                            className={classNames(
                              `block bg-white p-2 relative border-l-4 lg:p-4 lg:hover:border-l-8`,
                              {
                                'border-l-orange': server.alerts.length > 0,
                                'border-l-blue': server.alerts.length === 0,
                                'opacity-25': !server.serverenable,
                              }
                            )}
                          >
                            <h4 className="flex items-center text-sm space-x-2 mb-2 lg:mb-4">
                              <FontAwesomeIcon
                                icon={faDatabase}
                                className="text-base"
                              />
                              <span>{server.servername}</span>
                            </h4>
                            <dl className="text-xs w-full text-gray">
                              <dt className="block text-gray-dark mt-2">
                                Memory
                              </dt>
                              <dd>
                                <span className="text-success">
                                  {
                                    server.dashboardDetails?.[0]
                                      ?.memoryAvailableSize
                                  }{' '}
                                  GB - Free
                                </span>{' '}
                                /{' '}
                                <span>
                                  {
                                    server.dashboardDetails?.[0]
                                      ?.memoryTotalSize
                                  }{' '}
                                  GB Total
                                </span>
                              </dd>
                              <dd className="mt-1 w-full h-1 block relative bg-gray-light">
                                <span
                                  className="absolute top-0 left-0 h-full bg-success"
                                  style={{
                                    width: `${server.dashboardDetails?.[0]?.memoryAvailableSizePercent}%`,
                                  }}
                                />
                              </dd>
                              <dt className="block text-gray-dark mt-2">
                                Disk
                              </dt>
                              <dd>
                                <span className="text-success">
                                  {
                                    server.dashboardDetails?.[0]
                                      ?.diskAvailableSize
                                  }{' '}
                                  GB - Free
                                </span>{' '}
                                /{' '}
                                <span>
                                  {server.dashboardDetails?.[0]?.diskTotalSize}{' '}
                                  GB Total
                                </span>
                              </dd>
                              <dd className="mt-1 w-full h-1 block relative bg-gray-light">
                                <span
                                  className="absolute top-0 left-0 h-full bg-success"
                                  style={{
                                    width: `${server.dashboardDetails?.[0]?.diskAvailableSizePercent}%`,
                                  }}
                                />
                              </dd>
                            </dl>
                          </Link>
                        </div>
                      ))}
                    </Grid>
                  </Reveal>
                </div>
              </PageContent>
            </>
          ) : (
            ''
          )}
        </PageWrapper>
      </Layout>
    </>
  )
}

export default DashboardPage
