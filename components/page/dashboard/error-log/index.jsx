import React from 'react'

import Image from '~/components/image'

function ErrorLog() {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-[26px_auto_1fr] gap-2 items-center my-8">
        <Image
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAABK0lEQVR42qzUUUobURQG4IlgphtRdBFFuoQWLIYUX/qQ4OdiWlBwDWpdigQXoE21XYKJefn7kJaZTKYjYjlPc+G7/Peec6dI8bIqXgm8cejKDwsL310a6ncAA7+kUff2W4ENZyKujWzp69s2NhFxYmMdnIlHnxsRe0Zm4qQBDMSjt23HtGcmf4Mtl0o/pb67SO1rLO6Xx18uHIrrlV1XQc9EDCtwJUb/BikciYsKTMVWJ9gRdxVYyGqD1kApnl4BpmK7a4LsitsKfBPjTnAszivwSUz0Oq71RgzqjXtYvdgGIKa1xqXwUczstcZ5Zy4+NIfvVMyM6sFS6GEuvraN96mIiSM7SqVdx25EfGkZ7z/BHtYe0NT7ridaGrp058ncrXMHNv/vT+D5+j0AXi5ORJDEpLEAAAAASUVORK5CYII="
          width="26"
          height="18"
        />
        <h3 className="text-sm text-gray-dark font-bold">Error log</h3>
        <span className="w-full h-[1px] block bg-gray-light" />
      </div>
      <div className="prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
        <table className="m-0 py-4 prose-tr:last:!border-b">
          <thead>
            <tr>
              <th>Time</th>
              <th>Process</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>16 Jan 2023 14:00:08</td>
              <td>Backup</td>
              <td>
                Log was backed up.<a>Show more</a>
              </td>
            </tr>
            <tr>
              <td>16 Jan 2023 13:00:07</td>
              <td>Backup</td>
              <td>
                Log was backed up.<a>Show more</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ErrorLog
