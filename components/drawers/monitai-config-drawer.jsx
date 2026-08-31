/* eslint-disable no-undef */
/* eslint-disable sonarjs/no-duplicate-string */
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'
import { json } from '@codemirror/lang-json'
import { dracula } from '@uiw/codemirror-theme-dracula'
import CodeMirror from '@uiw/react-codemirror'
import {
  Alert,
  Button,
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

import { useAiConfigStore } from '~/services/state-manager/ai-store'

export const ReactJson = dynamic(
  () => {
    return import('react-json-view')
  },
  { ssr: false }
)

const AiConfigDrawer = () => {
  const router = useRouter()
  const { query, pathname } = router
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [type, setType] = useState()

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
    form.setFieldsValue({
      ...selectedConfig,
    })
    // O aviso de ajuda do Copilot segue o tipo carregado, nao so o escolhido a mao.
    setType(selectedConfig?.type)
  }, [form, selectedConfig])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      const data = {
        ...values,
        headers: values.headers,
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
      width={isFullscreen ? '100%' : '50%'}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>AI Config</span>
          <Button
            type="text"
            onClick={() => setIsFullscreen(!isFullscreen)}
            icon={
              isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
            }
          ></Button>
        </div>
      }
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
                rules={[{ required: false }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                <Select onChange={setType}>
                  <Select.Option value="openai">OpenAI</Select.Option>
                  <Select.Option value="llmstudio">LLM Studio</Select.Option>
                  <Select.Option value="azure">Azure</Select.Option>
                  <Select.Option value="copilot">GitHub Copilot</Select.Option>
                </Select>
              </Form.Item>
              {type === 'copilot' && (
                <Alert
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                  message="How to connect GitHub Copilot"
                  description={
                    <div style={{ fontSize: 12, lineHeight: 1.7 }}>
                      Monit AI talks to Copilot through the internal bridge. Fill it in
                      exactly like this:
                      <ul style={{ margin: '8px 0', paddingLeft: 18 }}>
                        <li>
                          <b>URL:</b> <code>http://copilot-bridge:8080</code>
                        </li>
                        <li>
                          <b>Model:</b> <code>copilot</code>
                        </li>
                        <li>
                          <b>Api Key:</b> a <i>fine-grained</i> GitHub Personal Access
                          Token with the <b>Copilot Requests</b> permission, from an
                          account with an active Copilot subscription.
                        </li>
                      </ul>
                      The key is encrypted at rest and sent per request: every question
                      consumes credits from the seat the key belongs to. Enabling this
                      provider automatically disables the others.
                    </div>
                  }
                />
              )}
              <Form.Item
                name="aiApiKey"
                label="Api Key"
                rules={[{ required: false }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="prompt"
                label="Prompt"
                initialValue={''}
                rules={[{ required: false }]}
              >
                <Input.TextArea rows={10} />
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
