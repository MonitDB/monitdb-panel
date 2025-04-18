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
import React, { useEffect } from 'react'

import { useAiConfigStore } from '~/services/state-manager/ai-store'
import { safeJsonParse } from '~/utils/json'

export const ReactJson = dynamic(
  () => {
    return import('react-json-view')
  },
  { ssr: false }
)

const AiConfigDrawer = () => {
  const router = useRouter()
  const { query, pathname } = router

  const {
    fetchConfigById,
    loadingConfig,
    updateConfig,
    createConfig,
    selectedConfig,
  } = useAiConfigStore()

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

  useEffect(() => {
    form.resetFields()

    if (isEdit) {
      fetchConfigById(query['aiconfig-id'])
    }
  }, [isEdit, form, query, open, fetchConfigById])

  useEffect(() => {
    const headers = safeJsonParse(
      selectedConfig?.headers?.length > 0
        ? JSON.stringify(selectedConfig?.headers)
        : '{}'
    )

    form.setFieldsValue({
      ...selectedConfig,
      headers,
    })
  }, [form, selectedConfig])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      const data = {
        ...values,
        headers: JSON.stringify(safeJsonParse(values.headers)),
      }

      if (isEdit) {
        await updateConfig(query['aiconfig-id'], data)
        message.success('Config updated successfully')
      } else {
        await createConfig(data)
        message.success('Config created successfully')
      }
      form.resetFields()

      closeDrawer()
    } catch (error) {
      message.error(error, 'Failed to save aiconfig')
    } finally {
      /* empty */
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
      {loadingConfig && (
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
      {!loadingConfig && (
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
                label="Prompt"
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
              <Button
                onClick={handleSubmit}
                type="primary"
                loading={loadingConfig}
              >
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
