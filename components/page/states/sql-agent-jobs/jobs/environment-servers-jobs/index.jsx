/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react-hooks/exhaustive-deps */

import { Collapse, Modal, Table, Tag, Tooltip } from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useCallback } from 'react'

import {
  getSqlAgentPRjobsExe,
  getSqlAgentPRjobsExecutions,
} from '~/services/states'

function Servers({ environmentServers, serversJobs, expand }) {
  const [serverExpandedIndices, setServerExpandedIndices] = useState(new Set())
  const [jobModal, setJobModal] = useState({
    isOpen: false,
    jobData: {},
  })
  const [jobsExe, setJobsExe] = useState()
  const [activeTableRowIndex, toggleActiveTableRowIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(true)
  const [jobsExecutions, setJobsExecutions] = useState()
  const [isLoadingExecutions, setIsLoadingExecutions] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const getData = useCallback(async () => {
    try {
      const serverId = jobModal.jobData?.ServerId
      const jobName = jobModal.jobData?.jobName

      if (serverId) {
        setIsLoading(true)
        toggleActiveTableRowIndex(-1)
        const { data } = await getSqlAgentPRjobsExe(serverId, {
          jobName,
          page: currentPage,
        })
        if (!data) return
        setJobsExe(data)
      }

      setIsLoading(false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  }, [jobModal.jobData?.jobName])

  const getExecutions = useCallback(
    async (runDateTime, rowIndex) => {
      try {
        const serverId = jobModal.jobData?.ServerId
        const jobName = jobModal.jobData?.jobName
        toggleActiveTableRowIndex(-1)
        if (serverId) {
          setJobsExecutions([])
          setIsLoadingExecutions(true)
          toggleActiveTableRowIndex(rowIndex)
          const { data } = await getSqlAgentPRjobsExecutions(serverId, {
            jobName,
            runDateTime,
          })
          if (!data) return

          setJobsExecutions(data)
        }

        setIsLoadingExecutions(false)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    },
    [jobModal.jobData?.jobName]
  )

  useEffect(() => {
    getData()
  }, [jobModal.jobData?.jobName, currentPage])

  useEffect(() => {
    if (expand) {
      const allEnvironmentIndices = environmentServers.map(
        (_, index) => `${index}`
      )
      setServerExpandedIndices(allEnvironmentIndices)
    } else setServerExpandedIndices(new Set())
  }, [expand])

  return (
    <>
      <div className="p-3 pb-0">
        <Collapse
          onChange={setServerExpandedIndices}
          activeKey={serverExpandedIndices}
          items={environmentServers.map(({ id, serverName }, index) => {
            const serverJobs = serversJobs.filter(
              ({ ServerId }) => ServerId === id
            )

            return {
              key: `${index}`,
              label: serverName,
              children: (
                <Table
                  size="small"
                  dataSource={serverJobs}
                  columns={[
                    { dataIndex: 'jobName', title: 'Job Name' },
                    {
                      dataIndex: 'enabled',
                      title: 'Enabled',
                      render: (value) => (
                        <Tag color={value === 'Yes' ? 'green' : 'red'}>
                          {value}
                        </Tag>
                      ),
                    },
                    {
                      dataIndex: 'createdAt',
                      title: 'Created At',
                      render: (value) =>
                        moment(value).format('DD/MM/YYYY HH:mm'),
                    },
                    {
                      dataIndex: 'frequency',
                      title: 'Frequency',
                    },
                  ]}
                  onRow={(record, index) => ({
                    style: { cursor: 'pointer' },
                    onClick: () => {
                      setJobModal({
                        isOpen: true,
                        jobData: serverJobs[index],
                      })
                    },
                  })}
                />
              ),
            }
          })}
        />
      </div>

      <Modal
        open={jobModal.isOpen}
        onOk={() => setJobModal({ ...jobModal, isOpen: false })}
        width={'80%'}
        style={{ height: '550px', overflowY: 'auto' }}
        closable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div style={{ height: '400px', overflowY: 'auto' }}>
          <h2 className="heading-md">Job</h2>
          <br />
          <Table size="small" dataSource={[jobModal.jobData]}>
            <Table.Column dataIndex="jobName" title="Job Name" />
            <Table.Column dataIndex="enabled" title="Enabled" />
            <Table.Column
              dataIndex="createdAt"
              title="Job Created Date"
              render={(value) => moment(value).format('DD/MM/YYYY HH:mm')}
            />
            <Table.Column dataIndex="frequency" title="Frequency" />
          </Table>
          <br />
          <br />
          <h2 className="heading-md">Jobs Exe</h2>
          <br />
          <Table
            size="small"
            loading={isLoading}
            dataSource={jobsExe?.data.map((data, key) => ({
              ...data,
              key,
            }))}
            expandable={{
              expandedRowRender: () => (
                <Table
                  loading={isLoadingExecutions}
                  dataSource={jobsExecutions}
                  columns={[
                    { dataIndex: 'Step_Id', title: 'Step ID' },
                    { dataIndex: 'Status', title: 'Status' },
                    {
                      dataIndex: 'Message',
                      title: 'Message',
                      render: (value) => {
                        if (value.length > 100) {
                          return (
                            <Tooltip title={value}>
                              {`${value.slice(0, 100)}...`}
                            </Tooltip>
                          )
                        }
                        return value
                      },
                    },
                  ]}
                />
              ),
              onExpand: (expanded, record) => {
                if (expanded) getExecutions(record.RunDateTime, record.key)
                else toggleActiveTableRowIndex(-1)
              },

              expandedRowKeys: [activeTableRowIndex],
            }}
            pagination={{
              current: currentPage,
              onChange: setCurrentPage,
              pageSize: 10,
              total: jobsExe?.total,
            }}
            columns={[
              {
                dataIndex: 'RunDateTime',
                title: 'Run date time',
                render: (value) => moment(value).format('DD/MM/YYYY HH:mm:ss'),
                width: '100px',
              },
              { dataIndex: 'Job', title: 'Job', width: '100px' },
              { dataIndex: 'Enabled', title: 'Enabled' },
              { dataIndex: 'Status', title: 'Status' },
              {
                dataIndex: 'RunDuration',
                title: 'Run Duration',
              },
            ]}
          />
        </div>
      </Modal>
    </>
  )
}

export default Servers
