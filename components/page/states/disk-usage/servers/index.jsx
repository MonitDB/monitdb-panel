/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable sonarjs/cognitive-complexity */

import { Collapse, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'

import { getPieChartData } from '~/components/cards/server/server'
import { megaBytesToGigaBytes } from '~/utils/formats'

const Servers = ({ environmentServers, diskUsage, expand }) => {
  const [serverExpandedIndices, setServerExpandedIndices] = useState(new Set())

  useEffect(() => {
    if (expand) {
      const allEnvironmentIndices = environmentServers.map(
        (_, index) => `${index}`
      )

      setServerExpandedIndices(allEnvironmentIndices)
    } else {
      setServerExpandedIndices([])
    }
  }, [expand])

  return (
    <div className="p-3 pb-0 space-y-3">
      <Collapse
        activeKey={serverExpandedIndices}
        items={environmentServers
          .map(({ id, serverName }, index) => {
            const filteredDiskUsage = []

            for (let disk of diskUsage) {
              if (id === disk.ServerId) {
                filteredDiskUsage.push({
                  ...disk,
                  serverName,
                })
              }
            }

            return {
              key: index,
              label: (
                <>
                  {' '}
                  <div>
                    <div className="flex items-center">
                      <div style={{ marginRight: '50px' }}>{serverName}</div>
                      {filteredDiskUsage.map((disk, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: '15px',
                          }}
                        >
                          <div style={{ marginRight: '5px' }}>{disk.Drive}</div>
                          <div
                            style={{
                              width: '30px',
                              height: '30px',
                              display: 'inline-block',
                              marginRight: '5px',
                              transform: 'translateY(-0px)',
                            }}
                          >
                            <Pie
                              data={getPieChartData(disk)}
                              options={{
                                plugins: {
                                  tooltip: { enabled: false },
                                  legend: { display: false },
                                },
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ),
              children: (
                <Table
                  size="small"
                  pagination={false}
                  dataSource={filteredDiskUsage}
                  columns={[
                    { dataIndex: 'Drive', title: 'Drive' },
                    {
                      dataIndex: 'Usage(MB)',
                      title: 'Used Space',
                      render: (value) => {
                        return <div>{megaBytesToGigaBytes(value)} GB</div>
                      },
                    },
                    {
                      dataIndex: 'Free(MB)',
                      title: 'Free Space',
                      render: (value) => {
                        return <div>{megaBytesToGigaBytes(value)} GB</div>
                      },
                    },
                    {
                      dataIndex: 'Total(MB)',
                      title: 'Capacity',
                      render: (value) => {
                        return <div>{megaBytesToGigaBytes(value)} GB</div>
                      },
                    },
                    {
                      dataIndex: 'Free(%)',
                      title: 'Free Space %',
                      render: (value) => {
                        return <div>{value}%</div>
                      },
                    },
                    {
                      dataIndex: 'Usage(%)',
                      title: 'Used Space %',
                      render: (value) => {
                        return <div>{value}%</div>
                      },
                    },
                  ]}
                />
              ),
            }
          })
          .filter((item) => item.children)}
        onChange={(selectedKeys) => {
          setServerExpandedIndices(selectedKeys)
        }}
      />
    </div>
  )
}

export default Servers
