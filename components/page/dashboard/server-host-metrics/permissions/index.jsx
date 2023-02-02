import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

import Chart from '~/components/chart'
import Grid from '~/components/grid'

const Permissions = () => {
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
          <tbody>
            <tr>
              <td>
                <button type="button" className="whitespace-nowrap truncate">
                  <FontAwesomeIcon width={7} height={7} icon={faChevronRight} />
                  <span className="truncate ml-2">sysadmin</span>
                </button>
              </td>
              <td>3</td>
              <td>3</td>
              <td>1</td>
            </tr>
            <tr>
              <td>
                <button type="button" className="whitespace-nowrap truncate">
                  <FontAwesomeIcon width={7} height={7} icon={faChevronRight} />
                  <span className="truncate ml-2">serveradmin</span>
                </button>
              </td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>
                <button type="button" className="whitespace-nowrap truncate">
                  <FontAwesomeIcon width={7} height={7} icon={faChevronRight} />
                  <span className="truncate ml-2">securityadmin</span>
                </button>
              </td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
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
