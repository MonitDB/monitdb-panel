import { memo } from 'react'

import Chart from '~/components/chart'
import Grid from '~/components/grid'

import BatchRequests from './batch-requests'
import FullScansSec from './full-scans-sec'
import PageSplitsBatchRequests from './page-splits-batch-requests'
import PageSplitsSec from './page-splits-sec'
import SqlCompilationsBatchRequests from './sql-compilations-batch-requests'
import SqlCompilationsSec from './sql-compilations-sec'
import UserConnections from './user-connections'

const ServerMetrics = () => {
  return (
    <div className="mt-6">
      <h3 className="font-bold mb-6">SQL Server metrics</h3>
      <div>
        <h4 className="mb-6 text-sm">General</h4>
        <Grid>
          <div className="cols-span-2 md:col-span-4">
            <BatchRequests />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <SqlCompilationsBatchRequests />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <PageSplitsBatchRequests />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <SqlCompilationsSec />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <PageSplitsSec />
          </div>
          <div className="cols-span-2 md:col-span-4">
            <FullScansSec />
          </div>
          <div className="cols-span-2 md:col-span-4 bg-white pt-5 pr-2">
            <UserConnections />
          </div>
        </Grid>
      </div>

      <Grid className="mt-6">
        <div className="col-span-2 md:col-span-6">
          <h4 className="mb-4 text-sm">Latches and locks</h4>
          <div className="bg-white pt-5 pr-2 mb-4">
            <Chart
              height="140"
              title={{
                text: 'Avg. latch wait',
                offsetX: 7,
                offsetY: -5,
                floating: true,
                style: {
                  fontSize: '11px',
                  fontWeight: 'normal',
                },
              }}
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
          <div className="bg-white pt-5 pr-2 mb-4">
            <Chart
              height="140"
              title={{
                text: 'Lock timeouts / sec',
                offsetX: 7,
                offsetY: -5,
                floating: true,
                style: {
                  fontSize: '11px',
                  fontWeight: 'normal',
                },
              }}
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
          <div className="bg-white pt-5 pr-2">
            <Chart
              height="140"
              title={{
                text: 'Lock waits / sec',
                offsetX: 7,
                offsetY: -5,
                floating: true,
                style: {
                  fontSize: '11px',
                  fontWeight: 'normal',
                },
              }}
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
          <h4 className="mt-6 mb-4 text-sm">Buffer cache</h4>
          <div className="bg-white pt-5 pr-2">
            <Chart
              height="140"
              title={{
                text: 'Page life expectancy',
                offsetX: 7,
                offsetY: -5,
                floating: true,
                style: {
                  fontSize: '11px',
                  fontWeight: 'normal',
                },
              }}
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
        <div className="col-span-2 md:col-span-6">
          <h4 className="mb-4 text-sm text-gray-dark">Server properties</h4>
          <div className="w-full mb-4 prose max-w-full prose-p:m-0 prose-td:align-top prose-tr:border-gray-light prose-headings:m-0">
            <table className="m-0 py-4 prose-tr:last:!border-b">
              <tbody>
                <tr>
                  <td>Collation:</td>
                  <td>SQL_Latin1_General_CP1_CI_AS</td>
                </tr>
                <tr>
                  <td>Creation date:</td>
                  <td>18 Feb 2019 10:37</td>
                </tr>
                <tr>
                  <td>Compatibility level:</td>
                  <td>140</td>
                </tr>
                <tr>
                  <td>State:</td>
                  <td>ONLINE</td>
                </tr>
                <tr>
                  <td>Page verify:</td>
                  <td>CHECKSUM</td>
                </tr>
                <tr>
                  <td>Read only:</td>
                  <td>Disabled</td>
                </tr>
                <tr>
                  <td>Query store:</td>
                  <td>Enabled</td>
                </tr>
                <tr>
                  <td>Auto shrink:</td>
                  <td>Enabled</td>
                </tr>
                <tr>
                  <td>Auto create stats:</td>
                  <td>Enabled</td>
                </tr>
                <tr>
                  <td>Auto update stats:</td>
                  <td>Enabled</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* <div>
              <h4 className="mb-4 text-sm">Server configuration options</h4>
              <div className="w-full prose max-w-full prose-p:m-0 prose-td:align-top prose-tr:border-b-gray-light prose-headings:m-0">
                <table className="m-0 py-4 prose-tr:last:!border-b">
                  <tbody>
                    <tr>
                      <td>Collation</td>
                      <td>Latin1_General_CI_AS</td>
                    </tr>
                    <tr>
                      <td>xp cmd shell</td>
                      <td>Disabled</td>
                    </tr>
                    <tr>
                      <td>Common Language Runtime (CLR)</td>
                      <td>Disabled</td>
                    </tr>
                    <tr>
                      <td>External scripts enabled</td>
                      <td>Disabled</td>
                    </tr>
                    <tr>
                      <td>Remote access</td>
                      <td>Disabled</td>
                    </tr>
                    <tr>
                      <td>Max degree of parallelism</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}
        </div>
      </Grid>
    </div>
  )
}

export default memo(ServerMetrics)
