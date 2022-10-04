import {
  faDatabase,
  faFileExport,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faker from 'faker'
import { useFormik } from 'formik'
import React, { useContext } from 'react'

import Selector from '~/components/form/selector'
import { PageContent } from '~/components/page'
import GlobalContext from '~/contexts/global'

const InstalledVersions = ({ tabName }) => {
  const {
    globalState: { servers, serverEnvironments },
  } = useContext(GlobalContext)

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

  if (servers?.length === 0) {
    return ''
  }

  return (
    <>
      <PageContent
        removeSidebarMargin={true}
        hideBreadcrumbs={true}
        className="flex flex-wrap items-start justify-between border-b border-gray-light"
      >
        <header className="pt-8 mb-10 w-full">
          <h1 className="heading-lg">{tabName}</h1>
        </header>
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
                ({ idTypeServerEnvironment, typeServerEnvironmentName }) => ({
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

      <PageContent removeSidebarMargin={true}>
        <div className="w-full prose max-w-full prose-p:m-0 prose-th:border-b-4 prose-headings:m-0 prose-td:align-middle">
          <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <div className="w-full md:w-3/4">
              <h2 className="heading-md">Informações de licenciamento</h2>
            </div>
            <button type="button" className="btn btn--small md:ml-auto">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Exportar
            </button>
          </header>

          <div className="-mx-6 py-4 px-8 bg-white">
            <table className="m-0">
              <thead>
                <tr>
                  <th>Nome do servidor</th>
                  <th>Processadores</th>
                  <th>Cores</th>
                  <th>Processadores lógicos</th>
                  <th>License req</th>
                  <th>Sempre ligado</th>
                  <th>Instância SQL</th>
                  <th>Versão</th>
                </tr>
              </thead>

              <tbody>
                {servers.map(({ serverName }, serverIndex) => (
                  <tr key={`server-item-${serverIndex}`}>
                    <td>
                      <span className="rounded py-px px-1 text-xs bg-blue text-white">
                        VM
                      </span>{' '}
                      <strong>{serverName}</strong>
                    </td>
                    <td>{faker.random.number()}</td>
                    <td>{faker.random.number()}</td>
                    <td>{faker.random.number()}</td>
                    <td>4 cores</td>
                    <td>{serverIndex % 2 === 0 ? 'Ativo' : 'Passivo'}</td>
                    <td>
                      <FontAwesomeIcon icon={faDatabase} className="mr-2" />{' '}
                      {faker.random.word()}
                    </td>
                    <td>
                      SQL Server 2019 <span className="text-xs">Standard</span>
                      <br />
                      <span className="text-xs">Edition (64-bit)</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContent>
    </>
  )
}

export default InstalledVersions
