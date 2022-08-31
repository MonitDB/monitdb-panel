import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import React from 'react'

import Selector from '~/components/form/selector'
import { PageWrapper } from '~/components/page'
import Layout from '~/layouts/default'

const DashboardPage = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      status: [],
      group: [],
      monitor: [],
    },
    onSubmit: (values) => {
      console.log('submit', values)
    },
  })
  return (
    <Layout>
      <PageWrapper className="p-8">
        <div className="w-full max-w-full">
          <div className="flex items-center justify-between">
            <p className="mr-10 text-center">
              <strong className="block text-2xl">12</strong>{' '}
              <span className="text-sm">instâncias</span>
            </p>
            <form
              className="w-full flex items-center space-x-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="relative min-w-56">
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 h-10 bg-white leading-10 rounded outline-none text-sm"
                  placeholder="Filtrar por nomes"
                  onChange={formik.handleChange}
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
                type="submit"
                disabled={true}
                className="block px-4 h-10 leading-10 rounded bg-blue text-white
                  text-xs uppercase lg:hover:bg-blue-light disabled:opacity-30
                  disabled:lg:hover:bg-blue"
              >
                Limpar
              </button>
            </form>
          </div>
        </div>
      </PageWrapper>
    </Layout>
  )
}

export default DashboardPage
