/* eslint-disable sonarjs/no-duplicate-string */
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'
import { json } from '@codemirror/lang-json'
import { dracula } from '@uiw/codemirror-theme-dracula'
import CodeMirror from '@uiw/react-codemirror'
import {
  Button,
  Drawer,
  Form,
  Input,
  message,
  Space,
  Spin,
  Switch,
  Typography,
} from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { useAiSkillStore } from '~/services/state-manager/ai-skills-store'

const AiSkillDrawer = () => {
  const router = useRouter()
  const { query, pathname } = router
  const [isFullscreen, setIsFullscreen] = useState(false)

  const {
    fetchSkillById,
    loadingSkill,
    updateSkill,
    createSkill,
    selectedSkill,
  } = useAiSkillStore()

  const open =
    query['aiskill-new'] === 'true' || query['aiskill-id'] !== undefined
  const isEdit = !query['aiskill-new'] && query['aiskill-id'] !== undefined

  const closeDrawer = () => {
    const newQuery = { ...query }
    delete newQuery['aiskill-new']
    delete newQuery['aiskill-id']
    router.replace({ pathname, query: newQuery }, undefined, { shallow: true })
  }

  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
    if (isEdit) {
      fetchSkillById(query['aiskill-id'])
    }
  }, [isEdit, form, query, open, fetchSkillById])

  useEffect(() => {
    if (isEdit && selectedSkill) {
      form.setFieldsValue({ ...selectedSkill })
    }
  }, [form, selectedSkill, isEdit])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const data = { ...values, enabled: values.enabled ?? true }

      if (isEdit) {
        await updateSkill(query['aiskill-id'], data)
        message.success('Skill atualizada')
      } else {
        await createSkill(data)
        message.success('Skill criada')
      }
      form.resetFields()
      closeDrawer()
    } catch {
      message.error('Could not save the skill.')
    }
  }

  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      destroyOnClose
      closable={false}
      bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      width={isFullscreen ? '100%' : '55%'}
      title={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{isEdit ? 'Edit skill' : 'New skill'}</span>
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
      {loadingSkill && (
        <div
          style={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin />
        </div>
      )}
      {!loadingSkill && (
        <>
          <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
            <Form layout="vertical" form={form}>
              <Form.Item
                name="name"
                label="Skill name (tool)"
                extra="snake_case, ex.: get_top_slow_queries"
                rules={[{ required: true }]}
              >
                <Input placeholder="get_minha_skill" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description (the AI reads it to decide when to call the skill)"
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Form.Item
                name="sqlQuery"
                label="SQL (read-only). Use {{param}} for parameters."
                rules={[{ required: true }]}
              >
                <Input.TextArea rows={12} style={{ fontFamily: 'monospace' }} />
              </Form.Item>

              <Typography.Title level={5}>Parameters (JSON)</Typography.Title>
              <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
                {
                  'Ex.: {"top":{"type":"integer","sqlType":"int","description":"qtde","default":20}}  — sqlType: ident | int | text'
                }
              </Typography.Paragraph>
              <Form.Item name="parameters" initialValue={'{}'}>
                <CodeMirror
                  theme={dracula}
                  height="200px"
                  extensions={[json()]}
                  basicSetup={{
                    autocompletion: true,
                    closeBrackets: true,
                  }}
                />
              </Form.Item>

              <Typography.Title level={5}>
                Conhecimento profundo (RAG)
              </Typography.Title>
              <Form.Item
                name="useRag"
                label="Aplicar conhecimento profundo (indexar no RAG)"
                valuePropName="checked"
                initialValue={false}
                extra="When on, the text below is indexed in the RAG and the AI reads it whenever it is relevant."
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item
                name="knowledge"
                label="Conhecimento (markdown)"
                rules={[{ required: false }]}
              >
                <Input.TextArea
                  rows={10}
                  placeholder="Paste the expert knowledge behind this skill here — how to read wait stats, which thresholds matter, the practices you trust…"
                />
              </Form.Item>

              <Form.Item
                name="enabled"
                label="Habilitada"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
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
              <Button onClick={handleSubmit} type="primary" loading={loadingSkill}>
                {isEdit ? 'Save' : 'Create'}
              </Button>
            </Space>
          </div>
        </>
      )}
    </Drawer>
  )
}

export default AiSkillDrawer
