/* eslint-disable no-constant-condition */
/* eslint-disable unicorn/no-nested-ternary */
import { Modal, Table, Tooltip, Typography } from 'antd'
import { useState } from 'react'

import { GenericTableStyles } from './genericTableStyles'

export const GenericTable = ({ loading, data, columnAlias }) => {
  const [modal, setModal] = useState({ open: false, data: {} })
  return (
    <>
      <GenericTableStyles>
        {Array.isArray(data) && (
          <Table
            locale={{ emptyText: 'No data to display' }}
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
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => {
          setModal({ open: false, data: {} })
        }}
      >
        <div style={{ height: '500px', width: '700px', overflowY: 'auto' }}>
          {Object.keys(modal.data).map((key) => {
            return (
              <Typography key={key} title={key}>
                <Typography.Text copyable>{modal.data[key]}</Typography.Text>
              </Typography>
            )
          })}
        </div>
      </Modal>
    </>
  )
}
