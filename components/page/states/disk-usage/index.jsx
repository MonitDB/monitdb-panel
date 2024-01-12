/* eslint-disable sonarjs/no-duplicate-string */
import { Button, Col, Collapse, Row } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'

import ExportButton from '~/components/export-button'
import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import Servers from '~/components/page/states/disk-usage/servers'
import useGlobal from '~/hooks/use-global'
import { getDiskUsage } from '~/services/states'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const DiskUsage = ({ tabName }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [diskUsage, setDiskUsage] = useState([])
  const [environmentExpandedIndices, setEnvironmentExpandedIndices] = useState(
    new Set()
  )
  const [expand, setExpand] = useState(false)

  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const getData = async () => {
    const { data } = await getDiskUsage()

    if (!data) return

    setDiskUsage(data)
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    getData()
  }, [])

  if (servers?.length === 0) {
    return ''
  }

  return (
    <>
      <PageContent
        removeSidebarMargin={true}
        hideBreadcrumbs={true}
        className="flex flex-wrap items-start justify-between"
      >
        <header className="pt-8 w-full flex flex-col md:flex-row md:justify-between md:items-end">
          <h1 className="heading-lg">{tabName}</h1>
          <div>
            <div>
              <Row gutter={12}>
                <Col>
                  <Button
                    type="dashed"
                    disabled={isLoading}
                    onClick={() => {
                      setEnvironmentExpandedIndices([])

                      setTimeout(() => {
                        setExpand(false)
                      }, 100)
                    }}
                  >
                    Collapse All
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    disabled={isLoading}
                    onClick={() => {
                      const allEnvironmentIndices = serverEnvironments.map(
                        (_, index) => index
                      )
                      setEnvironmentExpandedIndices(allEnvironmentIndices)
                      setExpand(true)
                    }}
                  >
                    Expand All
                  </Button>
                </Col>
                <Col>
                  <ExportButton
                    disabled={isLoading}
                    data={diskUsage}
                    fileName={'DISK_USAGE'}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </header>
      </PageContent>

      <PageContent removeSidebarMargin={true}>
        <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-th:border-b-4 prose-headings:m-0">
          {isLoading ? (
            <Loading />
          ) : (
            <div className="space-y-3">
              <Collapse
                activeKey={environmentExpandedIndices}
                items={serverEnvironments
                  ?.map(
                    ({ id, typeServerEnvironmentName }, environmentIndex) => {
                      const environmentServers = filterServersByEnvironmentId(
                        id,
                        servers
                      ).map((server) => formatServer(server, { serverTypes }))
                      if (environmentServers.length === 0) return {}
                      return {
                        key: `${environmentIndex}`,
                        label: (
                          <div className="flex items-center">
                            <span>{typeServerEnvironmentName}</span>
                          </div>
                        ),
                        children: (
                          <Servers
                            environmentServers={environmentServers}
                            diskUsage={diskUsage}
                            expand={expand}
                          />
                        ),
                      }
                    }
                  )
                  .filter((item) => item.children)}
              />
            </div>
          )}
        </div>
      </PageContent>
    </>
  )
}

export default DiskUsage
