import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, message, Select, Space, Spin, Typography } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAiTrainingStore } from '~/services/state-manager/ai-training-store';
import FileUploader from '../file-uploader';

const { Option } = Select;

const TYPE_OPTIONS = [
  { label: 'TEXT', value: 'TEXT' },
  { label: 'DOCUMENT', value: 'DOCUMENT' }
];

const AiTrainingDrawer = () => {
  const router = useRouter();
  const { query, pathname } = router;

  const [form] = Form.useForm();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [file, setFile] = useState(null);

  const { createTraining, loadingTraining } = useAiTrainingStore();

  const open = query['aitraining-new'] === 'true' || query['aitraining-id'] !== undefined;

  const closeDrawer = () => {
    const newQuery = { ...query };
    delete newQuery['aitraining-new'];
    delete newQuery['aitraining-id'];

    router.replace({ pathname, query: newQuery }, undefined, { shallow: true });
  };

  useEffect(() => {
    form.resetFields();
    setSelectedType(null);
    setFile(null);
  }, [form]);

  const handleFileReady = (fileWrapper) => {
    setFile(fileWrapper.file);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = { type: values.type };

      if (values.type === 'TEXT') {
        payload.content = values.content;

      } else if (values.type === 'DOCUMENT') {
        if (!file) {
          message.error('Please upload a file');
          return;
        }
        payload.file = file; // Send raw file, createTraining will handle FormData
      }

      await createTraining(payload);
      message.success('Training material created successfully');

      form.resetFields();
      setFile(null);
      closeDrawer();
    } catch (error) {
      message.error('Failed to save AI training');
    }
  };

  const renderTypeSpecificField = () => {
    if (selectedType === 'TEXT') {
      return (
        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: 'Please input the text content' }]}
        >
          <Input.TextArea rows={6} placeholder="Enter your text content here" />
        </Form.Item>
      );
      
    } else if (selectedType === 'DOCUMENT') {
      return (
        <Form.Item label="File" required>
          <FileUploader onFileReady={handleFileReady} />
        </Form.Item>
      );
    }

    return null;
  };

  return (
    <Drawer
      open={open}
      onClose={closeDrawer}
      destroyOnClose
      closable={false}
      bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      width={isFullscreen ? '100%' : '50%'}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>AI Training</span>
          <Button
            type="text"
            onClick={() => setIsFullscreen(!isFullscreen)}
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          />
        </div>
      }
    >
      {loadingTraining ? (
        <div
          style={{
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
            <Form
              layout="vertical"
              form={form}
              onValuesChange={(changedValues) => {
                if (changedValues.type) {
                  setSelectedType(changedValues.type);
                  setFile(null);
                }
              }}
            >
              <Typography.Title level={5}>Informations</Typography.Title>

              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please select the type' }]}
              >
                <Select placeholder="Select a type">
                  {TYPE_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {renderTypeSpecificField()}
            </Form>
          </div>

          <div
            style={{
              padding: '16px',
              borderTop: '1px solid #f0f0f0',
              textAlign: 'right',
            }}
          >
            <Space>
              <Button onClick={closeDrawer}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                type="primary"
                loading={loadingTraining}
              >
                Create
              </Button>
            </Space>
          </div>
        </>
      )}
    </Drawer>
  );
};

export default AiTrainingDrawer;
