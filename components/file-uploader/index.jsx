'use client';

import { DeleteOutlined,UploadOutlined } from '@ant-design/icons';
import { Button, Card, message,Typography, Upload } from 'antd';
import Image from 'next/image';
import { useState } from 'react';

const { Text } = Typography;

const acceptedExtensions = {
  'DOCUMENT': ".pdf,.doc,.docx,.txt,.odt,.rtf",
  'VIDEO': ".webm,.mp4"
}

export default function FileUploader({ onFileReady, type }) {
  const [uploadedFile, setUploadedFile] = useState();

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
    setUploadedFile();
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
          accept={acceptedExtensions[type]}
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
            <Image
              src={uploadedFile.previewUrl}
              alt="preview"
              style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
          )}

          {uploadedFile.type === 'video' && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              src={uploadedFile.previewUrl}
              controls
              style={{ width: '100%', maxHeight: 300 }}
            />
          )}

          {uploadedFile.type === 'audio' && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
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
