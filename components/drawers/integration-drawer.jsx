/* eslint-disable sonarjs/no-duplicate-string */
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Select,
  Space,
  Typography,
} from 'antd'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export const ReactJson = dynamic(
  () => {
    return import('react-json-view')
  },
  { ssr: false }
)

const IntegrationDrawer = () => {
  const router = useRouter()
  const { query, pathname } = router

  const open =
    query['integration-new'] === 'true' || query['integration-id'] !== undefined

  const isEdit =
    !query['integration-new'] && query['integration-id'] !== undefined

  const closeDrawer = () => {
    const newQuery = { ...query }

    delete newQuery['integration-new']
    delete newQuery['integration-id']

    router.replace(
      {
        pathname: pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    )
  }

  const [form] = Form.useForm()

  const [method, setMethod] = useState('GET')
  const [body, setBody] = useState({})

  const handleJsonChange = (updatedJson) => {
    setBody(updatedJson.updated_src)
  }

  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      destroyOnClose
      closable={false}
      bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      width={600}
    >
      <div>
        <Typography.Title level={4}>Integration</Typography.Title>
        <Divider></Divider>
      </div>

      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        <Form layout="vertical" form={form}>
          <Typography.Title level={5}>Informations</Typography.Title>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="url" label="URL" rules={[{ required: true }]}>
            <Input type="url" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Integration Type"
            rules={[{ required: true }]}
          >
            <Select
              defaultValue={'GET'}
              options={[
                { label: 'Zabbix', value: 'zabbix' },
                { label: 'Rundeck', value: 'rundeck' },
              ]}
            />
          </Form.Item>
          <Form.Item name="method" label="Method" rules={[{ required: true }]}>
            <Select
              defaultValue={'GET'}
              onChange={(value) => setMethod(value)}
              options={[
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
                { label: 'DELETE', value: 'DELETE' },
                { label: 'PATCH', value: 'PATCH' },
              ]}
            />
          </Form.Item>

          <Typography.Title level={5}>Headers</Typography.Title>
          <Form.Item name="headers" valuePropName="code">
            <Form.List name="headers" initialValue={[{ key: '', value: '' }]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, 'key']}
                        fieldKey={[fieldKey, 'key']}
                        rules={[
                          { required: true, message: 'Missing header key' },
                        ]}
                      >
                        <Input placeholder="Header Key" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        fieldKey={[fieldKey, 'value']}
                        rules={[
                          { required: true, message: 'Missing header value' },
                        ]}
                      >
                        <Input placeholder="Header Value" />
                      </Form.Item>
                      <Button type="link" onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      Add Header
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          {method !== 'GET' && (
            <>
              {' '}
              <Typography.Title level={5}>Body</Typography.Title>
              <Form.Item name="body" label="Body" style={{ marginBottom: 0 }}>
                <ReactJson
                  src={body}
                  onEdit={handleJsonChange}
                  onAdd={handleJsonChange}
                  onDelete={handleJsonChange}
                  theme="monokai"
                  style={{ height: '300px', overflowY: 'auto' }}
                />
              </Form.Item>
            </>
          )}
        </Form>
      </div>

      <div
        style={{
          paddingTop: '16px',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'right',
        }}
      >
        <Space>
          {' '}
          <Button onClick={closeDrawer}>Cancel</Button>
          <Button onClick={form.submit} type="primary">
            {!isEdit ? 'Create' : 'Save'}
          </Button>
        </Space>
      </div>
    </Drawer>
  )
}

export default IntegrationDrawer
