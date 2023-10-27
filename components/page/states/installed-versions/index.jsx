import { faDatabase, faDownload } from '@fortawesome/free-solid-svg-icons'
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
import classNames from 'classnames'
import { format, parseISO } from 'date-fns'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getElementAtEvent, Pie } from 'react-chartjs-2'

import ExportButton from '~/components/export-button'
import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { getVersions } from '~/services/states'
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

const InstalledVersions = ({ tabName }) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()
  const pieReference = useRef(null)

  const [versions, setVersions] = useState([])

  const groupedVersions = useMemo(() => {
    if (versions.length === 0) {
      return versions
    }

    const versionsGroup = []

    for (const version of versions) {
      const index = versionsGroup.findIndex(
        ({ Version }) => Version === version.Version
      )

      if (index !== -1) {
        versionsGroup[index] = {
          ...versionsGroup[index],
          versionNumbers: versionsGroup[index].versionNumbers + 1,
        }
      } else {
        versionsGroup.push({
          ...version,
          versionNumbers: 1,
        })
      }
    }

    return versionsGroup
  }, [versions])

  const chartPieData = useMemo(() => {
    return {
      labels: [...groupedVersions.map(({ Version }) => Version)],
      datasets: [
        {
          label: '',
          data: [
            ...groupedVersions.map(({ versionNumbers }) => versionNumbers),
          ],
          backgroundColor: [
            'rgba(24, 53, 89, 0.2)',
            'rgba(42, 94, 157, 0.2)',
            'rgba(51, 109, 194, 0.2)',
            'rgba(60, 133, 223, 0.2)',
            'rgba(103, 169, 241, 0.2)',
            'rgba(135, 142, 237, 0.2)',
            'rgba(61, 87, 128, 0.2)',
            'rgba(114, 149, 205, 0.2)',
            'rgba(90, 116, 158, 0.2)',
          ],
          borderColor: '#fff',
          borderWidth: 1.5,
          hoverBorderColor: [
            'rgba(24, 53, 89, 0.2)',
            'rgba(42, 94, 157, 0.2)',
            'rgba(51, 109, 194, 0.2)',
            'rgba(60, 133, 223, 0.2)',
            'rgba(103, 169, 241, 0.2)',
            'rgba(135, 142, 237, 0.2)',
            'rgba(61, 87, 128, 0.2)',
            'rgba(114, 149, 205, 0.2)',
            'rgba(90, 116, 158, 0.2)',
          ],
          hoverBorderWidth: 1.5,
        },
      ],
    }
  }, [groupedVersions])

  const onClick = (event) => {
    const { current: chart } = pieReference

    if (!chart) {
      return
    }

    printElementAtEvent(getElementAtEvent(chart, event))
  }

  const printElementAtEvent = (element) => {
    if (element.length === 0) return

    const { datasetIndex, index } = element[0]

    // eslint-disable-next-line no-console
    console.log(
      chartPieData.labels[index],
      chartPieData.datasets[datasetIndex].data[index]
    )
  }

  const getData = async () => {
    const { data } = await getVersions()

    if (!data) return

    // eslint-disable-next-line no-console
    console.log('versions', data)

    setVersions(data)
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    getData()
  }, [])

  return (
    <div className="relative">
      <div
        className={classNames({
          'absolute top-9 left-0 w-full h-full z-10 bg-white bg-opacity-30':
            isLoading,
        })}
      />
      <PageContent
        removeSidebarMargin={true}
        hideBreadcrumbs={true}
        className="flex flex-wrap items-start justify-between"
      >
        <header className="pt-8 w-full">
          <h1 className="heading-lg">{tabName}</h1>
        </header>
      </PageContent>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          {groupedVersions?.length > 0 ? (
            <PageContent removeSidebarMargin={true}>
              <div className="flex items-center mb-20">
                <div className="w-full md:w-2/12">
                  <Pie
                    ref={pieReference}
                    data={chartPieData}
                    onClick={onClick}
                  />
                </div>
                <div className="w-full md:w-10/12 md:pl-10">
                  <table className="prose w-full max-w-full">
                    <thead>
                      <tr>
                        <th>Versões</th>
                        <th>Última atualização</th>
                        {/* <th>Data de lançamento</th> */}
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {groupedVersions.map(
                        (
                          { Version, ProductLevel, LastUpdate, LinkUpdate },
                          labelIndex
                        ) => (
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
                                <strong>{Version}</strong>
                              </div>
                            </td>
                            <td>
                              <a
                                href={LinkUpdate}
                                className="inline-flex items-center space-x-2 text-blue no-underline"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <FontAwesomeIcon icon={faDownload} />
                                <span>
                                  {ProductLevel} {LastUpdate}
                                </span>
                              </a>
                            </td>
                            {/* <td>28 Sep 2022</td> */}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0">
                <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                  <ExportButton
                    className="btn btn--small md:ml-auto"
                    data={versions}
                    fileName={'VERSIONS_'}
                    disabled={isLoading}
                  />
                </header>

                <div className="-mx-4 py-4 px-8 bg-white md:-mx-6">
                  <table className="m-0">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Versões</th>
                        {/* <th>Status | Nº da versão</th> */}
                        <th>Última atualização disponível</th>
                        <th>Fim do suporte principal</th>
                      </tr>
                    </thead>

                    {servers?.length
                      ? serverEnvironments.map(
                          (
                            { id, typeServerEnvironmentName },
                            environmentIndex
                          ) => {
                            const filteredServers =
                              filterServersByEnvironmentId(id, servers).map(
                                (server) =>
                                  formatServer(server, { serverTypes })
                              )

                            const filteredVersions = []

                            for (let version of versions) {
                              const server = filteredServers.find(
                                (server) => server.id === version.ServerId
                              )

                              if (!server) continue

                              filteredVersions.push({
                                ...version,
                                Server: server.serverName,
                              })
                            }

                            if (filteredVersions.length === 0) {
                              return ''
                            }

                            return (
                              <tbody key={`server-${id}-${environmentIndex}`}>
                                <tr>
                                  <td colSpan="5">
                                    <h3 className="heading-xs pt-5">
                                      {typeServerEnvironmentName}
                                    </h3>
                                  </td>
                                </tr>
                                {filteredVersions.map(
                                  (
                                    {
                                      Server,
                                      Version,
                                      Edition,
                                      SuportEndDate,
                                      LastUpdate,
                                      ProductLevel,
                                      LinkUpdate,
                                    },
                                    index
                                  ) => (
                                    <tr key={`server-production-${index}`}>
                                      <td className="border-l-4 border-gray">
                                        <FontAwesomeIcon
                                          icon={faDatabase}
                                          className="mr-2"
                                        />
                                        {Server}
                                      </td>
                                      <td>
                                        <p>
                                          {Version}
                                          <br />
                                          <span className="text-xs">
                                            {Edition}
                                          </span>
                                        </p>
                                      </td>
                                      {/* <td>
                                    <div className="w-full flex items-center space-x-4">
                                      <FontAwesomeIcon
                                        icon={faUpload}
                                        className="text-lg text-gray-dark"
                                      />
                                      <p>
                                        RTM CU29, June 14, 2022
                                        <br />
                                        <span className="text-xs">
                                          14.0.3445.2
                                        </span>
                                      </p>
                                    </div>
                                  </td> */}
                                      <td>
                                        <a
                                          href={LinkUpdate}
                                          className="inline-flex items-center space-x-2 text-blue no-underline"
                                          target="_blank"
                                          rel="noreferrer"
                                        >
                                          <FontAwesomeIcon icon={faDownload} />
                                          <span>
                                            {ProductLevel} {LastUpdate}
                                          </span>
                                        </a>
                                        {/* <p>
                                      <span className="text-xs">
                                        Released 13 days ago on 20 Sep 2022
                                      </span>
                                    </p> */}
                                      </td>
                                      <td>
                                        {format(
                                          parseISO(SuportEndDate),
                                          'dd MMM yyyy'
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            )
                          }
                        )
                      : undefined}
                  </table>
                </div>
              </div>
            </PageContent>
          ) : undefined}
        </>
      )}
    </div>
  )
}

export default InstalledVersions
