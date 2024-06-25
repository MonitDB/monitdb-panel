/* eslint-disable no-constant-condition */
/* eslint-disable unicorn/no-nested-ternary */
import { Descriptions, Modal, Table, Tooltip, Typography } from 'antd'
import { useState } from 'react'

import { GenericTableStyles } from './genericTableStyles'

export const GenericTable = ({
  loading,
  data,
  columnAlias,
  pagination = false,
}) => {
  const [modal, setModal] = useState({ open: false, data: {} })
  return (
    <>
      <GenericTableStyles>
        {Array.isArray(data) && (
          <Table
            locale={{ emptyText: 'No data to display' }}
            loading={loading}
            size="small"
            pagination={pagination}
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
              return (
                <Descriptions.Item key={key} label={key}>
                  <Typography.Text copyable>{modal.data[key]}</Typography.Text>
                </Descriptions.Item>
              )
            })}
          </Descriptions>
        </div>
      </Modal>
    </>
  )
}
