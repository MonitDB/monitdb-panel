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
    tooltip: { enabled: false },
    legend: { display: false },
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

const VmwareMetrics = () => {
  return (
    <div className="mt-6">
      <h3 className="mb-4 text-sm text-gray-dark font-bold">VMware metrics</h3>
      <div className="grid grid-cols-3 gap-2">
        <div className="prose prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light">
          <h4 className="mb-4 text-sm font-normal">VMware properties</h4>
          <table>
            <tbody>
              <tr>
                <td>Physical host</td>
                <td>ns3076431.ip-147-135-128.eu</td>
              </tr>
              <tr>
                <td>Host processor speed</td>
                <td>3792 Mhz</td>
              </tr>
              <tr>
                <td>CPU limit</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>CPU reservation</td>
                <td>2000 MHz</td>
              </tr>
              <tr>
                <td>CPU shares</td>
                <td>4000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h4 className="mb-4 text-sm">VMware CPU</h4>

          <Line options={batchRequestsOptions} data={batchRequestsData} />
          <Line options={batchRequestsOptions} data={batchRequestsData} />
        </div>

        <div>
          <h4 className="mb-4 text-sm">VMware memory and I/O</h4>

          <Line options={batchRequestsOptions} data={batchRequestsData} />
          <Line options={batchRequestsOptions} data={batchRequestsData} />
        </div>
      </div>
      <h4 className="mb-4 text-sm font-normal">Disk usage</h4>
      <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
        <table className="m-0 py-4 prose-tr:last:!border-b">
          <thead>
            <tr>
              <th>Disk</th>
              <th>Space used</th>
              <th>Avg. read time</th>
              <th>Avg. write time</th>
              <th>Transfers/sec</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>C:</td>
              <td>
                <div
                  className="w-full h-[20px]"
                  style={{
                    background: `linear-gradient(90deg, rgb(60, 133, 223) 0%, rgb(60, 133, 223) 62.6871%, rgb(216, 231, 249) 62.6871%, rgb(216, 231, 249))`,
                  }}
                />
                <span>22.20 GB free of 59.51 GB</span>
              </td>
              <td>0.220 ms/s</td>
              <td>0.157 ms/s</td>
              <td>2.72</td>
            </tr>
            <tr>
              <td>Backup (E:)</td>
              <td>
                {' '}
                <div
                  className="w-full h-[20px]"
                  style={{
                    background: `linear-gradient(90deg, rgb(60, 133, 223) 0%, rgb(60, 133, 223) 9.975%, rgb(216, 231, 249) 9.975%, rgb(216, 231, 249))`,
                  }}
                />
                <span>90.02 GB free of 100.00 GB</span>
              </td>
              <td>0.00 ms/s</td>
              <td>0.00 ms/s</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Data (F:)</td>
              <td>
                {' '}
                <div
                  className="w-full h-[20px]"
                  style={{
                    background: `linear-gradient(90deg, rgb(60, 133, 223) 0%, rgb(60, 133, 223) 29.1232%, rgb(216, 231, 249) 29.1232%, rgb(216, 231, 249))`,
                  }}
                />
                <span>28.35 GB free of 40.00 GB</span>
              </td>
              <td>0.00 ms/s</td>
              <td>0.00 ms/s</td>
              <td>0</td>
            </tr>
            <tr>
              <td>TempDB (G:)</td>
              <td>
                {' '}
                <div
                  className="w-full h-[20px]"
                  style={{
                    background: `linear-gradient(90deg, rgb(60, 133, 223) 0%, rgb(60, 133, 223) 24.1918%, rgb(216, 231, 249) 24.1918%, rgb(216, 231, 249))`,
                  }}
                />
                <span>30.32 GB free of 40.00 GB</span>
              </td>
              <td>0.069 ms/s</td>
              <td>1.60 ms/s</td>
              <td>1.98</td>
            </tr>
            <tr>
              <td>Log (H:)</td>
              <td>
                {' '}
                <div
                  className="w-full h-[20px]"
                  style={{
                    background: `linear-gradient(90deg, rgb(60, 133, 223) 0%, rgb(60, 133, 223) 75.3679%, rgb(216, 231, 249) 75.3679%, rgb(216, 231, 249))`,
                  }}
                />
                <span>7.39 GB free of 30.00 GB</span>
              </td>
              <td>0.00 ms/s</td>
              <td>0.229 ms/s</td>
              <td>2.63</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VmwareMetrics
