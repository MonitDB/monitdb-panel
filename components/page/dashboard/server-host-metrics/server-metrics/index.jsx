import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import faker from 'faker'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const labels = Array.from({ length: 100 }, () => '')

const options = {
  responsive: true,
  plugins: {
    tooltip: { enabled: true },
    legend: { display: false },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
  },
}

const batchRequestsData = {
  labels,
  datasets: [
    {
      fill: true,
      data: labels.map(() =>
        faker.datatype.number({ min: 0, max: 200, precision: 10 })
      ),
      borderColor: 'rgb(140, 216, 141)',
      backgroundColor: 'rgba(140, 216, 141, 0.5)',
    },
  ],
}

const batchRequestsOptions = {
  ...options,
}

const ServerMetrics = () => {
  return (
    <div className="mt-6">
      <h3 className="font-bold mb-6">SQL Server metrics</h3>
      <div>
        <h4 className="mb-4 text-sm">General</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h6 className="mb-4 text-xs">Batch requests</h6>
            <Line options={batchRequestsOptions} data={batchRequestsData} />
          </div>
          <div>
            <h6 className="mb-4 text-xs">SQL compilations / Batch requests</h6>
            <Line options={batchRequestsOptions} data={batchRequestsData} />
          </div>
          <div>
            <h6 className="mb-4 text-xs">Page splits / Batch requests</h6>
            <Line options={batchRequestsOptions} data={batchRequestsData} />
          </div>
          <div>
            <h6 className="mb-4 text-xs">SQL compilations / sec</h6>
            <Line options={batchRequestsOptions} data={batchRequestsData} />
          </div>
          <div>
            <p className="mb-4 text-xs">Page splits / sec</p>
            <Line options={batchRequestsOptions} data={batchRequestsData} />
          </div>
          <div>
            <h6 className="mb-4 text-xs">Full scans / sec</h6>
            <Line options={batchRequestsOptions} data={batchRequestsData} />
          </div>
          <div>
            <h6 className="mb-4 text-xs">User connections</h6>
            <Line options={batchRequestsOptions} data={batchRequestsData} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-4 text-sm">Latches and locks</h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <h6 className="mb-4 text-xs">Avg. latch wait</h6>
            <Line options={batchRequestsOptions} data={batchRequestsData} />
          </div>
          <div>
            <h6 className="mb-4 text-xs">Lock timeouts / sec</h6>
            <Line options={batchRequestsOptions} data={batchRequestsData} />
          </div>
          <div>
            <h6 className="mb-4 text-xs">Lock waits / sec</h6>
            <Line options={batchRequestsOptions} data={batchRequestsData} />
          </div>
        </div>
        <h4 className="mb-4 text-sm">Buffer cache</h4>
        <div>
          <h6 className="mb-4 text-xs">Page life expectancy</h6>
          <Line options={batchRequestsOptions} data={batchRequestsData} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="mb-4 text-sm text-gray-dark">Server properties</h4>
          <div className="w-full mb-4 prose max-w-full prose-p:m-0 prose-td:align-top prose-tr:border-gray-light prose-headings:m-0">
            <table className="m-0 py-4 prose-tr:last:!border-b">
              <tbody>
                <tr>
                  <td>Version</td>
                  <td>
                    <a href="#allinstancemetrics">
                      SQL Server 2017 RTM CU29, June 14, 2022 (14.0.3445.2){' '}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Edition</td>
                  <td>Express Edition (64-bit)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
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
        </div>
      </div>
    </div>
  )
}

export default ServerMetrics
