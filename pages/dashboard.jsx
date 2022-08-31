import {
  faBell,
  faCircleInfo,
  faMagnifyingGlass,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import React from 'react'

import Select from '~/components/form/select'
import Selector from '~/components/form/selector'
import Link from '~/components/link'
import Layout from '~/layouts/default'

const alerts = [
  {
    name: 'Error log entry',
    generalAlerts: 2,
    activeAlerts: 0,
    type: 'warning',
  },
  {
    name: 'Error log entry',
    generalAlerts: 11,
    activeAlerts: 0,
    type: 'info',
  },
]

const DashboardPage = () => {
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

  return (
    <Layout>
      <div className="flex flex-col w-full max-w-full xl:flex-row">
        <div
          className="w-full bg-gray-dark text-white p-8
            xl:fixed xl:top-16 xl:right-0 xl:w-80 xl:h-[calc(100vh-64px)]"
        >
          <header className="mb-4">
            <h3 className="mb-4 flex items-center space-x-2 text-xl font-bold">
              <FontAwesomeIcon icon={faBell} />
              <span>Últimos alertas</span>
            </h3>
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
                    <p>{alertItem.name}</p>
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
                    {alertItem.generalAlerts}
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
        </div>
        <div className="flex items-start justify-between p-8 w-full xl:pr-96">
          <p className="mr-10 text-center">
            <strong className="block text-2xl">12</strong>{' '}
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
        </div>
      </div>
    </Layout>
  )
}

export default DashboardPage
