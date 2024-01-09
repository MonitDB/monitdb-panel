/* eslint-disable no-constant-condition */
/* eslint-disable unicorn/no-nested-ternary */
import { Table, Tooltip } from 'antd'

import { GenericTableStyles } from './genericTableStyles'

export const GenericTable = ({ loading, data, columnAlias }) => {
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
          onRow={() => ({ style: { cursor: 'pointer' } })}
          dataSource={data}
        />
      )}
    </GenericTableStyles>
  )
}
