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
  Space,
  Spin,
  Typography,
} from 'antd'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import {
  createAiconfig,
  getaiconfig,
  updateAiconfig,
} from '~/services/aiconfig' // Supondo que você tenha essas funções

export const ReactJson = dynamic(
  () => {
    return import('react-json-view')
  },
  { ssr: false }
)

const AiConfigDrawer = () => {
  const router = useRouter()
  const { query, pathname } = router

  const open =
    query['aiconfig-new'] === 'true' || query['aiconfig-id'] !== undefined

  const isEdit = !query['aiconfig-new'] && query['aiconfig-id'] !== undefined

  const closeDrawer = () => {
    const newQuery = { ...query }

    delete newQuery['aiconfig-new']
    delete newQuery['aiconfig-id']

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
  const [loading, setLoading] = useState(false)

  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    form.resetFields()

    if (isEdit) {
      setFetching(true)
      const fetchAiconfig = async () => {
        try {
          const data = await getaiconfig(query['aiconfig-id'])
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
        } catch {
          message.error('Failed to load aiconfig data')
        }
        setFetching(false)
      }
      fetchAiconfig()
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
        await updateAiconfig(query['aiconfig-id'], data)
        message.success('aiconfig updated successfully')
      } else {
        await createAiconfig(data)
        message.success('aiconfig created successfully')
      }
      form.resetFields()

      closeDrawer()
    } catch (error) {
      message.error(error, 'Failed to save aiconfig')
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
            <Typography.Title level={4}>AI Config</Typography.Title>
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
                name="model"
                label="model"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="prompt"
                initialValue={''}
                rules={[{ required: false }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Typography.Title level={5}>Headers</Typography.Title>
              <Form.Item name="headers" initialValue={'{}'}>
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

export default AiConfigDrawer
