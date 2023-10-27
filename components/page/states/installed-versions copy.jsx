import {
  faCheck,
  faChevronRight,
  faDownload,
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
import faker from 'faker'
import { useState } from 'react'
import React from 'react'
import { Line, Pie } from 'react-chartjs-2'

import ExportButton from '~/components/export-button'
import Reveal from '~/helpers/reveal'

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

const InstalledVersions = () => {
  const [isExpandedIndex, setIsExpandedIndex] = useState(-1)

  const toggleIsExpandedIndex = (index) => {
    setIsExpandedIndex(isExpandedIndex === index ? -1 : index)
  }

  return (
    <>
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
                      href="/states/"
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

      <div className="w-full prose max-w-full">
        <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
          <ExportButton data={tableDataItems} fileName={'INSTALLED_VERSIONS'} />
        </header>

        <table className="m-0">
          <thead>
            <tr>
              <th>Nome do servidor</th>
              <th>Categoria de trabalho</th>
              <th>Execuções</th>
              <th>
                Sucesso
                <FontAwesomeIcon icon={faCheck} className="ml-1 text-success" />
              </th>
              <th>
                Falha{' '}
                <FontAwesomeIcon icon={faXmark} className="ml-1 text-danger" />
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
                      <Line options={options} data={chartData} height={50} />
                    </div>
                  </Reveal>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </>
  )
}

export default InstalledVersions
