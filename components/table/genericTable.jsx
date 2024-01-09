/* eslint-disable no-constant-condition */
/* eslint-disable unicorn/no-nested-ternary */
import { Table, Tooltip } from 'antd'
import { useState } from 'react'

import { paginateArray } from '~/utils/array'

import Loading from '../loading/loading'
import Pagination from '../pagination/pagination'
import { GenericTableStyles } from './genericTableStyles'

export const GenericTable = ({ loading, data, onRowClick, columnAlias }) => {
  const [currentPage, setCurrentPage] = useState(1)

  const handleRowClick = (rowData) => {
    if (onRowClick) {
      onRowClick(rowData)
    }
  }
  return (
    <GenericTableStyles>
      {Array.isArray(data) && (
        <Table
          loading={loading}
          size="small"
          columns={Object?.keys(data[0] ?? []).map((key, index) => ({
            dataIndex: key,
            title: (columnAlias && columnAlias[index]) || key,
            render: (value) => {
              const maxLength = 50
              if (value && value.length > maxLength) {
                return {
                  children: (
                    <Tooltip title={value}>{`${value.slice(
                      0,
                      maxLength
                    )}...`}</Tooltip>
                  ),
                }
              }
              return value
            },
          }))}
          scroll={{ x: 1300 }}
          dataSource={data}
        />
      )}
    </GenericTableStyles>
  )
}

{
  /* {Array.isArray(data) && (
            <>
              <div className="table-container prose prose-thead:bg-gray-light max-w-full prose-th:capitalize prose-th:border-b-0 prose-tr:border-gray-light prose-td:text-[11px]">
                <table>
                  <thead>
                    <tr>
                      {Object?.keys(data[0] ?? []).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginateArray(data, currentPage, 10)?.map(
                      (result, index) => {
                        return (
                          <tr
                            key={index}
                            onClick={() => handleRowClick(result)}
                            className={onRowClick ? 'pointer-cursor' : ''}
                          >
                            {Object?.keys(result ?? []).map((key) => (
                              <td key={key}>
                                <div className="scrollable-cell">
                                  {typeof result[key] === 'boolean'
                                    ? typeof result[key]
                                      ? 'true'
                                      : 'false'
                                    : result[key] ?? 'null'}
                                </div>
                              </td>
                            ))}
                          </tr>
                        )
                      }
                    )}
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
          )} */
}
