import { Table } from 'antd'
import React, { useEffect, useState } from 'react'

import ExportButton from '~/components/export-button'
import { PageContent } from '~/components/page'
import useGlobal from '~/hooks/use-global'
import { getSqlServerLicensing } from '~/services/states'

const SqlServerLicensing = ({ tabName }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [sqlServerLicensing, setSqlServerLicensing] = useState([])

  const {
    globalState: { servers },
  } = useGlobal()

  const getData = async () => {
    const { data } = await getSqlServerLicensing()

    if (!data) return

    // eslint-disable-next-line no-console
    console.log('sql server licensing', data)

    setSqlServerLicensing(data)
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
        <header className="pt-8 w-full">
          <h1 className="heading-lg">{tabName}</h1>
        </header>
      </PageContent>

      <PageContent removeSidebarMargin={true}>
        <div className="w-full prose max-w-full prose-p:m-0 prose-th:border-b-4 prose-headings:m-0 prose-td:align-middle">
          <header className="flex flex-col mb-5 md:flex-row md:justify-between md:items-center">
            <div className="w-full md:w-3/4">
              <h2 className="heading-md">Licence Info</h2>
            </div>

            <ExportButton
              disabled={isLoading}
              data={sqlServerLicensing}
              fileName={'SQL_SERVER_LICENSING'}
            />
          </header>

          <Table
            loading={isLoading}
            dataSource={sqlServerLicensing}
            pagination={false}
            columns={[
              { dataIndex: 'Server Name', title: 'Server Name' },
              { dataIndex: 'processors', title: 'Processors' },
              { dataIndex: 'coresPerProcessors', title: 'Cores' },
              { dataIndex: 'license', title: 'Licence' },
              { dataIndex: 'alwaysOn', title: 'Always On' },
              // { dataIndex: 'SQLInstance', title: 'SQL Instance' },
              { dataIndex: 'version', title: 'Version' },
            ]}
          />
        </div>
      </PageContent>
    </>
  )
}

export default SqlServerLicensing
