import {
  faDatabase,
  faDownload,
  faFileExport,
  faMagnifyingGlass,
  faUpload,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  // Legend,
  LinearScale,
  LineElement,
  PointElement,
  // Title,
  Tooltip,
} from 'chart.js'
import { useFormik } from 'formik'
import React, { useContext } from 'react'
import { Pie } from 'react-chartjs-2'

import Selector from '~/components/form/selector'
import { PageContent } from '~/components/page'
import GlobalContext from '~/contexts/global'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  // Title,
  Tooltip
  // Legend
)

export const options = {
  responsive: true,
  scales: {
    y: {
      ticks: {
        stepSize: 1,
        beginAtZero: true,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}

const labels = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00']

export const chartData = {
  labels,
  datasets: [
    {
      // data: labels.map(() => faker.datatype.number({ min: 1, max: 3 })),
      data: [1, 2, 3, 2, 1, 2, 3],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    // {
    //   label: 'Dataset 2',
    //   data: labels.map(() => faker.datatype.number({ min: 10, max: 20 })),

    // borderColor: 'rgb(255, 99, 132)',
    // backgroundColor: 'rgba(255, 99, 132, 0.5)',
    // },
  ],
}

export const chartPieData = {
  labels: [
    'SQL Server 2019',
    'SQL Server 2017',
    'SQL Server 2016',
    'SQL Server 2012',
    'SQL Server 2008',
  ],
  datasets: [
    {
      label: '',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(24, 53, 89, 0.2)',
        'rgba(42, 94, 157, 0.2)',
        'rgba(51, 109, 194, 0.2)',
        'rgba(60, 133, 223, 0.2)',
        'rgba(103, 169, 241, 0.2)',
      ],
    },
  ],
}

const InstalledVersions = ({ tabName }) => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
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
        <header className="mb-10 w-full">
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
        <div className="flex items-center mb-20">
          <div className="w-full md:w-1/4">
            <Pie data={chartPieData} />
          </div>
          <div className="w-full md:w-3/4 md:pl-10">
            <table className="prose w-full max-w-full">
              <thead>
                <tr>
                  <th>Versões</th>
                  <th>Última atualização</th>
                  <th>Data de lançamento</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {chartPieData.labels.map((label, labelIndex) => (
                  <tr key={`label-${labelIndex}`}>
                    <td>
                      <div className="w-full flex items-center space-x-2">
                        <i
                          className="w-5 h-5 block"
                          style={{
                            backgroundColor:
                              chartPieData.datasets[0].backgroundColor[
                                labelIndex
                              ],
                          }}
                        />
                        <strong>{label}</strong>
                      </div>
                    </td>
                    <td>
                      <a
                        href="/estates/"
                        className="inline-flex items-center space-x-2 text-blue no-underline"
                        target="_blank"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        <span>RTM CU18</span>
                      </a>
                    </td>
                    <td>28 Sep 2022</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0">
          <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <button type="button" className="btn btn--small md:ml-auto">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Exportar
            </button>
          </header>

          <table className="m-0">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Versões</th>
                <th>Status | Nº da versão</th>
                <th>Última atualização disponível</th>
                <th>Fim do suporte principal</th>
              </tr>
            </thead>

            {serverEnvironments.map(
              (
                { idTypeServerEnvironment, typeServerEnvironmentName },
                environmentIndex
              ) => {
                const filteredServers = filterServersByEnvironmentId(
                  idTypeServerEnvironment,
                  servers
                ).map((server) => formatServer(server, { serverTypes }))

                if (filteredServers.length === 0) {
                  return ''
                }

                return (
                  <tbody
                    key={`server-${idTypeServerEnvironment}-${environmentIndex}`}
                  >
                    <tr>
                      <td colSpan="5">
                        <h3 className="heading-xs pt-5">
                          {environmentIndex + 1} - {typeServerEnvironmentName}
                        </h3>
                      </td>
                    </tr>
                    {filteredServers.map((server, index) => (
                      <tr key={`server-production-${index}`}>
                        <td className="border-l-4 border-gray">
                          <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                          {server.serverName}
                        </td>
                        <td>
                          <p>
                            SQL Server 2017
                            <br />
                            <span className="text-xs">
                              Express Edition (64-bit)
                            </span>
                          </p>
                        </td>
                        <td>
                          <div className="w-full flex items-center space-x-4">
                            <FontAwesomeIcon
                              icon={faUpload}
                              className="text-lg text-gray-dark"
                            />
                            <p>
                              RTM CU29, June 14, 2022
                              <br />
                              <span className="text-xs">14.0.3445.2</span>
                            </p>
                          </div>
                        </td>
                        <td>
                          <a
                            href="/estates/"
                            className="inline-flex items-center space-x-2 text-blue no-underline"
                            target="_blank"
                          >
                            <FontAwesomeIcon icon={faDownload} />
                            <span>RTM CU18</span>
                          </a>
                          <p>
                            <span className="text-xs">
                              Released 13 days ago on 20 Sep 2022
                            </span>
                          </p>
                        </td>
                        <td>11 Oct 2022</td>
                      </tr>
                    ))}
                  </tbody>
                )
              }
            )}
          </table>
        </div>
      </PageContent>
    </>
  )
}

export default InstalledVersions
