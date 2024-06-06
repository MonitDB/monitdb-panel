/* eslint-disable no-console */
/* eslint-disable sonarjs/no-identical-functions */
import { Table } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'

import useComponentContext from '~/services/state-manager/components'
const COMPONENT_CODE = 'LTPERM'

const Permissions = (properties) => {
  const { currentServer } = properties

  const [data, setData] = useState([])
  const { executeQueryComponent } = useComponentContext()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchData = useCallback(async () => {
    try {
      const data = await executeQueryComponent(
        COMPONENT_CODE,
        currentServer?.id || undefined
      )

      const roleName = {}
      if (!Array.isArray(data)) {
        setData([])
        return
      }

      for (const item of data) {
        if (!roleName[item.RolePrincipalName])
          roleName[item.RolePrincipalName] = {
            windosLoginCount: 0,
            sqlLoginCount: 0,
            activeDiretoryAccountsCount: 0,
            windowsAndActivityDirectoryLogins: [],
            sqlLogins: [],
            name: item.RolePrincipalName,
          }

        if (item.TypeLogin === 'WINDOWS_LOGIN') {
          roleName[
            item.RolePrincipalName
          ].windowsAndActivityDirectoryLogins.push(item)
        } else if (item.TypeLogin === 'SQL_LOGIN') {
          roleName[item.RolePrincipalName].sqlLogins.push(item)
        }

        roleName[item.RolePrincipalName] = {
          ...roleName[item.RolePrincipalName],
          windosLoginCount:
            item.TypeLogin === 'WINDOWS_LOGIN'
              ? roleName[item.RolePrincipalName].windosLoginCount + 1
              : roleName[item.RolePrincipalName].windosLoginCount,
          sqlLoginCount:
            item.TypeLogin === 'SQL_LOGIN'
              ? roleName[item.RolePrincipalName].sqlLoginCount + 1
              : roleName[item.RolePrincipalName].sqlLoginCount,
          activeDiretoryAccountsCount:
            item.TypeLogin === 'WINDOWS_LOGIN'
              ? roleName[item.RolePrincipalName].activeDiretoryAccountsCount + 1
              : roleName[item.RolePrincipalName].activeDiretoryAccountsCount,
        }
      }
      setData(Object.values(roleName))
    } catch (error) {
      console.error(error)
    }
  }, [currentServer?.id, executeQueryComponent])

  const expandedRowRender = (record) => {
    const { sqlLogins, windowsAndActivityDirectoryLogins } = record

    const columns = [
      {
        key: 'windows',
        render: () => {
          return (
            <Table
              size="small"
              showHeader={false}
              style={{ width: '100%' }}
              pagination={false}
              dataSource={windowsAndActivityDirectoryLogins}
              columns={[{ dataIndex: 'MemberPrincipalName' }]}
            />
          )
        },
      },
      {
        key: 'sql',
        render: () => {
          return (
            <Table
              showHeader={false}
              size="small"
              pagination={false}
              dataSource={sqlLogins}
              columns={[{ dataIndex: 'MemberPrincipalName' }]}
            />
          )
        },
      },
    ]

    return (
      <div>
        <Table
          size="small"
          showHeader={false}
          columns={columns}
          dataSource={[record]}
          pagination={false}
          rowKey="MemberPrincipalName"
        />
      </div>
    )
  }

  return (
    <div className="mt-6" id="permissions">
      <h3 className="mb-4 text-sm text-gray-dark font-bold">Permissions</h3>
      <Table
        pagination={data.length > 10}
        size="small"
        expandable={{ expandedRowRender }}
        dataSource={data}
        columns={[
          { dataIndex: 'name', title: 'Role Principal Name' },
          { dataIndex: 'windosLoginCount', title: 'Windows Logins' },
          { dataIndex: 'sqlLoginCount', title: 'SQL Logins' },
        ]}
        rowKey="name"
      />
    </div>
  )
}

export default Permissions
