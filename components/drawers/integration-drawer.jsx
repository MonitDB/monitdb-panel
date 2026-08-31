/* eslint-disable no-undef */
/* eslint-disable sonarjs/no-duplicate-string */
import { json } from '@codemirror/lang-json'
import { dracula } from '@uiw/codemirror-theme-dracula'
import CodeMirror from '@uiw/react-codemirror'
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import {
  createIntegration,
  getIntegration,
  updateIntegration,
} from '~/services/integration' // Supondo que você tenha essas funções

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
  const [loading, setLoading] = useState(false)

  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    form.resetFields()

    if (isEdit) {
      setFetching(true)
      const fetchIntegration = async () => {
        try {
          const data = await getIntegration(query['integration-id'])
          const headers = JSON.parse(
            data?.headers.length ? data?.headers : '{}'
          )
          form.setFieldsValue({
            name: data.name,
            url: data.url,
            type: data.type,
            method: data.method,
            headers: Object.entries(headers).map(([key, value]) => ({
              key,
              value,
            })),
            body: data.body,
          })
          setMethod(data.method)
        } catch {
          message.error('Failed to load integration data')
        }
        setFetching(false)
      }
      fetchIntegration()
    }
  }, [isEdit, form, query, open])

  // const handleJsonChange = (updatedJson) => {
  //   setBody(updatedJson.updated_src)
  // }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      const headers = values.headers?.reduce((accumulator, header) => {
        accumulator[header.key] = header.value
        return accumulator
      }, {})
      const data = {
        ...values,
        headers: JSON.stringify(headers),
      }

      if (isEdit) {
        await updateIntegration(query['integration-id'], data)
        message.success('Integration updated successfully')
      } else {
        await createIntegration(data)
        message.success('Integration created successfully')
      }
      form.resetFields()

      closeDrawer()
    } catch (error) {
      message.error(error, 'Failed to save integration')
    } finally {
      setLoading(false)
    }
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
      {fetching && (
        <div
          style={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {' '}
          <Spin />
        </div>
      )}
      {!fetching && (
        <>
          <div>
            <Typography.Title level={4}>Integration</Typography.Title>
            <Divider></Divider>
          </div>

          <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
            <Form layout="vertical" form={form}>
              <Typography.Title level={5}>Information</Typography.Title>

              <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="url" label="URL" rules={[{ required: true }]}>
                <Input type="url" />
              </Form.Item>
              <Form.Item
                name="type"
                initialValue={'zabbix'}
                label="Integration Type"
                rules={[{ required: true }]}
              >
                <Select
                  defaultValue={'zabbix'}
                  options={[
                    { label: 'Zabbix', value: 'zabbix' },
                    { label: 'Rundeck', value: 'rundeck' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="method"
                label="Method"
                rules={[{ required: true }]}
                initialValue={'GET'}
              >
                <Select
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
                <Form.List
                  name="headers"
                  initialValue={[{ key: '', value: '' }]}
                >
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
                              {
                                required: true,
                                message: 'Missing header value',
                              },
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
                  <Typography.Title level={5}>Body</Typography.Title>
                  <Form.Item
                    name="body"
                    label="Body"
                    initialValue={'{}'}
                    style={{ marginBottom: 0 }}
                  >
                    <CodeMirror
                      theme={dracula}
                      height="300px"
                      extensions={[json()]}
                      basicSetup={{
                        completionKeymap: true,
                        autocompletion: true,
                        closeBrackets: true,
                      }}
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
              <Button onClick={closeDrawer}>Cancel</Button>
              <Button onClick={handleSubmit} type="primary" loading={loading}>
                {!isEdit ? 'Create' : 'Save'}
              </Button>
            </Space>
          </div>
        </>
      )}
    </Drawer>
  )
}

export default IntegrationDrawer
