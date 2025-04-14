import React, { useState } from 'react';
import { Card, Button, Space, Modal } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import FilePreview from './FilePreview';
import axios from 'axios';

const ShareLink = ({ file, shareCode }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/files/${file.id}/content?shareCode=${shareCode}`);
      setPreviewFile(response.data);
      setPreviewVisible(true);
    } catch (error) {
      console.error('Error fetching file content:', error);
      message.error('获取文件内容失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="分享文件">
      <p>文件名：{file.filename}</p>
      <p>类型：{file.file_type}</p>
      <p>大小：{(file.file_size / 1024).toFixed(2)} KB</p>
      <Space>
        {file.can_preview && (
          <Button 
            icon={<EyeOutlined />} 
            onClick={handlePreview}
            loading={loading}
          >
            预览
          </Button>
        )}
        <Button 
          icon={<DownloadOutlined />} 
          onClick={() => window.open(`/api/files/download/${file.id}?shareCode=${shareCode}`)}
        >
          下载
        </Button>
      </Space>

      <Modal
        title="文件预览"
        open={previewVisible}
        onCancel={() => {
          setPreviewVisible(false);
          setPreviewFile(null);
        }}
        width={800}
        footer={null}
      >
        <FilePreview fileData={previewFile} />
      </Modal>
    </Card>
  );
};

export default ShareLink; 