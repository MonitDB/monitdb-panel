/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
import { UploadOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, message, Row, Upload } from 'antd'
import React, { useEffect, useState } from 'react'

import { apiV2 } from '~/utils/client-api'

const CustomerPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [fileList, setFileList] = useState([])
  const [imageUrl, setImageUrl] = useState()

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await apiV2().get('/customer') // ajuste a URL conforme necessário
        const customer = response.data

        // Parse customerConfigurations JSON
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
    if (file.size > 500 * 1024) {
      message.error('Image must be smaller than 500KB')
      return
    }
    const reader = new FileReader()
    // eslint-disable-next-line unicorn/prevent-abbreviations
    reader.addEventListener('load', (e) => {
      setImageUrl(e.target.result)
      form.setFieldsValue({ customerImageBlob: e.target.result })
    })
    if (file instanceof Blob) {
      reader.readAsDataURL(file)
      setFileList(fileList)
    }
  }

  const onFinish = async (values) => {
    try {
      // Convert customerConfigurations to JSON string
      if (values.customerConfigurations) {
        values.customerConfigurations = JSON.stringify(
          values.customerConfigurations
        )
      }

      await apiV2().put('/customer', values) // ajuste a URL conforme necessário
      message.success('Customer updated successfully')
    } catch {
      message.error('Failed to update customer')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="customerType" label="Customer Type">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="customerContactPersonName"
            label="Contact Person Name"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
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
        <Col span={12}>
          <Form.Item name="customerContactPhone" label="Contact Phone">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="customerAddress" label="Address">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="customerCity" label="City">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="customerState" label="State">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="customerCountry" label="Country">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="customerPostalCode" label="Postal Code">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Customer Configurations">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={['customerConfigurations', 'primaryColor']}
                  label="Primary Color"
                  noStyle
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['customerConfigurations', 'fontSize']}
                  label="Font Size"
                  noStyle
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['customerConfigurations', 'language']}
                  label="Language"
                  noStyle
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name={'customerImageBlob'} hidden />
          <Form.Item label="Customer Image">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleUpload}
              listType="picture"
              onRemove={() => {
                form.setFieldsValue({ customerImageBlob: undefined })
                setImageUrl()
                setFileList([])
              }}
            >
              {fileList.length === 0 && (
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              )}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Customer Image"
                  style={{ maxWidth: '100%', maxHeight: 200 }}
                />
              )}
            </Upload>
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
  )
}

export default CustomerPage
