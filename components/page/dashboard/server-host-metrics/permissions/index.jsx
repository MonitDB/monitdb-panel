import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import React, { useCallback, useEffect, useState } from 'react'

import Chart from '~/components/chart'
import Grid from '~/components/grid'
// import Reveal from '~/helpers/reveal'
import useComponentContext from '~/services/state-manager/components'
const COMPONENT_CODE = 'LTPERM'

const Permissions = (properties) => {
  const { currentServer } = properties

  // const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [activeTableRowIndex, setActiveTableRowIndex] = useState(-1)
  const { executeQueryComponent } = useComponentContext()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchData = useCallback(async () => {
    const data = await executeQueryComponent(
      COMPONENT_CODE,
      currentServer?.id || undefined
    )

    const roleName = {}

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
        roleName[item.RolePrincipalName].windowsAndActivityDirectoryLogins.push(
          item
        )
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
  }, [currentServer?.id, executeQueryComponent])

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-sm text-gray-dark font-bold">Permissions</h3>
      <div className="prose max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light">
        <table>
          <thead className="noscroll bg-gray-light">
            <tr>
              <th>Access</th>
              <th>Windows logins</th>
              <th>Active Directory accounts</th>
              <th>SQL logins</th>
            </tr>
          </thead>
          <tbody
            className={classNames('transition-all duration-150 ease-in-out')}
          >
            {data.map((item, index) => {
              return (
                <>
                  <tr
                    key={index}
                    className={classNames(
                      'hover:bg-gray-lightest',
                      activeTableRowIndex === index && 'bg-gray-lightest'
                    )}
                    onClick={() => {
                      if (activeTableRowIndex === index)
                        setActiveTableRowIndex(-1)
                      else setActiveTableRowIndex(index)
                    }}
                  >
                    <td>
                      <button
                        type="button"
                        className="whitespace-nowrap truncate"
                      >
                        <FontAwesomeIcon
                          width={7}
                          height={7}
                          icon={faChevronRight}
                          className={classNames(
                            'mr-1 transition-all duration-150 ease-in-out',
                            {
                              'rotate-90': activeTableRowIndex === index,
                            }
                          )}
                        />
                        <span className="truncate ml-2">{item.name}</span>
                      </button>
                    </td>
                    <td>{item.windosLoginCount}</td>
                    <td>{item.activeDiretoryAccountsCount}</td>
                    <td>{item.sqlLoginCount}</td>
                  </tr>
                  {activeTableRowIndex === index && (
                    <tr key={index}>
                      <td colSpan={1} />
                      <td colSpan={2} className="border-r border-gray">
                        {item.windowsAndActivityDirectoryLogins.map(
                          (item, index) => (
                            <>
                              <span key={index}>
                                {item.MemberPrincipalName}
                                <br />
                              </span>
                            </>
                          )
                        )}
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
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
      <h3 className="mt-6 mb-4 text-sm text-gray-dark font-bold">
        Host machine metrics (sqm-sqlmonitor)
      </h3>
      <Grid className="mt-6">
        <div className="col-span-2 md:col-span-6">
          <h6 className="mb-4 text-sm">Network utilization</h6>
          <div className="text-xs">
            <p>
              <small>Intel[R] 82574L Gigabit Network Connection</small>
            </p>
            <div className="grid grid-cols-[1fr_50px] gap-4 text-xs">
              <div
                className="w-full h-[20px]"
                style={{
                  background: `linear-gradient(90deg, rgb(60, 133, 223) 0%, rgb(60, 133, 223) 7%, rgb(216, 231, 249) 7%, rgb(216, 231, 249))`,
                }}
              />
              <span>7%</span>
            </div>
            <p className="mt-2.5">
              <small>Intel[R] 82574L Gigabit Network Connection</small>
            </p>
            <div className="grid grid-cols-[1fr_50px] gap-4 text-xs">
              <div
                className="w-full h-[20px]"
                style={{
                  background: `linear-gradient(90deg, rgb(60, 133, 223) 0%, rgb(60, 133, 223) 0%, rgb(216, 231, 249) 0%, rgb(216, 231, 249))`,
                }}
              />
              <span>0%</span>
            </div>
          </div>
        </div>
        <div className="col-span-2 md:col-span-6">
          <h4 className="mb-4 text-sm">Performance</h4>
          <div className="bg-white">
            <Chart
              height="140"
              legend={{
                show: false,
              }}
              xaxis={{
                labels: {
                  show: false,
                },
              }}
            />
          </div>
        </div>
      </Grid>
      <div>
        <h4 className="mb-4 text-sm">OS Properties</h4>
        <div className="w-full mb-4 prose max-w-full prose-p:m-0 prose-td:align-top prose-tr:border-gray-light prose-headings:m-0">
          <table className="m-0 py-4 prose-tr:last:!border-b">
            <tbody>
              <tr>
                <td>Edition</td>
                <td>Microsoft Windows Server 2016 Standard</td>
              </tr>
              <tr>
                <td>Version</td>
                <td>10.0.14393</td>
              </tr>
              <tr>
                <td>Build number</td>
                <td>14393</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Permissions
