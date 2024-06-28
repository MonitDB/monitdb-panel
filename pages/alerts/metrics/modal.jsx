import { Checkbox, Col, Form, Input, Modal, Row, Select, Spin } from 'antd'
import classNames from 'classnames'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import useAlerts from '~/hooks/use-alerts'
import {
  getAlertParameterByServerId,
  updateAlertsParameterByServerId,
} from '~/services/alerts'
import { handleException } from '~/utils/exceptions'

const MetricsModal = ({ onClose, serverId, parameterId }) => {
  const {
    stateAlerts: { parameters },
  } = useAlerts()

  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const [form] = Form.useForm()

  const frequencyOptions = useMemo(
    () => [
      { value: '', label: 'Unactive' },
      { value: 1, label: '1 minute' },
      { value: 5, label: '5 minutes' },
      { value: 20, label: '20 minutes' },
      { value: 60, label: '1 hour' },
      { value: 3600, label: '1 day' },
      { value: 25_200, label: '1 week' },
      { value: 32_000, label: '1 month' },
    ],
    []
  )

  const getParameterData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getAlertParameterByServerId(serverId, parameterId)
      const parameterData = response?.data
      form.setFieldsValue(parameterData) // Atualiza os valores do formulário
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    } finally {
      setIsLoading(false)
    }
  }, [serverId, parameterId, form])

  const onFinish = async (values) => {
    setIsSending(true)

    try {
      const response = await updateAlertsParameterByServerId(serverId, {
        ...values,
        id: parameterId,
      })

      if (response?.status === 200) {
        toast.success(`Metrics updated!`)
        onClose(true)
      }
    } catch (error) {
      toast.error(handleException(error))
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    if (!parameterId) return

    getParameterData()
  }, [getParameterData, parameters, parameterId])

  return (
    <Modal
      open={true}
      width={'80%'}
      onCancel={onClose}
      onOk={form.submit}
      okText="Save"
      height={'75vh'}
      closable={false}
      okButtonProps={{ loading: isSending }}
    >
      <Spin spinning={isLoading}>
        <header className="flex items-start mb-10">
          <h2 className="heading-md">Edit metrics</h2>
        </header>
        <div style={{ height: '71vh', overflowY: 'auto' }}>
          <Form
            form={form}
            onFinish={onFinish}
            className="relative w-full"
            layout="vertical"
          >
            <Row
              gutter={16}
              className={classNames({ 'opacity-0 invisible': isLoading })}
            >
              <Col span={6}>
                <Form.Item label="Alert Name" name="alertName">
                  <Input placeholder="Alert Name" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Procedure Name" name="procedureName">
                  <Input placeholder="Procedure Name" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Frequency (MIN)" name="frequencyMinutes">
                  <Select
                    options={frequencyOptions}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Start Hour Execution"
                  name="hourStartExecution"
                >
                  <Input type="number" placeholder="Start Hour Execution" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="End Hour Execution" name="hourEndExecution">
                  <Input type="number" placeholder="End Hour Execution" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="AI Flag"
                  name="aiFlag"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Clear Flag"
                  name="clearFlag"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Enable Flag"
                  name="enableFlag"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Language Flag"
                  name="languageFlag"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Parameter Value" name="parameterValue">
                  <Input type="number" placeholder="Parameter Value" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Metric Description" name="metricDescription">
                  <Input placeholder="Metric Description" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Parameter Value 2" name="parameterValue2">
                  <Input type="number" placeholder="Parameter Value 2" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Metric Description 2"
                  name="metricDescription2"
                >
                  <Input placeholder="Metric Description 2" />
                </Form.Item>
              </Col>
              {/* Campos adicionais */}
              <Col span={12}>
                <Form.Item
                  label="Profile Email Description"
                  name="profileEmailDescription"
                >
                  <Input placeholder="Profile Email Description" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email Description" name="emailDescription">
                  <Input placeholder="Email Description" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Alert Message ENG" name="alertMessageENG">
                  <Input placeholder="Alert Message ENG" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Clear Message ENG" name="clearMessageENG">
                  <Input placeholder="Clear Message ENG" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Alert Message PTB" name="alertMessagePTB">
                  <Input placeholder="Alert Message PTB" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Clear Message PTB" name="clearMessagePTB">
                  <Input placeholder="Clear Message PTB" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email Information ENG 1"
                  name="emailInformation1ENG"
                >
                  <Input placeholder="Email Information ENG 1" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email Information ENG 2"
                  name="emailInformation2ENG"
                >
                  <Input placeholder="Email Information ENG 2" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email Information PTB 1"
                  name="emailInformation1PTB"
                >
                  <Input placeholder="Email Information PTB 1" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email Information PTB 2"
                  name="emailInformation2PTB"
                >
                  <Input placeholder="Email Information PTB 2" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </Modal>
  )
}

export default MetricsModal
