import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, Form, Input, message, Select, Space, Spin, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useAiTrainingStore } from '~/services/state-manager/ai-training-store';
import { useAiTrainingStoreLocalLLM } from '~/services/state-manager/ai-training-store-local-llm';

import FileUploader from '../file-uploader';

const { Option } = Select;

const TYPE_OPTIONS = [
  { label: 'TEXT', value: 'TEXT' },
  { label: 'DOCUMENT', value: 'DOCUMENT' },
  { label: 'WEBSITE', value: 'WEBSITE' },
  { label: 'VIDEO', value: 'VIDEO' },
];

const AiTrainingDrawer = () => {
  const router = useRouter();
  const { query, pathname } = router;

  const [form] = Form.useForm();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedType, setSelectedType] = useState(TYPE_OPTIONS[0].value);
  const [file, setFile] = useState();

  const usingRemoteLLMs = JSON.parse(localStorage.getItem('app:usingRemoteLLMs')) ?? false;

  const { createTraining, loadingTraining } = useAiTrainingStore();
  const { createTrainingLocalLLM, loadingTrainingLocalLLM } = 
    useAiTrainingStoreLocalLLM();

  const open = query['aitraining-new'] === 'true' || query['aitraining-id'] !== undefined;

  const closeDrawer = () => {
    const newQuery = { ...query };
    delete newQuery['aitraining-new'];
    delete newQuery['aitraining-id'];

    router.replace({ pathname, query: newQuery }, undefined, { shallow: true });
    setSelectedType(TYPE_OPTIONS[0].value)
  };

  useEffect(() => {
    form.resetFields();
    setSelectedType(TYPE_OPTIONS[0].value);
    setFile();
  }, [form]);

  const handleFileReady = (fileWrapper) => {
    setFile(fileWrapper.file);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = { type: values.type };

      switch (values.type) {
        case 'TEXT': {
          payload.content = values.content;
        
          break;
        }
        case 'DOCUMENT': {
          if (!file) {
            message.error('Please upload a file');
            return;
          }
          payload.file = file; // Send raw file, createTraining will handle FormData
        
          break;
        }
        case 'WEBSITE': {
          if (!values.content) {
            message.error('Please input the website URL');
            return;
          }
          payload.content = values.content;
        
          break;
        }
        case 'VIDEO': {
          if (values.content) {
            payload.content = values.content;
          } else if (file) {
            payload.file = file; // Send raw file, createTraining will handle FormData
          } else {
            message.error('Please input the video URL or upload a video file.');
            return;
          }
        
          break;
        }
      }

      if (usingRemoteLLMs) {
        await createTraining(payload);
      } else {
        await createTrainingLocalLLM(payload);
      }
      message.success('Training material created successfully');

      form.resetFields();
      setFile();
      closeDrawer();
    } catch {
      message.error('Failed to save AI training');
    }
  };

  const renderTypeSpecificField = () => {
    switch (selectedType) {
      case 'TEXT': {
        return (
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please input the text content' }]}
          >
            <Input.TextArea rows={6} placeholder="Enter your text content here" />
          </Form.Item>
        );
        
      }
      case 'DOCUMENT': {
        return (
          <Form.Item label="File" required>
            <FileUploader onFileReady={handleFileReady} type='DOCUMENT' />
          </Form.Item>
        );
      }
      case 'WEBSITE': {
        return (
          <Form.Item
            name="content"
            label="URL"
            rules={[{ required: true, message: 'Please input the website URL' }]}
          >
            <Input type='url' />
          </Form.Item>
        );      
      }
      case 'VIDEO': {
        return (
          <>
            <Form.Item
              name="content"
              label="YouTube URL"
              rules={[{ required: false, message: 'Please input the website URL' }]}
            >
              <Input type='url' />
            </Form.Item>
            <div style={{ display: 'flex', alignItems: 'center', width: '45%' }}>
              <Divider sx={{ width: '100%'}} />
              <span style={{ fontWeight: 'bold' }} >OR</span>
              <Divider sx={{ width: '100%'}} />
            </div>
            <Form.Item>
              <FileUploader onFileReady={handleFileReady} type='VIDEO' />
            </Form.Item>          
          </>
        );      
      }
    // No default
    }
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
      {( (usingRemoteLLMs && loadingTraining) || (!usingRemoteLLMs && loadingTrainingLocalLLM) ) ? (
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
              initialValues={{ type: 'TEXT' }}
              onValuesChange={(changedValues) => {
                if (changedValues.type) {
                  setSelectedType(changedValues.type);
                  setFile();
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
                loading={(usingRemoteLLMs && loadingTraining) || (!usingRemoteLLMs && loadingTrainingLocalLLM)}
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
