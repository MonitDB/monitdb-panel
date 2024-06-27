/* eslint-disable no-constant-condition */
/* eslint-disable unicorn/no-nested-ternary */
import { Descriptions, Modal, Table, Tooltip, Typography } from 'antd'
import { useState } from 'react'

import { interpretWord } from '../../utils/interpretWord'
import { GenericTableStyles } from './genericTableStyles'

export const GenericTable = ({
  loading,
  data,
  columnAlias,
  pagination = false,
  omitColumns = [],
  maxLength = 50,
}) => {
  const [modal, setModal] = useState({ open: false, data: {} })

  const filteredColumns = (data) => {
    if (!Array.isArray(data) || data.length === 0) return []
    const columns = Object.keys(data[0])
    return columns.filter((col) => !omitColumns.includes(col))
  }

  return (
    <>
      <GenericTableStyles>
        {Array.isArray(data) && (
          <Table
            locale={{ emptyText: 'No data to display' }}
            loading={loading}
            size="small"
            pagination={pagination}
            columns={filteredColumns(data).map((key, index) => ({
              dataIndex: key,
              title: interpretWord((columnAlias && columnAlias[index]) || key),
              render: (value) => {
                if (typeof value === 'string' && value.length > maxLength) {
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
            onRow={(record) => ({
              style: { cursor: 'pointer' },
              onClick: () => {
                setModal({ open: true, data: record })
              },
            })}
            dataSource={data}
          />
        )}
      </GenericTableStyles>
      <Modal
        open={modal.open}
        closable={false}
        width={'80vw'}
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => {
          setModal({ open: false, data: {} })
        }}
      >
        <div style={{ height: '70vh', overflowY: 'auto' }}>
          <Descriptions size="small" bordered column={1}>
            {Object.keys(modal.data).map((key) => {
              if (omitColumns.includes(key)) return
              const data = modal.data[key]
              if (typeof data === 'string')
                return (
                  <Descriptions.Item key={key} label={key}>
                    <Typography.Text copyable>{data}</Typography.Text>
                  </Descriptions.Item>
                )
              return <></>
            })}
          </Descriptions>
        </div>
      </Modal>
    </>
  )
}
