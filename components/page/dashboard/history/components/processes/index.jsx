import React from 'react'

import Image from '~/components/image'

function Processes() {
  return (
    <div id="processes" className="mt-4">
      <div className="grid grid-cols-[18px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATAQMAAAC0i49FAAAABlBMVEUAAAB3d3daxsy0AAAAAXRSTlMAQObYZgAAACdJREFUCNdj/M/AcJDh//8DDkwMQAAmGMFicADhfmBgIKTk/wcMJQBnHBDweU6BeQAAAABJRU5ErkJggg=="
          width="18"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">Top processes</h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <h4 className="mb-4 text-sm font-normal">Disk usage</h4>
      <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
        <table className="m-0 py-4 prose-tr:last:!border-b">
          <thead>
            <tr>
              <th>Name</th>
              <th>Started</th>
              <th>Processor usage</th>
              <th>Memory usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>RedGate.SqlMonitor.Engine.Alerting.Base.Service</td>
              <td>13 Jan 2023 08:12</td>
              <td>1.9%</td>
              <td>676.5 MB</td>
            </tr>
            <tr>
              <td>sqlservr</td>
              <td>12 Jan 2023 17:42</td>
              <td>1.7%</td>
              <td>4.95 GB</td>
            </tr>
            <tr>
              <td>MsMpEng</td>
              <td>12 Jan 2023 17:42</td>
              <td>0.3%</td>
              <td>254.7 MB</td>
            </tr>
            <tr>
              <td>lsass</td>
              <td>12 Jan 2023 17:42</td>
              <td>0.5%</td>
              <td>24.1 MB</td>
            </tr>
            <tr>
              <td>svchost#8</td>
              <td>12 Jan 2023 17:42</td>
              <td>0.1%</td>
              <td>40.2 MB</td>
            </tr>
            <tr>
              <td>WmiPrvSE#1</td>
              <td>12 Jan 2023 17:42</td>
              <td>0.0%</td>
              <td>30.6 MB</td>
            </tr>
            <tr>
              <td>WmiPrvSE</td>
              <td>12 Jan 2023 17:42</td>
              <td>0.1%</td>
              <td>18.7 MB</td>
            </tr>
            <tr>
              <td>WmiPrvSE#2</td>
              <td>12 Jan 2023 17:42</td>
              <td>0.0%</td>
              <td>12.2 MB</td>
            </tr>
            <tr>
              <td>services</td>
              <td>12 Jan 2023 17:42</td>
              <td>0.0%</td>
              <td>5.9 MB</td>
            </tr>
            <tr>
              <td>System</td>
              <td>12 Jan 2023 17:41</td>
              <td>0.1%</td>
              <td>124 KB</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Processes
