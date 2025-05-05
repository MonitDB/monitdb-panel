/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
import { UploadOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, message, Row, Spin, Upload } from 'antd'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'

import Loading from '~/components/loading'
import { PageContent, PageHeader } from '~/components/page'
import Layout from '~/layouts/default'
import { apiV2 } from '~/utils/client-api'

const CustomerPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [fileList, setFileList] = useState([])
  const [imageUrl, setImageUrl] = useState()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await apiV2().get('/customer') // ajuste a URL conforme necessário
        const customer = response.data

        if (customer.customerConfigurations) {
          customer.customerConfigurations = JSON.parse(
            customer.customerConfigurations
          )
        }

        form.setFieldsValue(customer)

        if (customer.customerImageBlob) {
          setImageUrl(customer.customerImageBlob)
          setFileList([
            { uid: '-1', name: 'customer-image.png', status: 'done' },
          ])
        }

        setLoading(false)
      } catch {
        message.error('Failed to fetch customer data')
      }
    }
    fetchCustomer()
  }, [form])

  const handleUpload = ({ file, fileList }) => {
    const MAX_SIZE_MB = 2
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

    if (file instanceof Blob) {
      if (file.size > MAX_SIZE_BYTES) {
        message.error(`File size must not exceed ${MAX_SIZE_MB}MB`)
        return
      }

      const reader = new FileReader()
      // eslint-disable-next-line unicorn/prevent-abbreviations
      reader.addEventListener('load', (e) => {
        setImageUrl(e.target.result)
        form.setFieldsValue({ customerImageBlob: e.target.result })
      })
      reader.readAsDataURL(file)
    }

    setFileList(fileList)
  }

  const onFinish = async (values) => {
    try {
      if (values.customerConfigurations) {
        values.customerConfigurations = JSON.stringify(
          values.customerConfigurations
        )
      }

      if (!values.customerImageBlob) values.customerImageBlob = undefined
      setSaving(true)
      await apiV2().put('/customer', values)
      message.success('Customer updated successfully')
    } catch {
      message.error('Failed to update customer')
    }
    setSaving(false)
  }

  return (
    <>
      <NextSeo title="Display Settings - Configurations - MonitDB" />
      <Layout>
        <PageContent removeSidebarMargin={true}>
          <PageHeader
            title="Display Settings"
            breadcrumbs={[
              {
                title: 'Configurations',
                href: '/configurations/',
              },
              {
                title: 'Display Settings',
                href: '/configurations/display-settings/',
              },
            ]}
          />
          {loading && <Loading />}
          {!loading && (
            <Spin spinning={saving}>
              <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item
                      name="customerName"
                      label="Customer Name"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="customerType" label="Customer Type">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item
                      name="customerContactPersonName"
                      label="Contact Person Name"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="customerContactEmail"
                      label="Contact Email"
                      rules={[{ type: 'email' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item
                      name="customerContactPhone"
                      label="Contact Phone"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="customerAddress" label="Address">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item name="customerCity" label="City">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="customerState" label="State">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item name="customerCountry" label="Country">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="customerPostalCode" label="Postal Code">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name={'customerImageBlob'} hidden />
                    <Form.Item label="Customer Image (2MB Max)">
                      {/* <ImgCrop onModalOk={(value) => console.log(value)}> */}
                      <Upload
                        beforeUpload={() => false}
                        fileList={fileList}
                        onChange={handleUpload}
                        listType="picture"
                        onRemove={() => {
                          form.setFieldsValue({
                            customerImageBlob: undefined,
                          })
                          setImageUrl()
                          setFileList([])
                        }}
                      >
                        {fileList.length === 0 && (
                          <Button icon={<UploadOutlined />}>
                            Upload Image
                          </Button>
                        )}
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt="Customer Image"
                            style={{ maxWidth: '100%', maxHeight: 200 }}
                          />
                        )}
                      </Upload>
                      {/* </ImgCrop> */}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Spin>
          )}
        </PageContent>
      </Layout>
    </>
  )
}

export default CustomerPage
