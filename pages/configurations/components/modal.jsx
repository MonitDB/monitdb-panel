import '@uiw/react-textarea-code-editor/dist.css'

import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

const AceEditor = dynamic(
  () => import('react-ace').then((module_) => module_.default),
  { ssr: false }
)

import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd'

import {
  getComponentById,
  getComponentTypes,
  updateComponentById,
} from '~/services/components'
import { getFeatures } from '~/services/features'
import { handleException } from '~/utils/exceptions'

const MetricsModal = ({ onClose, componentId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [features, setFeatures] = useState([])
  const [componentTypes, setComponentTypes] = useState([])

  const [form] = Form.useForm()

  const getComponentData = useCallback(async () => {
    setIsLoading(true)

    try {
      const [componentResponse, featuresResponse, componentTypesResponse] =
        await Promise.all([
          getComponentById(componentId),
          getFeatures(),
          getComponentTypes(),
        ])

      const componentData = componentResponse?.data

      form.setFieldsValue({
        idTypeComponent: componentData?.idTypeComponent,
        idFeature: componentData?.idFeature,
        componentCode: componentData?.componentCode,
        componentName: componentData?.componentName,
        componentQuery: componentData?.componentQuery,
      })

      setFeatures(featuresResponse?.data)
      setComponentTypes(componentTypesResponse?.data)
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [componentId, form]) // eslint-disable-line react-hooks/exhaustive-deps

  const onFinish = async (values) => {
    setIsSending(true)

    try {
      const response = await updateComponentById(componentId, {
        ...values,
      })

      if (response?.status === 200) {
        toast.success(`Component updated!`)
        onClose(true)
      }
    } catch (error) {
      toast.error(handleException(error))
    } finally {
      setIsSending(false)
    }
  }

  const featuresOptions = useMemo(
    () =>
      features.map((feature) => ({
        value: feature.id,
        label: feature.featureName,
      })),
    [features]
  )

  useEffect(() => {
    if (!componentId) return

    getComponentData()
  }, [getComponentData, componentId])

  return (
    <Modal
      title="Edit component"
      visible={true}
      onCancel={() => onClose(false)}
      footer={undefined}
      width="90%"
      okButtonProps={{ style: { display: 'none' } }}
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <Spin spinning={isLoading}>
        <div style={{ height: '65vh', overflowY: 'auto' }}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Row gutter={12}>
              <Col sm={6}>
                <Form.Item
                  name="componentName"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter the name' }]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item
                  name="componentCode"
                  label="Code"
                  style={{ width: '100%' }}
                  rules={[{ required: true, message: 'Please enter the code' }]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item
                  name="idTypeComponent"
                  label="Component type"
                  rules={[
                    {
                      required: true,
                      message: 'Please select a component type',
                    },
                  ]}
                >
                  <Select>
                    {' '}
                    {componentTypes.map((componentType, index) => (
                      <Select.Option
                        key={index}
                        value={componentType.idTypeComponent}
                      >
                        {componentType.typeComponentName}{' '}
                      </Select.Option>
                    ))}{' '}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={6}>
                <Form.Item
                  name="idFeature"
                  label="Feature ID"
                  rules={[
                    { required: true, message: 'Please select a feature ID' },
                  ]}
                >
                  <Select
                    className="bg-white w-full lg:w-2/3"
                    options={featuresOptions}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="componentQuery"
              label="Query or URL"
              rules={[
                { required: true, message: 'Please enter the query or URL' },
              ]}
            >
              <Input type="hidden" />
              <AceEditor
                id="editor"
                aria-label="editor"
                mode="mysql"
                theme="github"
                name="editor"
                fontSize={16}
                minLines={15}
                width="100%"
                showPrintMargin={false}
                showGutter
                placeholder="Write your Query here..."
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                }}
                onChange={(value) => {
                  form.setFieldsValue({ componentQuery: value })
                }}
                value={form.getFieldValue('componentQuery')}
                showLineNumbers
              />
            </Form.Item>
          </Form>
        </div>
        <div className="col-span-2 flex justify-end items-center pt-10 md:col-span-12">
          <Button
            type="primary"
            htmlType="submit"
            loading={isSending}
            disabled={isSending}
          >
            Save
          </Button>
        </div>
      </Spin>
    </Modal>
  )
}

export default MetricsModal
