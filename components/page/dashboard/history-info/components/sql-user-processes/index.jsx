import { Alert, Select, Table, Tag, Tooltip } from 'antd'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import ExportButton from '~/components/export-button'
import Highlighter from '~/components/highlighter'
import Image from '~/components/image'

import useLogContext from '../../../../../../services/state-manager/logs'

// Este painel chamava o componente LTTPPR1, que executa
// EXEC HISTORIC.stpRead_Log_Top_Processes_By_CPU nos servidores monitorizados.
// Esse procedimento nao existe em nenhum dos quatro servidores do QA (verificado
// um a um a 28/09/2026). O erro era engolido e o ecra desenhava "No data to
// display" — falha com ar de saude. Passou a ler a HISTORIC.Log_Processes pela
// rota /log/top-processes, que nao depende de procedimento nenhum, e ao mesmo
// tempo passou a dar os seis Top 10 em vez de um.
const METRICS = [
  { value: 'cpu', label: 'CPU' },
  { value: 'reads', label: 'Physical reads' },
  { value: 'logicalReads', label: 'Logical reads' },
  { value: 'writes', label: 'Writes' },
  { value: 'waitTime', label: 'Wait time' },
  { value: 'queryCost', label: 'Query cost' },
]

const TEXT_COLUMN_MAX = 50

function SqlUserProcesses(properties) {
  const { currentServer } = properties
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [failure, setFailure] = useState()
  const [metric, setMetric] = useState('cpu')
  const { getTopProcesses } = useLogContext()
  const router = useRouter()

  const fetchData = useCallback(async () => {
    setLoading(true)
    setFailure()
    try {
      const rows = await getTopProcesses(currentServer?.id, {
        metric,
        lastMinutes: Number(router.query.lastMinutes ?? 60),
        limit: 10,
      })
      setData(Array.isArray(rows) ? rows : [])
    } catch (error) {
      // Nao repetir o padrao dos outros paineis: uma lista vazia por falha
      // le-se como "esta tudo bem". Se falhou, o ecra tem de o dizer.
      setData([])
      setFailure(error?.response?.data?.message ?? error?.message ?? 'Unknown error')
    }
    setLoading(false)
  }, [currentServer?.id, getTopProcesses, metric, router.query.lastMinutes])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const truncate = (value) => {
    if (typeof value === 'string' && value.length > TEXT_COLUMN_MAX) {
      return (
        <Tooltip title={value}>{`${value.slice(0, TEXT_COLUMN_MAX)}...`}</Tooltip>
      )
    }
    return value
  }

  const columns = [
    { title: 'Session ID', dataIndex: 'sessionId' },
    {
      title: 'Sampled at',
      dataIndex: 'createDate',
      render: (value) => (value ? moment(value).format('YYYY/MM/DD HH:mm:ss') : '—'),
    },
    { title: 'Login Name', dataIndex: 'loginName', render: truncate },
    { title: 'Host Name', dataIndex: 'hostname', render: truncate },
    { title: 'Program Name', dataIndex: 'programName', render: truncate },
    { title: 'Status', dataIndex: 'status' },
    { title: 'Database Name', dataIndex: 'dbName' },
    { title: 'CPU', dataIndex: 'cpu' },
    { title: 'Reads', dataIndex: 'reads' },
    { title: 'Writes', dataIndex: 'writes' },
    { title: 'Logical Reads', dataIndex: 'logicalReads' },
    { title: 'Wait Time', dataIndex: 'waitTime' },
  ]

  return (
    <div id="sqlprocesses" className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATAQMAAAC0i49FAAAABlBMVEUAAAB3d3daxsy0AAAAAXRSTlMAQObYZgAAACdJREFUCNdj/M/AcJDh//8DDkwMQAAmGMFicADhfmBgIKTk/wcMJQBnHBDweU6BeQAAAABJRU5ErkJggg=="
          width="26"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">
          SQL user processes (top 10)
        </h3>
        <div style={{ width: '200px', marginLeft: 'auto' }}>
          <ExportButton data={data} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-4">
        {/* Select e nao Segmented: seis rotulos lado a lado passavam dos 500 px e
            este painel vive numa grelha. */}
        <Select
          size="small"
          className="w-48"
          value={metric}
          options={METRICS}
          onChange={setMetric}
        />
        {/* A Log_Processes e uma fotografia das sessoes de X em X tempo, nao um
            acumulado. Sem este rotulo alguem compara com o dm_exec_query_stats e
            conclui que temos um defeito. */}
        <Tag color="default">Sampled</Tag>
      </div>

      {failure && (
        <Alert
          className="mb-4"
          type="error"
          showIcon
          message="Could not read the top processes"
          description={failure}
        />
      )}

      <div style={{ overflowY: 'auto' }}>
        <Table
          pagination={{ hideOnSinglePage: true }}
          locale={{
            emptyText: failure
              ? 'Request failed — see the message above.'
              : 'No sessions collected in this window.',
          }}
          loading={loading}
          size="small"
          expandable={{
            expandedRowRender: (record) => (
              <Highlighter
                showLineNumbers={true}
                maxHeight={'200px'}
                code={record.query ?? ''}
                language={'sql'}
              />
            ),
          }}
          columns={columns}
          scroll={{ x: 1300 }}
          onRow={() => ({ style: { cursor: 'pointer' } })}
          dataSource={data.map((item) => ({ ...item, key: item.id }))}
        />
      </div>
    </div>
  )
}

export default SqlUserProcesses
