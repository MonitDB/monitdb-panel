/* eslint-disable unicorn/no-null */
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Collapse, Table } from 'antd'
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import classNames from 'classnames'
import { differenceInMonths, format, isValid, parseISO } from 'date-fns'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Pie } from 'react-chartjs-2'

import ExportButton from '~/components/export-button'
import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { getVersions } from '~/services/states'
import { formatServer } from '~/utils/server'

// ---------------------------------------------------------------------------
// Apresentacao das colunas. Nada disto vai a API: e tudo juizo sobre o dado que
// ja esta no ecra.
// ---------------------------------------------------------------------------

// Traco em vez de vazio (ou de "undefined"): a celula sem dado tem de se ler
// como "nao sei", nao como "esta bem".
const DASH = <span className="text-gray">—</span>

const asText = (value) =>
  value === null || value === undefined || `${value}`.trim() === ''
    ? undefined
    : `${value}`.trim()

// A data vem "2025-01-07". O resto do produto mostra dd/mm/aaaa.
const parseDay = (value) => {
  const text = asText(value)
  if (!text) return
  const date = parseISO(text.slice(0, 10))
  return isValid(date) ? date : undefined
}

// Fim de suporte com juizo. Uma data de suporte que ja passou e o unico dado
// deste ecra que exige accao — ate agora estava a preto, igual a uma de 2030.
const supportEndState = (date) => {
  const months = differenceInMonths(date, new Date())
  if (months < 0) {
    const gone = Math.abs(months)
    return {
      tone: 'st-down',
      note:
        gone < 1
          ? 'expired this month'
          : `expired ${gone} month${gone === 1 ? '' : 's'} ago`,
    }
  }
  if (months < 12) {
    return {
      tone: 'st-warn',
      note: months < 1 ? 'expires this month' : `${months} months left`,
    }
  }
  const years = Math.floor(months / 12)
  const rest = months % 12
  return {
    tone: '',
    note: rest
      ? `${years}y ${rest}m left`
      : `${years} year${years === 1 ? '' : 's'} left`,
  }
}

const isOutOfSupport = (record) => {
  const date = parseDay(record?.supportEndDate)
  return Boolean(date) && differenceInMonths(date, new Date()) < 0
}

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
)

// Left-join dos servidores de um ambiente com as versões coletadas: toda
// instância aparece; a que não retornou versão (indisponível/sem coleta) vira
// uma linha marcada (_available:false), em vez de sumir silenciosamente.
// id === null é o grupo "Sem ambiente" (idTypeServerEnvironment NULL).
const buildEnvironmentVersions = ({ envId, servers, serverTypes, versions }) =>
  servers
    .filter((server) => (server.idTypeServerEnvironment ?? null) === envId)
    .map((server) => formatServer(server, { serverTypes }))
    .map((server) => {
      const version = versions.find((v) => v.ServerId === server.id)
      return version
        ? { ...version, ['Server Name']: server.serverName, _available: true }
        : {
            ServerId: server.id,
            ['Server Name']: server.serverName,
            _available: false,
          }
    })

// Identificadores (collation, build, portas) leem-se caracter a caracter: mono.
const renderMono = (value) =>
  asText(value) ? <span className="mn-mono">{value}</span> : DASH

// O primeiro numero que se le no grupo passa a ser o que exige accao, nao so
// quantos servidores ha.
const groupLabel = (label, rows) => {
  const expired = rows.filter((item) => isOutOfSupport(item)).length
  const missing = rows.filter((item) => !item._available).length
  return (
    <span className="flex items-baseline gap-3">
      <span>{`${label} (${rows.length})`}</span>
      {expired > 0 ? (
        <small className="st-down font-semibold">
          {expired} out of support
        </small>
      ) : undefined}
      {missing > 0 ? (
        <small className="text-gray">{missing} without collection</small>
      ) : undefined}
    </span>
  )
}

const VERSION_COLUMNS = [
  {
    dataIndex: 'Server Name',
    title: 'Name',
    width: 150,
    render: (value) => (
      <span className="mn-mono font-medium text-gray-dark">
        {value}
      </span>
    ),
  },
  {
    key: 'state',
    title: 'Status',
    width: 130,
    // Ponto + palavra: a cor sozinha nao e sinal.
    render: (_, record) =>
      record._available ? (
        <span className="st st-ok">
          <i />
          Collected
        </span>
      ) : (
        <span className="st st-down">
          <i />
          Not collected
        </span>
      ),
  },
  {
    dataIndex: 'version',
    title: 'Version',
    width: 150,
    render: (value) => asText(value) ?? DASH,
  },
  {
    dataIndex: 'edition',
    title: 'Edition',
    width: 150,
    // "Developer Edition (64-bit)" -> "Developer (64-bit)":
    // a coluna ja se chama Edition.
    render: (value) =>
      asText(value)?.replace(
        / Edition\b/,
        ''
      ) ?? DASH,
  },
  {
    dataIndex: 'collation',
    title: 'Collation',
    width: 150,
    render: renderMono,
  },
  {
    dataIndex: 'productLevel',
    title: 'Level',
    width: 110,
    // Sem guarda isto imprimia "undefined undefined"
    // na linha de quem nao respondeu.
    render: (_, record) => {
      const parts = [
        asText(record.productLevel),
        asText(record.productUpdateLevel),
      ].filter(Boolean)
      return parts.length > 0
        ? parts.join(' ')
        : DASH
    },
  },
  {
    dataIndex: 'productVersion',
    title: 'Build',
    width: 130,
    render: renderMono,
  },
  {
    dataIndex: 'processors',
    title: 'Proc.',
    width: 80,
    render: (value) => asText(value) ?? DASH,
  },
  {
    dataIndex: 'logicalProcessors',
    title: 'Cores',
    width: 80,
    render: (value) => asText(value) ?? DASH,
  },
  {
    dataIndex: 'alwaysOn',
    title: 'Always On',
    width: 110,
    // Always On desligado e configuracao normal
    // (Developer Edition), nao e avaria: vermelho
    // aqui gastava o alarme. E o verde apanhava o
    // vazio, pintando de verde quem nem respondeu.
    render: (value) => {
      const text = asText(value)
      if (!text) return DASH
      if (text.toUpperCase() === 'DISABLED')
        return (
          <span className="st st-off">
            <i />
            Off
          </span>
        )
      if (text.toUpperCase() === 'ENABLED')
        return (
          <span className="st st-ok">
            <i />
            On
          </span>
        )
      return text
    },
  },
  {
    dataIndex: 'supportEndDate',
    title: 'Support ends',
    width: 170,
    // Uma data de fim de suporte que ja passou e o
    // unico dado deste ecra que pede accao. Estava
    // a preto, igual a uma de 2030.
    render: (value) => {
      const date = parseDay(value)
      if (!date) return DASH
      const { tone, note } =
        supportEndState(date)
      return (
        <span className={tone}>
          <span className="mn-mono">
            {format(date, 'dd/MM/yyyy')}
          </span>
          <small className="block font-normal">
            {note}
          </small>
        </span>
      )
    },
  },
]

const InstalledVersions = ({ tabName }) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()
  const pieReference = useRef(null)

  const [versions, setVersions] = useState([])

  const groupedVersions = useMemo(() => {
    if (versions.length === 0) return []
    const map = new Map()

    for (const version of versions) {
      const key = `${version.version}-${version.productUpdateLevel}`

      if (!map.has(key)) {
        map.set(key, {
          version: version?.version,
          lastUpdate: version?.lastUpdate,
          linkUpdate: version?.linkUpdate,
          productUpdateLevel: version?.productUpdateLevel,
          productVersion: version?.productVersion,
          versionNumbers: 1,
          servers: [version],
        })
      } else {
        const group = map.get(key)
        group.versionNumbers += 1
        group.servers.push(version)
      }
    }
    return [...map.values()]
  }, [versions])

  const chartPieData = useMemo(() => {
    return {
      labels: [
        ...groupedVersions.map(
          ({ version, productUpdateLevel }) =>
            version + ' ' + productUpdateLevel
        ),
      ],
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

  const onClick = () => {
    const { current: chart } = pieReference

    if (!chart) {
      return
    }
  }

  const getData = async () => {
    const { data } = await getVersions()

    if (!data) return

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
                    style={{ cursor: 'pointer', zIndex: 1 }}
                  />
                </div>
                <div className="w-full md:w-10/12 md:pl-10">
                  <Table
                    size="small"
                    pagination={false}
                    dataSource={groupedVersions}
                    columns={[
                      {
                        title: 'Versions',
                        dataIndex: 'version',
                        key: 'version',
                        render: (text, record, index) => (
                          <div className="w-full flex items-center space-x-2">
                            <i
                              className="w-5 h-5 block"
                              style={{
                                backgroundColor:
                                  chartPieData.datasets[0].backgroundColor[
                                    index
                                  ],
                              }}
                            />
                            <span className="font-bold">{text}</span>
                            <span className="text-gray text-xs ">
                              {record.productUpdateLevel}{' '}
                            </span>
                          </div>
                        ),
                      },
                      {
                        title: 'Last Update',
                        dataIndex: 'lastUpdate',
                        key: 'lastUpdate',
                        render: (text, record) => {
                          return (
                            <a
                              href={record.linkUpdate}
                              className="inline-flex items-center space-x-2 text-blue no-underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FontAwesomeIcon icon={faDownload} />
                              <span>
                                {record.productLevel} {text}
                              </span>
                            </a>
                          )
                        },
                      },
                    ]}
                    //  rowKey={(record) => record}
                  />
                </div>
              </div>

              <div className="w-full h-100vh prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0">
                <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
                  <ExportButton
                    className="btn btn--small md:ml-auto"
                    data={versions}
                    fileName={'VERSIONS_'}
                    disabled={isLoading}
                  />
                </header>

                <div className="mn-versions -mx-4 py-4 px-8 bg-white md:-mx-6">
                  {
                    <Collapse
                      defaultActiveKey={[
                        ...serverEnvironments.map(({ id }) => `${id}`),
                        'no-env',
                      ]}
                      items={[
                        ...serverEnvironments.map(
                          ({ id, typeServerEnvironmentName }) => ({
                            id,
                            key: `${id}`,
                            label: typeServerEnvironmentName,
                          })
                        ),
                        // Grupo para instâncias sem ambiente atribuído — antes sumiam
                        // da tabela detalhada (o filtro por ambiente nunca casava NULL).
                        { id: null, key: 'no-env', label: 'No environment' },
                      ]
                        .map(({ id, key, label }, environmentIndex) => {
                            const filteredVersions = buildEnvironmentVersions({
                              envId: id,
                              servers,
                              serverTypes,
                              versions,
                            })

                            if (filteredVersions.length === 0) return

                            return {
                              key,
                              label: groupLabel(label, filteredVersions),

                              className: 'mb-4',
                              children: (
                                <Table
                                  size="small"
                                  pagination={filteredVersions.length > 10}
                                  key={`server-${key}-${environmentIndex}`}
                                  rowKey={(record) => record.ServerId}
                                  dataSource={filteredVersions}
                                  columns={VERSION_COLUMNS}
                                  rowClassName={(record) =>
                                    record._available
                                      ? ''
                                      : 'mn-row-unavailable'
                                  }
                                  onRow={() => ({
                                    style: { cursor: 'pointer' },
                                  })}
                                />
                              ),
                            }
                          }
                        )
                        .filter((item) => item?.children)}
                    />
                  }
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
