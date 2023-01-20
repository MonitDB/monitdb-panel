import React from 'react'

import Image from '~/components/image'

function SqlUserProcesses() {
  return (
    <div id="sql-user-processes" className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATAQMAAAC0i49FAAAABlBMVEUAAAB3d3daxsy0AAAAAXRSTlMAQObYZgAAACdJREFUCNdj/M/AcJDh//8DDkwMQAAmGMFicADhfmBgIKTk/wcMJQBnHBDweU6BeQAAAABJRU5ErkJggg=="
          width="26"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">
          SQL user processes (top 10 by CPU)
        </h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
        <table>
          <thead>
            <tr>
              <th>Session</th>
              <th>Login time</th>
              <th>Login</th>
              <th>Host</th>
              <th>Program</th>
              <th>Command</th>
              <th>Status</th>
              <th>Database</th>
              <th>Interval CPU %</th>
              <th>Reads/s</th>
              <th>Writes/s</th>
              <th>Logical Reads/s</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="12">
                <div>No SQL processes to display.</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SqlUserProcesses
