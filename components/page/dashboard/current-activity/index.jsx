// import 'ace-builds/src-min-noconflict/ext-language_tools'
// import 'ace-builds/src-min-noconflict/mode-mysql'
// import 'ace-builds/src-noconflict/ace'
// import 'ace-builds/src-noconflict/theme-github'
import '@uiw/react-textarea-code-editor/dist.css'

import { Button, Descriptions, Modal, Table } from 'antd'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'

import { Select } from '~/components/form'
import Highlighter from '~/components/highlighter'
import QueryPlanRenderer from '~/components/qp-render'
import useComponentContext from '~/services/state-manager/components'

const componentsOption = [
  { value: 'LTWISACT', label: 'WHO IS ACTIVE' },
  { value: 'LTWHO2', label: 'WHO2' },
]

const [WHO_IS_ACT, WHO_IS_ACT2] = componentsOption

// eslint-disable-next-line sonarjs/cognitive-complexity
function CurrentActivity(properties) {
  const { currentServer } = properties

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [componentCode, setComponentCode] = useState(WHO_IS_ACT.value)
  const { executeQueryComponent } = useComponentContext()

  const [modalData, setModalData] = useState({ open: false })

  useEffect(() => {
    fetchData()
  }, [fetchData, componentCode])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setData([])

    const result = await executeQueryComponent(
      componentCode,
      currentServer?.id || undefined
    )
    data[componentCode] = result
    setData(data)
    setLoading(false)
  }, [componentCode, currentServer?.id, data, executeQueryComponent])

  const headerSection = (
    <>
      <br />
      <h3 className="font-bold mb-6">Current Activity</h3>

      <div className="flex flex-row justify-between items-center items-center gap-2 w-60 ml-auto">
        <Select
          className="w-40"
          name={'component'}
          options={componentsOption}
          onChange={setComponentCode}
          value={componentCode}
        />

        <Button
          type="primary"
          loading={loading}
          onClick={() => {
            setComponentCode(componentCode)
            fetchData()
          }}
        >
          Refresh
        </Button>
      </div>
    </>
  )

  if (componentCode === WHO_IS_ACT.value)
    return (
      <div>
        <div className="w-full min-h-96">
          {headerSection}
          <div className="prose baleiaprose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
            <Table
              loading={loading}
              size="small"
              dataSource={data[componentCode]}
              columns={[
                { dataIndex: 'session_id', title: 'Session ID' },
                { dataIndex: 'host_name', title: 'Host Name' },
                { dataIndex: 'login_name', title: 'Login Name' },
                { dataIndex: 'status', title: 'status' },
              ]}
              onRow={(record) => ({
                style: { cursor: 'pointer' },
                onClick: () => {
                  setModalData({ ...modalData, open: true, ...record })
                },
              })}
            />

            <Modal
              open={modalData.open}
              width={850}
              onOk={() => {
                setModalData({ ...modalData, open: false })
              }}
              closable={false}
              cancelButtonProps={{ style: { display: 'none' } }}
            >
              <div style={{ height: '500px', overflowY: 'auto' }}>
                <QueryPlanRenderer queryPlan={modalData.query_plan} />
                <Descriptions column={2} layout="vertical">
                  <Descriptions.Text label="CPU">
                    {modalData.CPU ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="CPU Delta">
                    {modalData.CPU_Delta ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Blocking Session ID">
                    {modalData.blocking_session_id || '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Collection Time">
                    {modalData.collection_time
                      ? moment(modalData.collection_time).format(
                          'DD/MM/YYYY HH:mm:sss'
                        )
                      : '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Database Name">
                    {modalData.database_name ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Time">
                    {modalData['00 00:38:26.080'] ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Host Name">
                    {modalData.host_name ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Login Name">
                    {modalData.login_name ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Open transactions count">
                    {modalData.open_tran_count ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Percent Complete">
                    {modalData.percent_compete ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Program Name">
                    {modalData.program_name}
                  </Descriptions.Text>
                  <Descriptions.Text label="Reads">
                    {modalData.reads ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Reads Delta">
                    {modalData.reads_delta ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Program Name">
                    {modalData.program_name ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="SQL Command">
                    {modalData.sql_command ?? '-'}
                  </Descriptions.Text>

                  <Descriptions.Text label="Status">
                    {modalData.status ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="Wait Information">
                    {modalData.wait_info ?? '-'}
                  </Descriptions.Text>
                  <Descriptions.Text label="writes">
                    {modalData.writes ?? '-'}
                  </Descriptions.Text>
                </Descriptions>
                <Highlighter language={'sql'}>{modalData.sql_text}</Highlighter>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    )

  if (componentCode === WHO_IS_ACT2.value)
    return (
      <div>
        <div className="w-full min-h-96">
          {headerSection}
          <div className="prose baleiaprose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
            <Table
              loading={loading}
              size="small"
              dataSource={data[componentCode]?.map((d, index) => ({
                ...d,
                key: index,
              }))}
              expandable={{
                expandedRowRender: (record) => (
                  <Table
                    pagination={false}
                    dataSource={[record]}
                    columns={[
                      { dataIndex: 'Command', title: 'Command' },
                      { dataIndex: 'CPUTime', title: 'CPU Time' },
                      { dataIndex: 'DiskIO', title: 'Disk IO' },
                      { dataIndex: 'LastBatch', title: 'Last Batch' },
                      { dataIndex: 'ProgramName', title: 'Program Name' },
                      { dataIndex: 'REQUESTID', title: 'Request ID' },
                    ]}
                  />
                ),
              }}
              columns={[
                {
                  dataIndex: 'SPID',
                  title: 'SPID',
                  render: (value) => value[0],
                },
                {
                  dataIndex: 'HostName',
                  title: 'Host Name',
                },
                { dataIndex: 'DBName', title: 'Database Name' },
                { dataIndex: 'Status', title: 'Status' },
              ]}
              onRow={() => ({ style: { cursor: 'pointer' } })}
            />
          </div>
        </div>
      </div>
    )
}

export default CurrentActivity
