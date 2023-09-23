import { useState } from 'react'

import { paginateArray } from '~/utils/array'

import Loading from '../loading/loading'
import Pagination from '../pagination/pagination'
import { GenericTableStyles } from './genericTableStyles'

export const GenericTable = (properties) => {
  const { loading, data } = properties

  const [currentPage, setCurrentPage] = useState(1)

  return (
    <GenericTableStyles>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {Object?.keys(data[0] ?? []).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginateArray(data, currentPage, 10)?.map((result, index) => {
                  return (
                    <tr key={index}>
                      {Object?.keys(result ?? []).map((key) => (
                        <td key={key}>{result[key] ?? 'null'}</td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <br />
          <br />
          {data.length > 10 && (
            <Pagination
              currentPage={currentPage}
              totalResults={data.length}
              onChangePage={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </GenericTableStyles>
  )
}
