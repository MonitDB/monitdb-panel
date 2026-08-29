import { Table, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

import ExportButton from '~/components/export-button'
import Highlighter from '~/components/highlighter'
import Image from '~/components/image'

import useComponentContext from '../../../../../../services/state-manager/components'

const COMPONENT_CODE = 'LTTPPR1'

function SqlUserProcesses(properties) {
  const { currentServer } = properties
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const { executeQueryComponent } = useComponentContext()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [fetchData, router.query.lastMinutes])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await executeQueryComponent(
        COMPONENT_CODE,
        currentServer?.id || undefined,
        Number(router.query.lastMinutes ?? 60)
      )
      setData(data)
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }, [currentServer?.id, executeQueryComponent, router.query.lastMinutes])

  return (
    <div id="sqlprocesses" className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATAQMAAAC0i49FAAAABlBMVEUAAAB3d3daxsy0AAAAAXRSTlMAQObYZgAAACdJREFUCNdj/M/AcJDh//8DDkwMQAAmGMFicADhfmBgIKTk/wcMJQBnHBDweU6BeQAAAABJRU5ErkJggg=="
          width="26"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">
          SQL user processes (top 10 by CPU)
        </h3>
        <div style={{ width: '200px', marginLeft: 'auto' }}>
          <ExportButton data={data} />
        </div>
      </div>

      <div style={{ overflowY: 'auto' }}>
        <Table
          pagination={{ hideOnSinglePage: true }}
          locale={{ emptyText: 'No data to display' }}
          loading={loading}
          size="small"
          expandable={{
            expandedRowRender: (record) => {
              return (
                <Highlighter
                  showLineNumbers={true}
                  maxHeight={'200px'}
                  code={record.query}
                  language={'sql'}
                />
              )
            },
          }}
          columns={Object?.keys(data[0] ?? [])
            .filter((key) => key != 'query')
            .map((key, index) => ({
              dataIndex: key,
              title: [
                'Session ID',
                'Last Request Time',
                'Login Name',
                'Host Name',
                'Program Name',
                'Status',
                'Database Name',
                'CPU',
                'Reads',
                'Writes',
                'Logical Reads',
              ][index],
              render: (value) => {
                const maxLength = 50
                if (value && value.length > maxLength) {
                  return {
                    children: (
                      <Tooltip title={value}>{`${value.slice(
                        0,
                        maxLength
                      )}...`}</Tooltip>
                    ),
                  }
                }
                return value
              },
            }))}
          scroll={{ x: 1300 }}
          onRow={() => ({ style: { cursor: 'pointer' } })}
          dataSource={(Array.isArray(data) ? data : []).map((item, index) => ({
            ...item,
            key: index,
          }))}
        />
      </div>
    </div>
  )
}

export default SqlUserProcesses
