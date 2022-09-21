import {
  faCheck,
  faChevronRight,
  faFileExport,
  faXmark,
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
import classNames from 'classnames'
import faker from 'faker'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'
import { Line, Pie } from 'react-chartjs-2'

import Link from '~/components/link'
import {
  PageContent,
  PageSidebar,
  PageSidebarLinksList,
  PageWrapper,
} from '~/components/page'
// import GlobalContext from '~/contexts/global'
import Reveal from '~/helpers/reveal'
import Layout from '~/layouts/default'

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

const tableDataItems = labels.map(() => ({
  title: `desktop-0i${faker.datatype.number({
    min: 1,
    max: 999,
  })}${faker.random.word()}/(local)`,
  dbName: faker.random.word(),
  jobs: {
    success: faker.datatype.number({ min: 1, max: 999 }),
    fail: faker.datatype.number({ min: 0, max: 10 }),
    lastRun: faker.date.recent(),
    lastRunDuration: `${faker.datatype.number({ min: 0, max: 5 })}s`,
    nextRun: faker.date.future(),
  },
}))

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

const tabs = [
  {
    name: 'Versões instaladas',
    slug: 'installed-versions',
  },
  {
    name: 'Uso de disco',
    slug: 'disk-usage',
  },
  {
    name: 'Backups',
    slug: 'backups',
  },
  {
    name: 'SQL Agent Jobs',
    slug: 'sql-agent-jobs',
  },
  {
    name: 'SQL Server Licensing',
    slug: 'sql-server-licensing',
  },
]

const EstatePage = () => {
  // const {
  //   globalState: { servers, serverEnvironments },
  // } = useContext(GlobalContext)
  const router = useRouter()
  const [isExpandedIndex, setIsExpandedIndex] = useState(-1)
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [tabActive, setTabActive] = useState()

  const toggleIsExpandedIndex = (index) => {
    setIsExpandedIndex(isExpandedIndex === index ? -1 : index)
  }

  // useEffect(() => {
  //   tabActive?.name && servers && getData()
  // }, [tabActive?.name, servers]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const filteredTab = tabs.find((tab) => tab.slug === router?.query?.tab)

    filteredTab ? setTabActive(filteredTab) : setTabActive(tabs[0])
  }, [router.asPath, router.query])

  return (
    <>
      <NextSeo title="Propriedades - MonitDB" />
      <Layout>
        <PageWrapper className="p-8">
          <PageSidebar>
            <PageSidebarLinksList>
              {tabs.map((type, typeIndex) => (
                <li key={`sidebar-tab-${type.slug}-${typeIndex}`}>
                  <Link
                    href={`/estates/?tab=${type.slug}`}
                    className={classNames({
                      active: tabActive?.slug === type.slug,
                    })}
                  >
                    {type.name}
                  </Link>
                </li>
              ))}
            </PageSidebarLinksList>
          </PageSidebar>

          <PageContent>
            <header className="mb-10 w-full">
              <h1 className="heading-lg">{tabActive?.name}</h1>
            </header>

            <div className="flex items-center mb-20">
              <div className="w-full md:w-1/3">
                <Pie data={chartPieData} />
              </div>
              <div className="w-full md:w-2/3 md:pl-10">
                <table className="prose w-full max-w-full">
                  <thead>
                    <tr>
                      <th>Versões</th>
                      <th>Última atualização</th>
                      <th>Data de lançamento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartPieData.labels.map((label, labelIndex) => (
                      <tr key={`label-${labelIndex}`}>
                        <td>{label}</td>
                        <td>Última atualização</td>
                        <td>Data de lançamento</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="w-full prose max-w-full">
              <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                <button type="button" className="btn btn--small md:ml-auto">
                  <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                  Exportar
                </button>
              </header>

              <table className="m-0">
                <thead>
                  <tr>
                    <th>Nome do servidor</th>
                    <th>Categoria de trabalho</th>
                    <th>Execuções</th>
                    <th>
                      Sucesso
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="ml-1 text-success"
                      />
                    </th>
                    <th>
                      Falha{' '}
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="ml-1 text-danger"
                      />
                    </th>
                    <th>Última corrida</th>
                    <th>Próxima corrida</th>
                    <th>Última duração</th>
                  </tr>
                </thead>
                {tableDataItems.map((item, itemIndex) => (
                  <tbody
                    key={`item-${itemIndex}`}
                    className={[
                      'transition-all duration-150 ease-in-out',
                      isExpandedIndex === itemIndex && 'bg-white',
                    ].join(' ')}
                  >
                    <tr className="border-b-0">
                      <td>
                        <button
                          type="button"
                          onClick={() => toggleIsExpandedIndex(itemIndex)}
                        >
                          <FontAwesomeIcon
                            icon={faChevronRight}
                            className={[
                              'mr-1 transition-all duration-150 ease-in-out',
                              isExpandedIndex === itemIndex && 'rotate-90',
                            ].join(' ')}
                          />
                          <strong className="lowercase">{item.title}</strong>
                        </button>
                      </td>
                      <td>
                        <span className="block text-xs">
                          Manutenção do banco de dados
                        </span>
                        DBA - {item.dbName}
                      </td>
                      <td>{item.jobs.success + item.jobs.fail}</td>
                      <td>{item.jobs.success}</td>
                      <td>{item.jobs.fail}</td>
                      <td className="text-xs">
                        02/08/2022
                        <br />
                        às 23:42m
                      </td>
                      <td className="text-xs">
                        24/08/2022
                        <br />
                        às 22:00m
                      </td>
                      <td>{item.jobs.lastRunDuration}</td>
                    </tr>
                    <tr
                      className={
                        itemIndex < labels.length - 1 &&
                        'border-b border-b-gray border-opacity-50'
                      }
                    >
                      <td colSpan={8}>
                        <Reveal active={isExpandedIndex === itemIndex}>
                          <div className="px-4 pb-4">
                            <h2 className="mt-0 mb-2 text-base font-bold text-gray font-oxygen">
                              Histórico de execução
                            </h2>
                            <Line
                              options={options}
                              data={chartData}
                              height={50}
                            />
                          </div>
                        </Reveal>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </PageContent>
        </PageWrapper>
      </Layout>
    </>
  )
}

export default EstatePage
