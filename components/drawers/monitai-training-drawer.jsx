import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button, Divider, Drawer, Form, Input, message, Select, Space, Spin, Typography } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { useAiTrainingStore } from '~/services/state-manager/ai-training-store';
import { useAiTrainingStoreLocalLLM } from '~/services/state-manager/ai-training-store-local-llm';

import FileUploader from '../file-uploader';

// ---- Deduped constants (avoid sonarjs/no-duplicate-string) ----
const TRAINING_TYPE = {
  TEXT: 'TEXT',
  DOCUMENT: 'DOCUMENT',
  WEBSITE: 'WEBSITE',
  VIDEO: 'VIDEO',
};

const FIELD = {
  CONTENT: 'content',
};

const ERRORS = {
  UPLOAD_FILE: 'Please upload a file',
  WEBSITE_REQUIRED: 'Please input the website URL',
  VIDEO_REQUIRED: 'Please input the video URL or upload a video file.',
  TEXT_REQUIRED: 'Please input the text content',
  TYPE_REQUIRED: 'Please select the type',
};

const { Option } = Select;

const TYPE_OPTIONS = [
  { label: TRAINING_TYPE.TEXT, value: TRAINING_TYPE.TEXT },
  { label: TRAINING_TYPE.DOCUMENT, value: TRAINING_TYPE.DOCUMENT },
  { label: TRAINING_TYPE.WEBSITE, value: TRAINING_TYPE.WEBSITE },
  { label: TRAINING_TYPE.VIDEO, value: TRAINING_TYPE.VIDEO },
];

const QUERY_KEYS = {
  NEW: 'aitraining-new',
  ID: 'aitraining-id',
};

const AiTrainingDrawer = () => {
  const router = useRouter();
  const { query, pathname } = router;

  const [form] = Form.useForm();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedType, setSelectedType] = useState(TYPE_OPTIONS[0].value);
  const [file, setFile] = useState();

  // const usingRemoteLLMs = JSON.parse(localStorage.getItem('app:usingRemoteLLMs')) ?? false;
  const usingRemoteLLMs = true;

  const { createTraining, loadingTraining } = useAiTrainingStore();
  const { createTrainingLocalLLM, loadingTrainingLocalLLM } = 
    useAiTrainingStoreLocalLLM();

  const open = query[QUERY_KEYS.NEW] === 'true' || query[QUERY_KEYS.ID] !== undefined;

  const closeDrawer = () => {
    const newQuery = { ...query };
    delete newQuery[QUERY_KEYS.NEW];
    delete newQuery[QUERY_KEYS.ID];

    router.replace({ pathname, query: newQuery }, undefined, { shallow: true });
    form.setFieldsValue({ type: TYPE_OPTIONS[0].value });
    setSelectedType(TYPE_OPTIONS[0].value);
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({ type: TYPE_OPTIONS[0].value });
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
        case TRAINING_TYPE.TEXT: {
          payload[FIELD.CONTENT] = values[FIELD.CONTENT];
          break;
        }
        case TRAINING_TYPE.DOCUMENT: {
          if (!file) {
            message.error(ERRORS.UPLOAD_FILE);
            return;
          }
          payload.file = file; // Send raw file, createTraining will handle FormData
          break;
        }
        case TRAINING_TYPE.WEBSITE: {
          if (!values[FIELD.CONTENT]) {
            message.error(ERRORS.WEBSITE_REQUIRED);
            return;
          }
          payload[FIELD.CONTENT] = values[FIELD.CONTENT];
          break;
        }
        case TRAINING_TYPE.VIDEO: {
          if (values[FIELD.CONTENT]) {
            payload[FIELD.CONTENT] = values[FIELD.CONTENT];
          } else if (file) {
            payload.file = file; // Send raw file, createTraining will handle FormData
          } else {
            message.error(ERRORS.VIDEO_REQUIRED);
            return;
          }
          break;
        }
        // no default
      }

      await (usingRemoteLLMs ? createTraining(payload) : createTrainingLocalLLM(payload));
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
      case TRAINING_TYPE.TEXT: {
        return (
          <Form.Item
            name={FIELD.CONTENT}
            label="Content"
            rules={[{ required: true, message: ERRORS.TEXT_REQUIRED }]}
          >
            <Input.TextArea rows={6} placeholder="Enter your text content here" />
          </Form.Item>
        );
      }
      case TRAINING_TYPE.DOCUMENT: {
        return (
          <Form.Item label="File" required>
            <FileUploader onFileReady={handleFileReady} type={TRAINING_TYPE.DOCUMENT} />
          </Form.Item>
        );
      }
      case TRAINING_TYPE.WEBSITE: {
        return (
          <Form.Item
            name={FIELD.CONTENT}
            label="URL"
            rules={[{ required: true, message: ERRORS.WEBSITE_REQUIRED }]}
          >
            <Input type="url" />
          </Form.Item>
        );
      }
      case TRAINING_TYPE.VIDEO: {
        return (
          <>
            <Form.Item
              name={FIELD.CONTENT}
              label="YouTube URL"
              // NOTE: optional; when required becomes true, use ERRORS.VIDEO_REQUIRED
              rules={[{ required: false, message: ERRORS.WEBSITE_REQUIRED }]}
            >
              <Input type="url" />
            </Form.Item>
            <div style={{ display: 'flex', alignItems: 'center', width: '45%' }}>
              <Divider sx={{ width: '100%' }} />
              <span style={{ fontWeight: 'bold' }}>OR</span>
              <Divider sx={{ width: '100%' }} />
            </div>
            <Form.Item>
              <FileUploader onFileReady={handleFileReady} type={TRAINING_TYPE.VIDEO} />
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
              initialValues={{ type: TRAINING_TYPE.TEXT }}
              onValuesChange={(changedValues) => {
                if (changedValues.type) {
                  setSelectedType(changedValues.type);
                  setFile();
                }
              }}
            >
              <Typography.Title level={5}>Information</Typography.Title>

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
