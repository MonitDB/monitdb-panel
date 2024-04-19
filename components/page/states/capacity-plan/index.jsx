import { Card, Col, DatePicker, Row, Space, Typography } from 'antd'
import dynamic from 'next/dynamic'
import React from 'react'

import PageContent from '../../content/content'

export const ApexChart = dynamic(
  () => {
    return import('react-apexcharts')
  },
  { ssr: false }
)

const CapacityPlan = ({ tabName }) => {
  return (
    <PageContent removeSidebarMargin={true} hideBreadcrumbs={true}>
      <header className="pt-8 w-full flex flex-col md:flex-row md:justify-between md:items-end">
        <h1 className="heading-lg">{tabName}</h1>
      </header>
      <br />
      <Row gutter={12}>
        <Card style={{ width: '100%' }}>
          <Space>
            <DatePicker.RangePicker />
          </Space>
        </Card>
      </Row>
      <br />
      <Row gutter={12}>
        <Col span={24}>
          <Typography.Title level={3}>Disk</Typography.Title>
          <ApexChart
            options={{}}
            series={[{ data: [], type: 'line' }]}
            width={'100%'}
          />
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={24}>
          <Typography.Title level={3}>Database</Typography.Title>
          <ApexChart
            options={{}}
            series={[{ data: [], type: 'line' }]}
            width={'100%'}
          />
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={24}>
          <Typography.Title level={3}>Files</Typography.Title>
        </Col>
      </Row>
    </PageContent>
  )
}

export default CapacityPlan
