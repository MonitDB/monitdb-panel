'use client';

import { useState } from 'react';
import { Upload, Card, Typography, Button, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function FileUploader({ onFileReady }) {
  const [uploadedFile, setUploadedFile] = useState(null);

  const beforeUpload = (file) => {
    const mimeType = file.type;

    let fileType;
    if (mimeType.startsWith('image/')) fileType = 'image';
    else if (mimeType.startsWith('video/')) fileType = 'video';
    else if (mimeType.startsWith('audio/')) fileType = 'audio';

    const newFile = { type: fileType, file };

    if (fileType !== 'document') {
      newFile.previewUrl = URL.createObjectURL(file);
    }

    setUploadedFile(newFile);
    onFileReady(newFile);

    // Prevent auto-upload
    return false;
  };

  const handleRemove = () => {
    if (uploadedFile?.previewUrl) {
      URL.revokeObjectURL(uploadedFile.previewUrl);
    }
    setUploadedFile(null);
    message.info('File removed');
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        Upload File
      </Text>

      {!uploadedFile && (
        <Upload
          beforeUpload={beforeUpload}
          showUploadList={false}
          accept=".pdf,.doc,.docx,.txt,.odt,.rtf"
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      )}

      {uploadedFile && (
        <Card
          title={uploadedFile.file.name}
          extra={
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={handleRemove}
            />
          }
        >
          {uploadedFile.type === 'image' && (
            <img
              src={uploadedFile.previewUrl}
              alt="preview"
              style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
          )}

          {uploadedFile.type === 'video' && (
            <video
              src={uploadedFile.previewUrl}
              controls
              style={{ width: '100%', maxHeight: 300 }}
            />
          )}

          {uploadedFile.type === 'audio' && (
            <audio src={uploadedFile.previewUrl} controls style={{ width: '100%' }} />
          )}

          {uploadedFile.type === 'document' && (
            <Text type="secondary">Document selected. Ready to upload.</Text>
          )}
        </Card>
      )}
    </div>
  );
}
