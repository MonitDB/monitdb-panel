/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
import { Button, Col, Collapse, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { useCallback } from 'react'

import Loading from '~/components/loading'
import PageContent from '~/components/page/content/content'
import Servers from '~/components/page/states/sql-agent-jobs/jobs/environment-servers-jobs'
import useGlobal from '~/hooks/use-global'
import { getSqlAgentPRjobs } from '~/services/states'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

function Jobs() {
  const [isLoading, setIsLoading] = useState(true)
  const [sqlAgentPRjobs, setSqlAgentPRjobs] = useState([])
  const [environmentExpandedIndices, setEnvironmentExpandedIndices] = useState(
    new Set()
  )
  const [expand, setExpand] = useState(false)

  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const getData = useCallback(async () => {
    const { data } = await getSqlAgentPRjobs()

    setSqlAgentPRjobs(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getData()
  }, [getData])

  return (
    <section className="space-y-4">
      <PageContent
        removeSidebarMargin={true}
        hideBreadcrumbs={true}
        className="flex flex-wrap items-start justify-between"
      >
        <header className="pt-8 w-full flex flex-col md:flex-row md:justify-between md:items-end">
          <h1 className="heading-lg">Jobs</h1>
          <Row gutter={12}>
            <Col>
              <Button
                type="dashed"
                disabled={isLoading}
                onClick={() => {
                  setEnvironmentExpandedIndices(new Set())

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
                    (_, index) => `${index}`
                  )
                  setEnvironmentExpandedIndices(allEnvironmentIndices)
                  setExpand(true)
                }}
              >
                Expand All
              </Button>
            </Col>
          </Row>
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
                onChange={setEnvironmentExpandedIndices}
                items={serverEnvironments
                  .map(({ id, typeServerEnvironmentName }, index) => {
                    const filteredServers = filterServersByEnvironmentId(
                      id,
                      servers
                    ).map((server) => formatServer(server, { serverTypes }))

                    const filteredJobs = []

                    for (let job of sqlAgentPRjobs) {
                      const server = filteredServers.find(
                        ({ id }) => id === job.ServerId
                      )

                      if (!server) continue

                      filteredJobs.push(job)
                    }

                    if (filteredJobs.length === 0) {
                      return {}
                    }
                    return {
                      key: index,
                      label: typeServerEnvironmentName,
                      children: (
                        <Servers
                          environmentServers={filteredServers}
                          serversJobs={filteredJobs}
                          expand={expand}
                        />
                      ),
                    }
                  })
                  .filter((item) => item?.children)}
              />
            </div>
          )}
        </div>
      </PageContent>
    </section>
  )
}

export default Jobs
