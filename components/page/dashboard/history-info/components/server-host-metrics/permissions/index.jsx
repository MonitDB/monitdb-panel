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

        // roleName[item.RolePrincipalName].data.push(item)
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
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }, [currentServer?.id, executeQueryComponent])

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-sm text-gray-dark font-bold">Permissions</h3>
      <div className="prose max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light">
        <Table
          pagination={data.length > 10}
          size="small"
          expandable={{
            expandedRowRender: (item, index) => (
              <tr key={index}>
                <td colSpan={1} />
                <td colSpan={2} className="border-r border-gray">
                  {item.windowsAndActivityDirectoryLogins.map((item, index) => (
                    <>
                      <span key={index}>
                        {item.MemberPrincipalName}
                        <br />
                      </span>
                    </>
                  ))}
                </td>
                <td colSpan={1}>
                  {item.sqlLogins.map((item, index) => (
                    <>
                      <span key={index}>
                        {item.MemberPrincipalName}
                        <br />
                      </span>
                    </>
                  ))}
                </td>
              </tr>
            ),
          }}
          dataSource={data}
          columns={[
            { dataIndex: 'Access', title: 'Name' },
            { dataIndex: 'windosLoginCount', title: 'Windows logins' },
            {
              dataIndex: 'activeDiretoryAccountsCount',
              title: 'Active Directory accounts ',
            },
            { dataIndex: 'sqlLoginCount', title: 'SQL logins' },
          ]}
        />
      </div>
    </div>
  )
}

export default Permissions
