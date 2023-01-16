import React from 'react'

import Image from '~/components/image'

function BlockingProcesses() {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATAQMAAAC0i49FAAAABlBMVEUAAAB3d3daxsy0AAAAAXRSTlMAQObYZgAAACdJREFUCNdj/M/AcJDh//8DDkwMQAAmGMFicADhfmBgIKTk/wcMJQBnHBDweU6BeQAAAABJRU5ErkJggg=="
          width="26"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">
          Blocking processes (top 10 by time)
        </h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
        <table>
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Login time</th>
              <th>Occurrence time</th>
              <th>Host</th>
              <th>Program name</th>
              <th>Status</th>
              <th>Database</th>
              <th>Total blocking time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8">
                <div>No blocking processes to display.</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BlockingProcesses
