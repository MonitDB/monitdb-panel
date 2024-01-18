/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
import { Button, Col, Collapse, Row } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { Portal } from 'react-portal'

import Loading from '~/components/loading'
import { PageContent } from '~/components/page'
import EnvironmentServers from '~/components/page/states/backups/environment-servers-backups'
import DatabaseBackupsModal from '~/components/page/states/backups/modal'
import useGlobal from '~/hooks/use-global'
import { getBackups } from '~/services/states'
import { filterServersByEnvironmentId, formatServer } from '~/utils/server'

const Backups = ({ tabName }) => {
  const {
    globalState: { servers, serverTypes, serverEnvironments },
  } = useGlobal()

  const [environmentExpandedIndices, setEnvironmentExpandedIndices] = useState(
    new Set()
  )
  const [databaseBackupsModal, setDatabaseBackupsModal] = useState({
    isOpen: false,
    data: undefined,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [backups, setBackups] = useState([])
  const [expand, setExpand] = useState(false)

  const getData = useCallback(async () => {
    const { data } = await getBackups()

    if (!data) return

    setBackups(data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Row gutter={12}>
              <Col>
                <Button
                  disabled={isLoading}
                  type="dashed"
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
                      (_, index) => index
                    )
                    setEnvironmentExpandedIndices(allEnvironmentIndices)
                    setExpand(true)
                  }}
                >
                  Expand All
                </Button>
              </Col>
            </Row>
          </div>
        </header>
      </PageContent>

      <PageContent removeSidebarMargin={true}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="space-y-3">
            <Collapse
              activeKey={environmentExpandedIndices}
              onChange={setEnvironmentExpandedIndices}
              items={serverEnvironments
                .map(({ id, typeServerEnvironmentName }, environmentIndex) => {
                  const environmentServers = filterServersByEnvironmentId(
                    id,
                    servers
                  ).map((server) => formatServer(server, { serverTypes }))

                  if (environmentServers.length === 0) return
                  return {
                    key: environmentIndex,
                    label: typeServerEnvironmentName,
                    children: (
                      <EnvironmentServers
                        backups={backups}
                        servers={environmentServers}
                        onSetBackupsModal={setDatabaseBackupsModal}
                        expand={expand}
                      />
                    ),
                  }
                })
                .filter((item) => item?.children)}
            />
          </div>
        )}
      </PageContent>
      <Portal>
        <DatabaseBackupsModal
          modal={databaseBackupsModal}
          onSetModalData={setDatabaseBackupsModal}
        />
      </Portal>
    </>
  )
}

export default Backups
