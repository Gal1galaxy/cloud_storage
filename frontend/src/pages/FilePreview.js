import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Spin, message } from 'antd';
import axios from 'axios';
import ImagePreview from '../components/previews/ImagePreview';
import PDFPreview from '../components/previews/PDFPreview';
import TextPreview from '../components/previews/TextPreview';
import ExcelPreview from '../components/previews/ExcelPreview';
import WordPreview from '../components/previews/WordPreview';

const FilePreview = () => {
  const { fileId } = useParams();
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await axios.get(`/api/files/preview/${fileId}`);
        if (response.data.success) {
          setPreviewData(response.data.preview);
        } else {
          message.error(response.data.error || '预览失败');
        }
      } catch (error) {
        message.error('获取预览数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [fileId]);

  const renderPreview = () => {
    if (!previewData) return null;

    switch (previewData.type) {
      case 'image':
        return <ImagePreview data={previewData} />;
      case 'pdf':
        return <PDFPreview data={previewData} />;
      case 'text':
        return <TextPreview data={previewData} />;
      case 'excel':
        return <ExcelPreview data={previewData} />;
      case 'word':
        return <WordPreview data={previewData} />;
      default:
        return <div>不支持的文件类型</div>;
    }
  };

  return (
    <Card title="文件预览">
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : (
        renderPreview()
      )}
    </Card>
  );
};

export default FilePreview; 